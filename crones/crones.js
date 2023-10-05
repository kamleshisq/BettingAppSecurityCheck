const cron = require('node-cron');
const betModel = require('../model/betmodel');
const accModel = require('../model/accountStatementByUserModel');
const userModel = require("../model/userModel");
const commissionRepportModel = require("../model/commissionReport");
const netCommission = require("../model/netCommissionModel");
const commissionModel = require("../model/CommissionModel");
const commissionMarketModel = require("../model/CommissionMarketsModel");
const newCommissionModel = require('../model/commissioNNModel');
const Decimal = require('decimal.js');

module.exports = () => {
    cron.schedule('*/10 * * * *', async() => {
      console.log("Working")


//FOR FIND OPEN BET THAT ARE ALLOWED TO SETTLE AUTOMETIC


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

// COMMEN MARKET ID FOR CALL API
        const marketIds = [...new Set(openBets.map(item => item.marketId))];

//CALL API FOR RESULTS
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

//IF RESULT IS NOT EMPTY THAN PROCEED 
        if(result.data.length != 0){
            marketIds.forEach(async(marketIds) => {
//FIND THE RESULT OF THAT PERTICULAR MARKET ID 
                let marketresult = result.data.find(item => item.mid === marketIds)
                if(marketresult === undefined){
                    return
                }

//FIND ALL BETS TAHT ARE BELOPNG TO THAT PERTICULAR MARKETS
                let betsWithMarketId = await betModel.find({status:"OPEN", marketId : marketresult.mid});
                betsWithMarketId.forEach(async(entry) => { 

//IF BET IS FOR MATCH ODDS OR BOOKMAKER
                    if((entry.selectionName ==  marketresult.result && entry.bettype2 == 'BACK') || (entry.selectionName != marketresult.result && entry.bettype2 == "LAY")){
                        let bet
                        let user
                        let debitCreditAmount 
                        let exposure 
                        if(entry.bettype2 == 'BACK'){
                            if(entry.marketName.toLowerCase().startsWith('match')){
                                debitCreditAmount = parseFloat(entry.Stake * entry.oddValue).toFixed(2)
                            }else{
                                debitCreditAmount = (parseFloat(entry.Stake * entry.oddValue/100).toFixed(2)) + parseFloat(entry.Stake)
                            }
                            exposure = parseFloat(entry.Stake)
                            bet = await betModel.findByIdAndUpdate(entry._id,{status:"WON", returns:debitCreditAmount, result:marketresult.result})
                            user = await userModel.findByIdAndUpdate(entry.userId,{$inc:{availableBalance: debitCreditAmount, myPL: debitCreditAmount, Won:1, exposure:-parseFloat(entry.Stake), uplinePL:-debitCreditAmount, pointsWL:debitCreditAmount}})
                        }else{
                            bet = await betModel.findByIdAndUpdate(entry._id,{status:"WON", returns:(entry.Stake * 2), result:marketresult.result})
                            if(entry.marketName.toLowerCase().startsWith('match')){
                                debitCreditAmount = parseFloat(entry.Stake).toFixed(2)
                                exposure = (parseFloat(entry.Stake * entry.oddValue) - parseFloat(entry.Stake)).toFixed(2)
                            }else{
                                debitCreditAmount = parseFloat(entry.Stake).toFixed(2)
                                exposure = (parseFloat(entry.Stake * entry.oddValue) / 100 ).toFixed(2)
                            }
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




//FOR MATCH ODDS COMMISSION
                        let commissionMarket = await commissionMarketModel.find()
                        if(commissionMarket.some(item => item.marketId == betsWithMarketId.marketId)){
                        try{
                            let commission = await commissionModel.find({userId:user.id})
                            let commissionPer = 0
                            if (betsWithMarketId.marketName.toLowerCase().startsWith('match') && commission[0].matchOdd.status){
                                commissionPer = commission[0].matchOdd.percentage
                            }
                            let commissionCoin = ((commissionPer * betsWithMarketId.Stake)/100).toFixed(4)
                            if(commissionPer > 0){
                                let commissiondata = {
                                    userName : user.userName,
                                    userId : user.id,
                                    eventId : betsWithMarketId.eventId,
                                    sportId : betsWithMarketId.gameId,
                                    seriesName : betsWithMarketId.compId,
                                    marketId : marketDetails.marketId,
                                    eventDate : new Date(betsWithMarketId.eventDate),
                                    eventName : betsWithMarketId.match,
                                    commission : commissionCoin,
                                    upline : 100,
                                    commissionType: 'Win Commission',
                                    commissionPercentage:commissionPer
                                }
                                let commissionData = await newCommissionModel.create(commissiondata)
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