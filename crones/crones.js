const cron = require('node-cron');
const betModel = require('../model/betmodel');
const accModel = require('../model/accountStatementByUserModel');
const userModel = require("../model/userModel");

module.exports = () => {
    cron.schedule('*/5 * * * * *', async() => {
      console.log("Working")
        const openBets = await betModel.find({status:"OPEN"});
        // console.log(openBets)
        const marketIds = [...new Set(openBets.map(item => item.marketId))];
        // console.log(marketIds)
        // const marketIds = ["1.215179889", "4.1966816382-F2", "4.695918984-F2"]
        const fullUrl = 'https://admin-api.dreamexch9.com/api/dream/markets/result';
        
        // await fetch(fullUrl, {
        //     method:'POST',
        //     headers: { 
        //         'Content-Type': 'application/json',
        //         'accept': 'application/json'
        //         },
        //     body:JSON.stringify(marketIds)
        // }).then(res =>res.json())
        // .then(data => {
        //     result = data
        // })
        let result = {
          "status": 1,
          "data": [
          {
          "result": "Bangladesh",
          "mid": "1.215179889",
          "mType": "match_odd",
          "secId": 7659,
          "resultType": 0
          },
          {
          "result": "0",
          "mid": "4.1966816382-F2",
          "mType": "fancy2",
          "secId": 0,
          "resultType": 2
          },
          {
          "result": "0",
          "mid": "4.695918984-F2",
          "mType": "fancy2",
          "secId": 0,
          "resultType": 2
          }
          ],
          "recallMarkets": [
          "1.215183306",
          "1.215183316",
          "1.215183320",
          "1.215183310",
          "4.51854722-F2",
          "4.859051118-F2",
          "4.287959817-F2",
          "4.730182582-F2",
          "4.2130804111-F2",
          "4.749989595-F2",
          "4.815493958-F2",
          "4.1643605500-F2",
          "4.2022184736-F2",
          "4.1818534366-F2",
          "4.248392616-F2",
          "4.328341980-F2",
          "4.1222487579-F2",
          "4.973284114-F2",
          "4.21097103-F2",
          "4.625200744-F2"
          ]
          }
          console.log(result)
        if(result.data.length != 0){
          console.log(marketIds)
            marketIds.forEach(async(marketIds) => {
                let marketresult = result.data.find(item => item.mid === marketIds)
                console.log(marketresult, 123)
                if(marketresult === []){
                    return
                }
                let betsWithMarketId = await betModel.find({status:"OPEN", marketId : marketresult.mid});
                // let betsWithMarketId = await betModel.find({oddValue:{$ne:undefined}});
                // const groupedData = {};

                betsWithMarketId.forEach(async(entry) => {
                    if(entry.selectionName ==  item.runners){
                        await betModel.findByIdAndUpdate(entry._id,{status:"WON", returns:(entry.Stake * entry.oddValue)})
                        let user = await userModel.findByIdAndUpdate(entry.userId,{$inc:{balance: (entry.Stake * entry.oddValue), availableBalance: (entry.Stake * entry.oddValue), myPL: (entry.Stake * entry.oddValue), Won:1}})
                        let parentUser

                        if(user.parentUsers.length < 2){
                            await userModel.updateMany({ _id: { $in: user.parentUsers } }, {$inc:{balance: (entry.Stake * entry.oddValue), downlineBalance: (entry.Stake * entry.oddValue)}})
                            parentUser = await userModel.findByIdAndUpdate(user.parentUsers[0], {$inc:{availableBalance:-(entry.Stake * entry.oddValue)}})
                        }else{
                            await userModel.updateMany({ _id: { $in: user.parentUsers.slice(1) } }, {$inc:{balance: (entry.Stake * entry.oddValue), downlineBalance: (entry.Stake * entry.oddValue)}})
                            parentUser = await userModel.findByIdAndUpdate(user.parentUsers[1], {$inc:{availableBalance:-(entry.Stake * entry.oddValue)}})
                        }
                        
                        await accModel.findOneAndUpdate({transactionId:entry.transactionId},{
                            $set: {
                              description: { $concat: ['$description', ',WON'] },
                            },
                            creditDebitamount:(entry.Stake * entry.oddValue),
                            balance:user.availableBalance + (entry.Stake * entry.oddValue)
                          })
                        await accModel.findOneAndUpdate({transactionId:`${entry.transactionId}Parent`},{
                            $set: {
                              description: { $concat: ['$description', ',WON'] },
                            },
                            creditDebitamount:-(entry.Stake * entry.oddValue),
                            balance:parentUser.availableBalance - (entry.Stake * entry.oddValue)
                          })

                    }else{
                        await betModel.findByIdAndUpdate(entry._id,{status:"LOSS"})
                        await userModel.findByIdAndUpdate(entry.userId,{$inc:{Loss:1}})

                        await accModel.findOneAndUpdate({transactionId:entry.transactionId},{
                            $set: {
                              description: { $concat: ['$description', ',LOSS'] },
                            }
                          })
                        await accModel.findOneAndUpdate({transactionId:`${entry.transactionId}Parent`},{
                            $set: {
                              description: { $concat: ['$description', ',LOSS'] },
                            }
                          })
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
                //     // let updatedUser = await userModel.findAndUpdate({userName:user.userName}, {})
                //   })
                
            });
            

            
        }

    })
}