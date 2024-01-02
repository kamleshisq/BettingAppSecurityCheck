const cron = require('node-cron');
const betModel = require('../model/betmodel');
const accModel = require('../model/accountStatementByUserModel');
const userModel = require("../model/userModel");
const commissionRepportModel = require("../model/commissionReport");
const netCommission = require("../model/netCommissionModel");
const commissionModel = require("../model/CommissionModel");
const commissionMarketModel = require("../model/CommissionMarketsModel");
const Decimal = require('decimal.js');

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

        console.log(openBets.length, 454545)

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
            // let NetLoosingUser = []
            marketIds.forEach(async(marketIds) => {
                let marketresult = result.data.find(item => item.mid === marketIds)
                if(marketresult === undefined){
                    return
                }
                let betsWithMarketId = await betModel.find({status:"OPEN", marketId : marketresult.mid});
                betsWithMarketId.forEach(async(entry) => {
                    if(entry.selectionName ==  marketresult.result && entry.bettype2 == 'BACK' || entry.selectionName != marketresult.result && entry.bettype2 == "LAY"){
                        // console.log("WORKING4564654654")
                        // console.log(entry)
                        let bet = await betModel.findByIdAndUpdate(entry._id,{status:"WON", returns:(entry.Stake * entry.oddValue), result:marketresult.result})
                        let user = await userModel.findByIdAndUpdate(entry.userId,{$inc:{availableBalance: parseFloat(entry.Stake * entry.oddValue), myPL: parseFloat(entry.Stake * entry.oddValue), Won:1, exposure:-parseFloat(entry.Stake), uplinePL:-parseFloat(entry.Stake * entry.oddValue), pointsWL:parseFloat(entry.Stake * entry.oddValue)}})
                        let description = `Bet for ${bet.match}/stake = ${bet.Stake}/WON`
                        // let description2 = `Bet for ${bet.match}/stake = ${bet.Stake}/user = ${user.userName}/WON `
                        // let parentUser

                        // if(user.parentUsers.length < 2){
                        //     parentUser = await userModel.findByIdAndUpdate(user.parentUsers[0], {$inc:{availableBalance: -parseFloat(entry.Stake * entry.oddValue), downlineBalance: parseFloat(entry.Stake * entry.oddValue), myPL: -parseFloat(entry.Stake * entry.oddValue)}})
                        // }else{
                        //     await userModel.updateMany({ _id: { $in: user.parentUsers.slice(2) } }, {$inc:{balance: parseFloat(entry.Stake * entry.oddValue), downlineBalance: parseFloat(entry.Stake * entry.oddValue)}})
                        //     parentUser = await userModel.findByIdAndUpdate(user.parentUsers[1], {$inc:{availableBalance:-parseFloat(entry.Stake * entry.oddValue), downlineBalance: parseFloat(entry.Stake * entry.oddValue), myPL: -parseFloat(entry.Stake * entry.oddValue)}})
                        // }

                        let debitAmountForP = parseFloat(entry.Stake * entry.oddValue)
                        for(let i = user.parentUsers.length - 1; i >= 1; i--){
                            let parentUser1 = await userModel.findById(user.parentUsers[i])
                            let parentUser2 = await userModel.findById(user.parentUsers[i - 1])
                            let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                            let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                            // parentUser1Amount = Math.round(parentUser1Amount * 10000) / 10000;
                            // parentUser2Amount = Math.round(parentUser2Amount * 10000) / 10000;
                            parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                            parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                            // await userModel.findByIdAndUpdate(user.parentUsers[i],{$inc:{downlineBalance:parseFloat(entry.Stake * entry.oddValue), myPL:-(parentUser1Amount), uplinePL: -(parentUser2Amount), lifetimePL:-(parentUser1Amount), pointsWL:parseFloat(entry.Stake * entry.oddValue)}})
                            // if(i === 1){
                            //     await userModel.findByIdAndUpdate(user.parentUsers[i - 1],{$inc:{downlineBalance:parseFloat(entry.Stake * entry.oddValue), myPL:-(parentUser2Amount), lifetimePL:-(parentUser2Amount), pointsWL:parseFloat(entry.Stake * entry.oddValue)}})
                            // }
                            await userModel.findByIdAndUpdate(user.parentUsers[i], {
                                $inc: {
                                    downlineBalance: (entry.Stake * entry.oddValue),
                                    myPL: -parentUser1Amount,
                                    uplinePL: -parentUser2Amount,
                                    lifetimePL: -parentUser1Amount,
                                    pointsWL: (entry.Stake * entry.oddValue)
                                }
                            });
                        
                            if (i === 1) {
                                await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                                    $inc: {
                                        downlineBalance: (entry.Stake * entry.oddValue),
                                        myPL: -parentUser2Amount,
                                        lifetimePL: -parentUser2Amount,
                                        pointsWL: (entry.Stake * entry.oddValue)
                                    }
                                });
                            }
                            debitAmountForP = parentUser2Amount
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

                        // await accModel.create({
                        //   "user_id":parentUser._id,
                        //   "description": description2,
                        //   "creditDebitamount" : -(entry.Stake * entry.oddValue),
                        //   "balance" : parentUser.availableBalance - (entry.Stake * entry.oddValue),
                        //   "date" : Date.now(),
                        //   "userName" : parentUser.userName,
                        //   "role_type" : parentUser.role_type,
                        //   "Remark":"-",
                        //   "stake": bet.Stake,
                        //   "transactionId":`${bet.transactionId}Parent`
                        // })
                        let commissionMarket = await commissionMarketModel.find()
                        if(commissionMarket.some(item => item.marketId == betsWithMarketId.marketId)){
                           try{
                            let commission = await commissionModel.find({userId:user.id})
                            let commissionPer = 0
                            if (betsWithMarketId.marketName == "Match Odds" && commission[0].matchOdd.status){
                                commissionPer = commission[0].matchOdd.percentage
                              }
                              let commissionCoin = ((commissionPer * betsWithMarketId.Stake)/100).toFixed(4)
                              if(commissionPer > 0){
                                let user1 = await userModel.findByIdAndUpdate(user.id, {$inc:{commission:commissionCoin}})
                                // console.log(user)
                                // console.log(user1)
                                let commissionReportData = {
                                    userId:user.id,
                                    market:betsWithMarketId.marketName,
                                    commType:'Win Commission',
                                    percentage:commissionPer,
                                    commPoints:commissionCoin,
                                    event:betsWithMarketId.event,
                                    match:betsWithMarketId.match,
                                    Sport:betsWithMarketId.gameId
                                }
                                let commisssioReport = await commissionRepportModel.create(commissionReportData)
                            }
                            }catch(err){
                                console.log(err)
                            }

                            try{
                                for(let i = user.parentUsers.length - 1; i >= 1; i--){
                                    let childUser = await userModel.findById(user.parentUsers[i])
                                    let parentUser = await userModel.findById(user.parentUsers[i - 1])
                                    let commissionChild = await commissionModel.find({userId:childUser.id})
                                    let commissionPer = 0
                                    if (betsWithMarketId.marketName == "Match Odds" && commissionChild[0].matchOdd.status){
                                        commissionPer = commissionChild[0].matchOdd.percentage
                                      }
                                    let commissionCoin = ((commissionPer * betsWithMarketId.Stake)/100).toFixed(4)
                                    console.log(commissionCoin)
                                    if(commissionPer > 0){
                                        let user1 = await userModel.findByIdAndUpdate(childUser.id, {$inc:{commissionChild:commissionCoin}})
                                        console.log(user1.userName)
                                        let commissionReportData = {
                                            userId:childUser.id,
                                            market:betsWithMarketId.marketName,
                                            commType:'Win Commission',
                                            percentage:commissionPer,
                                            commPoints:commissionCoin,
                                            event:betsWithMarketId.event,
                                            match:betsWithMarketId.match,
                                            Sport:betsWithMarketId.gameId
                                        }
                                        let commisssioReport = await commissionRepportModel.create(commissionReportData)
                                    }
                                }
                            }catch(err){
                                console.log(err)
                            }
                        }

                    }else if((entry.secId === "odd_Even_No" && marketresult.result === "lay") || (entry.secId === "odd_Even_Yes" && marketresult.result === "back")){
                        let bet = await betModel.findByIdAndUpdate(entry._id,{status:"WON", returns:(entry.Stake * entry.oddValue), result:marketresult.result})
                        let user = await userModel.findByIdAndUpdate(entry.userId,{$inc:{availableBalance: parseFloat(entry.Stake * entry.oddValue), myPL: parseFloat(entry.Stake * entry.oddValue), Won:1, exposure:-parseFloat(entry.Stake), uplinePL:-parseFloat(entry.Stake * entry.oddValue), pointsWL:parseFloat(entry.Stake * entry.oddValue)}})
                        console.log(user)
                        let description = `Bet for ${bet.match}/stake = ${bet.Stake}/WON`
                        let description2 = `Bet for ${bet.match}/stake = ${bet.Stake}/user = ${user.userName}/WON `
                        // let parentUser

                        let debitAmountForP = parseFloat(entry.Stake * entry.oddValue)
                        for(let i = user.parentUsers.length - 1; i >= 1; i--){
                            let parentUser1 = await userModel.findById(user.parentUsers[i])
                            let parentUser2 = await userModel.findById(user.parentUsers[i - 1])
                            let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                            let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                            // parentUser1Amount = Math.round(parentUser1Amount * 10000) / 10000;
                            // parentUser2Amount = Math.round(parentUser2Amount * 10000) / 10000;
                            parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                            parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                            // await userModel.findByIdAndUpdate(user.parentUsers[i],{$inc:{downlineBalance:parseFloat(entry.Stake * entry.oddValue), myPL:-(parentUser1Amount), uplinePL: -(parentUser2Amount), lifetimePL:-(parentUser1Amount), pointsWL:parseFloat(entry.Stake * entry.oddValue)}})
                            // if(i === 1){
                            //     await userModel.findByIdAndUpdate(user.parentUsers[i - 1],{$inc:{downlineBalance:parseFloat(entry.Stake * entry.oddValue), myPL:-(parentUser2Amount), lifetimePL:-(parentUser2Amount), pointsWL:parseFloat(entry.Stake * entry.oddValue)}})
                            // }
                            await userModel.findByIdAndUpdate(user.parentUsers[i], {
                                $inc: {
                                    downlineBalance: (entry.Stake * entry.oddValue),
                                    myPL: -parentUser1Amount,
                                    uplinePL: -parentUser2Amount,
                                    lifetimePL: -parentUser1Amount,
                                    pointsWL: (entry.Stake * entry.oddValue)
                                }
                            });
                        
                            if (i === 1) {
                                await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                                    $inc: {
                                        downlineBalance: (entry.Stake * entry.oddValue),
                                        myPL: -parentUser2Amount,
                                        lifetimePL: -parentUser2Amount,
                                        pointsWL: (entry.Stake * entry.oddValue)
                                    }
                                });
                            }
                            debitAmountForP = parentUser2Amount
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

                        // await accModel.create({
                        //   "user_id":parentUser._id,
                        //   "description": description2,
                        //   "creditDebitamount" : -(entry.Stake * entry.oddValue),
                        //   "balance" : parentUser.availableBalance - (entry.Stake * entry.oddValue),
                        //   "date" : Date.now(),
                        //   "userName" : parentUser.userName,
                        //   "role_type" : parentUser.role_type,
                        //   "Remark":"-",
                        //   "stake": bet.Stake,
                        //   "transactionId":`${bet.transactionId}Parent`
                        // })
                    }else{
                        let bet = await betModel.findByIdAndUpdate(entry._id,{status:"LOSS"})
                        let user = await userModel.findByIdAndUpdate(entry.userId,{$inc:{Loss:1, exposure:-parseFloat(entry.Stake), result:marketresult.result}})
                        let commissionMarket = await commissionMarketModel.find()
                        if(commissionMarket.some(item => item.marketId == bet.marketId)){
                            try{
                                let commission = await commissionModel.find({userId:user.id})
                                let commissionPer = 0
                                // if (bet.marketName == "Match Odds" && commission[0].matchOdd.status){
                                //     commissionPer = commission[0].matchOdd.percentage
                                //   }
                                  if ((bet.marketName.startsWith('Bookmake') || bet.marketName.startsWith('TOSS')) && commission[0].Bookmaker.type == "ENTRY_LOSS_" && commission[0].Bookmaker.status){
                                    commissionPer = commission[0].Bookmaker.percentage
                                  }
                                  let commissionCoin = ((commissionPer * bet.Stake)/100).toFixed(4)
                                  if(commissionPer > 0){
                                    let user1 = await userModel.findByIdAndUpdate(user.id, {$inc:{commission:commissionCoin}})
                                    console.log(user)
                                    // console.log(user1)
                                    let commissionReportData = {
                                        userId:user.id,
                                        market:bet.marketName,
                                        commType:'Entry Wise loss Commission',
                                        percentage:commissionPer,
                                        commPoints:commissionCoin,
                                        event:bet.event,
                                        match:bet.match,
                                        Sport:bet.gameId
                                    }
                                    let commisssioReport = await commissionRepportModel.create(commissionReportData)
                                }
                                }catch(err){
                                    console.log(err)
                                } 
                                try{
                                    for(let i = user.parentUsers.length - 1; i >= 1; i--){
                                        let childUser = await userModel.findById(user.parentUsers[i])
                                        let parentUser = await userModel.findById(user.parentUsers[i - 1])
                                        let commissionChild = await commissionModel.find({userId:childUser.id})
                                        let commissionPer = 0
                                        if ((bet.marketName.startsWith('Bookmake') || bet.marketName.startsWith('TOSS')) && commissionChild[0].Bookmaker.type == "ENTRY_LOSS_" && commissionChild[0].Bookmaker.status){
                                          commissionPer = commissionChild[0].Bookmaker.percentage
                                        }
                                        let commissionCoin = ((commissionPer * bet.Stake)/100).toFixed(4)
                                        console.log(commissionCoin)
                                        if(commissionPer > 0){
                                            let user1 = await userModel.findByIdAndUpdate(childUser.id, {$inc:{commissionChild:commissionCoin}})
                                            console.log(user1.userName)
                                            let commissionReportData = {
                                                userId:childUser.id,
                                                market:bet.marketName,
                                                commType:'Net loss Commission',
                                                percentage:commissionPer,
                                                commPoints:commissionCoin,
                                                event:bet.event,
                                                match:bet.match,
                                                Sport:bet.gameId
                                            }
                                            let commisssioReport = await commissionRepportModel.create(commissionReportData)
                                        }
                                    }
                                }catch(err){
                                    console.log(err)
                                }
                        }

                        if(commissionMarket.some(item => item.marketId == bet.marketId)){
                            try{
                                let commission = await commissionModel.find({userId:user.id})
                                let commissionPer = 0
                                // if (bet.marketName == "Match Odds" && commission[0].matchOdd.status){
                                //     commissionPer = commission[0].matchOdd.percentage
                                //   }
                                  if ((bet.marketName.startsWith('Bookmake') || bet.marketName.startsWith('TOSS')) && commission[0].Bookmaker.type == "NET_LOSS" && commission[0].Bookmaker.status){
                                    commissionPer = commission[0].Bookmaker.percentage
                                  }
                                  let commissionCoin = ((commissionPer * bet.Stake)/100).toFixed(4)
                                  if(commissionPer > 0){
                                    let user1 = await userModel.findById(user.id)
                                    console.log(user1)
                                    // console.log(user1)
                                    let commissionReportData = {
                                        userId:user.id,
                                        market:bet.marketName,
                                        // commType:'Entry Wise loss Commission',
                                        percentage:commissionPer,
                                        commPoints:commissionCoin,
                                        event:bet.event,
                                        match:bet.match,
                                        Sport:bet.gameId
                                    }
                                    let commisssioReport = await netCommission.create(commissionReportData)
                                }
                                }catch(err){
                                    console.log(err)
                                } 
                                try{
                                    for(let i = user.parentUsers.length - 1; i >= 1; i--){
                                        let childUser = await userModel.findById(user.parentUsers[i])
                                        let parentUser = await userModel.findById(user.parentUsers[i - 1])
                                        let commissionChild = await commissionModel.find({userId:childUser.id})
                                        let commissionPer = 0
                                        if ((bet.marketName.startsWith('Bookmake') || bet.marketName.startsWith('TOSS')) && commissionChild[0].Bookmaker.type == "NET_LOSS" && commissionChild[0].Bookmaker.status){
                                          commissionPer = commissionChild[0].Bookmaker.percentage
                                        }
                                        let commissionCoin = ((commissionPer * bet.Stake)/100).toFixed(4)
                                        console.log(commissionCoin)
                                        if(commissionPer > 0){
                                            let user1 = await userModel.findById(childUser.id)
                                            // console.log(user1.userName)
                                            let commissionReportData = {
                                                userId:childUser.id,
                                                market:bet.marketName,
                                                // commType:'Net loss Commission',
                                                percentage:commissionPer,
                                                commPoints:commissionCoin,
                                                event:bet.event,
                                                match:bet.match,
                                                Sport:bet.gameId
                                            }
                                            let commisssioReport = await netCommission.create(commissionReportData)
                                        }
                                    }
                                }catch(err){
                                    console.log(err)
                                }
                        }
                        
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