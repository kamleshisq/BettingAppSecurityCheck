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
    cron.schedule('*/10 * * * *', async() => {
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
        console.log(openBets, 454545)

        const marketIds = [...new Set(openBets.map(item => item.marketId))];
        console.log(marketIds, "MARKETID")
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
                // console.log(betsWithMarketId.length, "betsWithMarketIdbetsWithMarketId")
                betsWithMarketId.forEach(async(entry) => { 
                    if((entry.selectionName ==  marketresult.result && entry.bettype2 == 'BACK') || (entry.selectionName != marketresult.result && entry.bettype2 == "LAY")){
                        let bet
                        let user
                        let debitCreditAmount 
                        let exposure 
                        if(entry.bettype2 == 'BACK'){
                            debitCreditAmount = parseFloat(entry.Stake * entry.oddValue).toFixed(2)
                            exposure = parseFloat(entry.Stake)
                            bet = await betModel.findByIdAndUpdate(entry._id,{status:"WON", returns:debitCreditAmount, result:marketresult.result})
                            user = await userModel.findByIdAndUpdate(entry.userId,{$inc:{availableBalance: debitCreditAmount, myPL: debitCreditAmount, Won:1, exposure:-parseFloat(entry.Stake), uplinePL:-debitCreditAmount, pointsWL:debitCreditAmount}})
                        }else{
                            bet = await betModel.findByIdAndUpdate(entry._id,{status:"WON", returns:(entry.Stake * 2), result:marketresult.result})
                            debitCreditAmount = parseFloat(entry.Stake).toFixed(2)
                            exposure = (parseFloat(entry.Stake * entry.oddValue) - parseFloat(entry.Stake)).toFixed(2)
                            user = await userModel.findByIdAndUpdate(entry.userId,{$inc:{availableBalance: debitCreditAmount, myPL: debitCreditAmount, Won:1, exposure:-exposure, uplinePL:-debitCreditAmount, pointsWL:debitCreditAmount}})
                        }
                        let description = `Bet for ${bet.match}/stake = ${bet.Stake}/WON`

                        let debitAmountForP = debitCreditAmount
                        for(let i = user.parentUsers.length - 1; i >= 1; i--){
                            let parentUser1 = await userModel.findById(user.parentUsers[i])
                            let parentUser2 = await userModel.findById(user.parentUsers[i - 1])
                            let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                            let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                            parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                            parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                            await userModel.findByIdAndUpdate(user.parentUsers[i], {
                                $inc: {
                                    downlineBalance: debitCreditAmount,
                                    myPL: -parentUser1Amount,
                                    uplinePL: -parentUser2Amount,
                                    lifetimePL: -parentUser1Amount,
                                    pointsWL: debitCreditAmount
                                }
                            });
                        
                            if (i === 1) {
                                await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                                    $inc: {
                                        downlineBalance: debitCreditAmount,
                                        myPL: -parentUser2Amount,
                                        lifetimePL: -parentUser2Amount,
                                        pointsWL: debitCreditAmount
                                    }
                                });
                            }
                            debitAmountForP = parentUser2Amount
                        }
                        await accModel.create({
                            "user_id":user._id,
                            "description": description,
                            "creditDebitamount" : debitCreditAmount,
                            "balance" : user.availableBalance + debitCreditAmount,
                            "date" : Date.now(),
                            "userName" : user.userName,
                            "role_type" : user.role_type,
                            "Remark":"-",
                            "stake": bet.Stake,
                            "transactionId":`${bet.transactionId}`
                          })
                    }else if((entry.secId === "odd_Even_No" && marketresult.result === "lay") || (entry.secId === "odd_Even_Yes" && marketresult.result === "back")) {
                        let bet = await betModel.findByIdAndUpdate(entry._id,{status:"WON", returns:(entry.Stake * entry.oddValue), result:marketresult.result})
                        let user = await userModel.findByIdAndUpdate(entry.userId,{$inc:{availableBalance: parseFloat(entry.Stake * entry.oddValue), myPL: parseFloat(entry.Stake * entry.oddValue), Won:1, exposure:-parseFloat(entry.Stake), uplinePL:-parseFloat(entry.Stake * entry.oddValue), pointsWL:parseFloat(entry.Stake * entry.oddValue)}})
                        let description = `Bet for ${bet.match}/stake = ${bet.Stake}/WON`

                        let debitAmountForP = parseFloat(entry.Stake * entry.oddValue)
                        for(let i = user.parentUsers.length - 1; i >= 1; i--){
                            let parentUser1 = await userModel.findById(user.parentUsers[i])
                            let parentUser2 = await userModel.findById(user.parentUsers[i - 1])
                            let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                            let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                            parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                            parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
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
                    }else{
                        let bet = await betModel.findByIdAndUpdate(entry._id,{status:"LOSS"})
                        let user 
                        let exposure
                        if(entry.bettype2 == 'BACK'){
                            exposure = parseFloat(entry.Stake)
                            user = await userModel.findByIdAndUpdate(entry.userId,{$inc:{Loss:1, exposure:-exposure, result:marketresult.result}})
                        }else{
                            exposure = (parseFloat(entry.Stake * entry.oddValue) - parseFloat(entry.Stake)).toFixed(2)
                            user = await userModel.findByIdAndUpdate(entry.userId,{$inc:{Loss:1, exposure:-exposure, result:marketresult.result}})
                        }
                    }
                })
                
            });
            
          

            
        }

    })
}