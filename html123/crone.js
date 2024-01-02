const cron = require('node-cron');
const betModel = require('../model/betmodel');
const accModel = require('../model/accountStatementByUserModel');
const userModel = require("../model/userModel");

module.exports = () => {
    cron.schedule('*/5 * * * *', async() => {
      console.log("Working")
        const openBets = await betModel.aggregate([
            {
                $match: {
                    status: 'OPEN'
                }
            },
            {
                $addFields: {
                  userIdObjectId: { $toObjectId: '$userId' } 
                }
            },
            {
                $lookup: {
                  from: 'users',
                  localField: 'userIdObjectId',
                  foreignField: '_id',
                  as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $lookup: {
                  from: 'statementmodels',
                  let: { parentUserIds: '$user.parentUsers' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $in: ['$userId', '$$parentUserIds'] 
                        }
                      }
                    }
                  ],
                  as: 'settlement'
                }
            },
            {
              $match: {
                  $expr: {
                      $eq: [
                          { $size: "$settlement" },
                          {
                              $size: {
                                  $filter: {
                                      input: "$settlement",
                                      as: "settlementStatus",
                                      cond: { $eq: ["$$settlementStatus.status", true] } 
                                  }
                              }
                          }
                      ]
                  }
              }
          }
        ])

        console.log(openBets)
        const marketIds = [...new Set(openBets.map(item => item.marketId))];
        const fullUrl = 'https://admin-api.dreamexch9.com/api/dream/markets/result';
        let result;
        await fetch(fullUrl, {
            method:'POST',
            headers: { 
                'Content-Type': 'application/json',
                'accept': 'application/json'
                },
            body:JSON.stringify(marketIds)
        }).then(res =>res.json())
        .then(data => {
            result = data
        })
        if(result.data.length != 0){
            marketIds.forEach(async(marketIds) => {
                let marketresult = result.data.find(item => item.mid === marketIds)
                if(marketresult === undefined){
                    return
                }
                let betsWithMarketId = await betModel.find({status:"OPEN", marketId : marketresult.mid});
                betsWithMarketId.forEach(async(entry) => {
                    if(entry.selectionName ==  marketresult.result){
                        console.log("WORKING4564654654")
                        console.log(entry)
                        let bet = await betModel.findByIdAndUpdate(entry._id,{status:"WON", returns:(entry.Stake * entry.oddValue)})
                        let user = await userModel.findByIdAndUpdate(entry.userId,{$inc:{balance: parseFloat(entry.Stake * entry.oddValue), availableBalance: parseFloat(entry.Stake * entry.oddValue), myPL: parseFloat(entry.Stake * entry.oddValue), Won:1, exposure:-parseFloat(entry.Stake)}})
                        let description = `Bet for ${bet.match}/stake = ${bet.Stake}/WON`
                        let description2 = `Bet for ${bet.match}/stake = ${bet.Stake}/user = ${user.userName}/WON `
                        let parentUser

                        if(user.parentUsers.length < 2){
                            parentUser = await userModel.findByIdAndUpdate(user.parentUsers[0], {$inc:{availableBalance: -parseFloat(entry.Stake * entry.oddValue), downlineBalance: parseFloat(entry.Stake * entry.oddValue), myPL: -parseFloat(entry.Stake * entry.oddValue)}})
                        }else{
                            await userModel.updateMany({ _id: { $in: user.parentUsers.slice(2) } }, {$inc:{balance: parseFloat(entry.Stake * entry.oddValue), downlineBalance: parseFloat(entry.Stake * entry.oddValue)}})
                            parentUser = await userModel.findByIdAndUpdate(user.parentUsers[1], {$inc:{availableBalance:-parseFloat(entry.Stake * entry.oddValue), downlineBalance: parseFloat(entry.Stake * entry.oddValue), myPL: -parseFloat(entry.Stake * entry.oddValue)}})
                        }
                        
                        await accModel.create({
                          "user_id":user._id,
                          "description": description,
                          "creditDebitamount" : (entry.Stake * entry.oddValue),
                          "balance" : user.availableBalance + (entry.Stake * entry.oddValue),
                          "date" : Date.now(),
                          "userName" : user.userName,
                          "role_type" : user.role_type,
                          "Remark":"-",
                          "stake": bet.Stake,
                          "transactionId":`${bet.transactionId}`
                        })

                        await accModel.create({
                          "user_id":parentUser._id,
                          "description": description2,
                          "creditDebitamount" : -(entry.Stake * entry.oddValue),
                          "balance" : parentUser.availableBalance - (entry.Stake * entry.oddValue),
                          "date" : Date.now(),
                          "userName" : parentUser.userName,
                          "role_type" : parentUser.role_type,
                          "Remark":"-",
                          "stake": bet.Stake,
                          "transactionId":`${bet.transactionId}Parent`
                        })

                    }else if((entry.secId === "odd_Even_No" && marketresult.result === "lay") || (entry.secId === "odd_Even_Yes" && marketresult.result === "back")){
                        let bet = await betModel.findByIdAndUpdate(entry._id,{status:"WON", returns:(entry.Stake * entry.oddValue)})
                        let user = await userModel.findByIdAndUpdate(entry.userId,{$inc:{balance: parseFloat(entry.Stake * entry.oddValue), availableBalance: parseFloat(entry.Stake * entry.oddValue), myPL: parseFloat(entry.Stake * entry.oddValue), Won:1, exposure:-parseFloat(entry.Stake)}})
                        console.log(user)
                        let description = `Bet for ${bet.match}/stake = ${bet.Stake}/WON`
                        let description2 = `Bet for ${bet.match}/stake = ${bet.Stake}/user = ${user.userName}/WON `
                        let parentUser

                        if(user.parentUsers.length < 2){
                            // await userModel.updateMany({ _id: { $in: user.parentUsers } }, {$inc:{balance: (entry.Stake * entry.oddValue), downlineBalance: (entry.Stake * entry.oddValue)}})
                            parentUser = await userModel.findByIdAndUpdate(user.parentUsers[0], {$inc:{availableBalance: -parseFloat(entry.Stake * entry.oddValue), downlineBalance: parseFloat(entry.Stake * entry.oddValue), myPL: -parseFloat(entry.Stake * entry.oddValue)}})
                        }else{
                            await userModel.updateMany({ _id: { $in: user.parentUsers.slice(2) } }, {$inc:{balance: parseFloat(entry.Stake * entry.oddValue), downlineBalance: parseFloat(entry.Stake * entry.oddValue)}})
                            parentUser = await userModel.findByIdAndUpdate(user.parentUsers[1], {$inc:{availableBalance: -parseFloat(entry.Stake * entry.oddValue), downlineBalance: parseFloat(entry.Stake * entry.oddValue), myPL: -parseFloat(entry.Stake * entry.oddValue)}})
                        }
                        
                        await accModel.create({
                          "user_id":user._id,
                          "description": description,
                          "creditDebitamount" : (entry.Stake * entry.oddValue),
                          "balance" : user.availableBalance + (entry.Stake * entry.oddValue),
                          "date" : Date.now(),
                          "userName" : user.userName,
                          "role_type" : user.role_type,
                          "Remark":"-",
                          "stake": bet.Stake,
                          "transactionId":`${bet.transactionId}`
                        })

                        await accModel.create({
                          "user_id":parentUser._id,
                          "description": description2,
                          "creditDebitamount" : -(entry.Stake * entry.oddValue),
                          "balance" : parentUser.availableBalance - (entry.Stake * entry.oddValue),
                          "date" : Date.now(),
                          "userName" : parentUser.userName,
                          "role_type" : parentUser.role_type,
                          "Remark":"-",
                          "stake": bet.Stake,
                          "transactionId":`${bet.transactionId}Parent`
                        })
                    }else{
                        await betModel.findByIdAndUpdate(entry._id,{status:"LOSS"})
                        await userModel.findByIdAndUpdate(entry.userId,{$inc:{Loss:1, exposure:-parseFloat(entry.Stake)}})
                    }
                    // const userName = entry.userName;
                    // const stake = entry.Stake;
                    // const oddValue = entry.oddValue;
                    // const multipliedValue = stake * oddValue;
                    // const marketId = entry.marketId
                  
                    // if (!groupedData[userName]) {
                    //   groupedData[userName] = {
                    //     userName,
                    //     stake: [],
                    //     oddValue:[],
                    //     multipliedValue:[],
                    //     marketId:[]

                    //   };
                    // }
                    // groupedData[userName].stake.push(stake);
                    // groupedData[userName].oddValue.push(oddValue);
                    // groupedData[userName].multipliedValue.push(multipliedValue);
                    // groupedData[userName].marketId.push(marketId);
                  });

                //   const newData = Object.values(groupedData);

                //   newData.forEach(async(user) => {
                //     // let updatedUser = await userModel.updateMany({userName:user.userName}, {})
                //   })
                
            });
            

            
        }

    })
}