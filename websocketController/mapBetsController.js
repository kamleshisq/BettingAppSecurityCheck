const userModel = require("../model/userModel");
const accModel = require("../model/accountStatementByUserModel");
const betModel = require("../model/betmodel");
const commissionRepportModel = require("../model/commissionReport");
const commissionModel = require("../model/CommissionModel");
const commissionMarketModel = require("../model/CommissionMarketsModel");
const netCommission = require("../model/netCommissionModel");
const settlementHistory = require("../model/settelementHistory");
const InprogressModel = require('../model/InprogressModel');
const newCommissionModel = require('../model/commissioNNModel');
const Decimal = require('decimal.js');

exports.mapbet = async(data) => {
  //FOR CHILD OF LOGIN USER
      let childrenUsername = []
      let operatorId;
      if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
        let children = await userModel.find({parentUsers:data.LOGINDATA.LOGINUSER.parent_id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
        operatorId = data.LOGINDATA.LOGINUSER.parent_id

      }else{
        let children = await userModel.find({parentUsers:data.LOGINDATA.LOGINUSER._id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
        operatorId = data.LOGINDATA.LOGINUSER._id

      }
     
//FOR OPEN BETS 
      let bets = await betModel.aggregate([
        {
            $match:{
                marketId:`${data.id}`,
                status:"MAP",
                userName:{$in:childrenUsername}
            }
        },
      ])

// FOR DUMMY TABLE
  let InProgress = await InprogressModel.findOne({marketId : bets[0].marketId, progressType:'SettleMent'})
    if(InProgress === null){
        try{

            let inprogressData = {
              eventId : bets[0].eventId,
              marketId: bets[0].marketId,
              length: bets.length,
              marketName: bets[0].marketName,
              progressType:'SettleMent'
            }
            InProgress = await InprogressModel.create(inprogressData)
        }catch(err){
            console.log(err)
        }
    }


//FOR SATTLEMENT HISTORY

    let dataForHistory = {
      marketID:`${data.id}`,
      userId:`${operatorId}`,
      eventName: `${bets[0].match}`,
      date:Date.now(),
      result:data.result,
      marketName : `${bets[0].marketName}`
    }
    await settlementHistory.create(dataForHistory)



//FUNCTION FOR PROCESS BET

async function processBets() {
  const betPromises = bets.map(async (bet) => {
      if(data.result === "yes" || data.result === "no"){
          if(bet.secId === "odd_Even_Yes" && data.result === "yes" || bet.secId === "odd_Even_No" && data.result === "no" ){
            let creditDebitAmount = (parseFloat(bet.Stake * bet.oddValue) / 100).toFixed(2)
              let bet1 = await betModel.findByIdAndUpdate(bet._id,{status:"WON", returns:creditDebitAmount, result: data.result})
                      let user = await userModel.findByIdAndUpdate(bet.userId,{$inc:{availableBalance: creditDebitAmount, myPL: creditDebitAmount, Won:1, exposure:- parseFloat(bet.Stake), uplinePL:-creditDebitAmount, pointsWL:creditDebitAmount}})
                      let description = `Bet for /stake = ${bet.Stake}/WON`
                      
                      let debitAmountForP = creditDebitAmount
                      for(let i = user.parentUsers.length - 1; i >= 1; i--){
                          let parentUser1 = await userModel.findById(user.parentUsers[i])
                          let parentUser2 = await userModel.findById(user.parentUsers[i - 1])
                          let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                          let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                          parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                          parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                          await userModel.findByIdAndUpdate(user.parentUsers[i], {
                            $inc: {
                                downlineBalance: creditDebitAmount,
                                myPL: -parentUser1Amount,
                                uplinePL: -parentUser2Amount,
                                lifetimePL: -parentUser1Amount,
                                pointsWL: creditDebitAmount
                            }
                        });
                    
                        if (i === 1) {
                            await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                                $inc: {
                                    downlineBalance: creditDebitAmount,
                                    myPL: -parentUser2Amount,
                                    lifetimePL: -parentUser2Amount,
                                    pointsWL: creditDebitAmount
                                }
                            });
                        }
                          debitAmountForP = parentUser2Amount
                      }
                      
                      await accModel.create({
                        "user_id":user._id,
                        "description": description,
                        "creditDebitamount" : creditDebitAmount,
                        "balance" : user.availableBalance + creditDebitAmount,
                        "date" : Date.now(),
                        "userName" : user.userName,
                        "role_type" : user.role_type,
                        "Remark":"-",
                        "stake": bet.Stake,
                        "transactionId":`${bet.transactionId}`
                      })
          }else{
            let user = await userModel.findById(bet.userId)
            let commissionPer = 0
            await betModel.findByIdAndUpdate(bet._id,{status:"LOSS"})
            await userModel.findByIdAndUpdate(bet.userId,{$inc:{Loss:1, exposure:-parseFloat(bet.Stake)}})
          }
      }else{
          if(bet.selectionName.toLowerCase().includes(data.result.toLowerCase()) && bet.bettype2 == 'BACK' || !bet.selectionName.toLowerCase().includes(data.result.toLowerCase()) && bet.bettype2 == 'LAY'){
            let debitCreditAmount;
            let exposure
            if(bet.bettype2 == 'BACK'){
              if(bet.marketName.toLowerCase().startsWith('match')){
                debitCreditAmount = parseFloat(bet.Stake * bet.oddValue).toFixed(2)
              }else{
                debitCreditAmount = parseFloat(bet.Stake * bet.oddValue/100).toFixed(2)
              }
              exposure = parseFloat(entry.Stake)
            }else{
              if(bet.marketName.toLowerCase().startsWith('match')){
                debitCreditAmount = (parseFloat(bet.Stake * bet.oddValue/100).toFixed(2)) + parseFloat(bet.Stake)
                exposure = (parseFloat(bet.Stake * bet.oddValue) - parseFloat(bet.Stake)).toFixed(2)
              }else{
                debitCreditAmount = parseFloat(bet.Stake).toFixed(2)
                exposure = (parseFloat(bet.Stake * bet.oddValue) / 100 ).toFixed(2)
              }
            }
              let bet1 = await betModel.findByIdAndUpdate(bet._id,{status:"WON", returns:debitCreditAmount, result: data.result})
              let user = await userModel.findByIdAndUpdate(bet.userId,{$inc:{availableBalance: debitCreditAmount, myPL: debitCreditAmount, Won:1, exposure:-parseFloat(bet.Stake), uplinePL:-debitCreditAmount, pointsWL:debitCreditAmount}})
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

              //og()
              await accModel.create({
                "user_id":user._id,
                "description": description,
                "creditDebitamount" : parseFloatdebitCreditAmount,
                "balance" : user.availableBalance + debitCreditAmount,
                "date" : Date.now(),
                "userName" : user.userName,
                "role_type" : user.role_type,
                "Remark":"-",
                "stake": bet.Stake,
                "transactionId":`${bet.transactionId}`
              })

              let commissionMarket = await commissionMarketModel.find()
              let usercommissiondata;
                        if(commissionMarket.some(item => item.marketId == bet.marketId)){
                        try{
                            let commission = await commissionModel.find({userId:user.id})
                            let commissionPer = 0
                            if (bet.marketName.toLowerCase().startsWith('match') && commission[0].matchOdd.status){
                                commissionPer = commission[0].matchOdd.percentage
                            }
                            let commissionCoin = ((commissionPer * bet.Stake)/100).toFixed(4)
                            if(commissionPer > 0){
                                let commissiondata = {
                                    userName : user.userName,
                                    userId : user.id,
                                    eventId : bet.eventId,
                                    sportId : bet.gameId,
                                    seriesName : bet.event,
                                    marketId : bet.marketId,
                                    eventDate : new Date(bet.eventDate),
                                    eventName : bet.match,
                                    commission : commissionCoin,
                                    upline : 100,
                                    commissionType: 'Win Commission',
                                    commissionPercentage:commissionPer,
                                    marketName:bet.marketName,
                                    loginUserId:user._id,
                                    parentIdArray:user.parentUsers
                                }
                                usercommissiondata = await newCommissionModel.create(commissiondata)
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
                                    if (bet.marketName.toLowerCase().startsWith('match') && commissionChild[0].matchOdd.status){
                                        commissionPer = commissionChild[0].matchOdd.percentage
                                    }
                                    let commissionCoin = ((commissionPer * bet.Stake)/100).toFixed(4)
                                    if(commissionPer > 0){
                                        let commissiondata = {
                                            userName : childUser.userName,
                                            userId : childUser.id,
                                            eventId : bet.eventId,
                                            sportId : bet.gameId,
                                            seriesName : bet.event,
                                            marketId : bet.marketId,
                                            eventDate : new Date(bet.eventDate),
                                            eventName : bet.match,
                                            commission : commissionCoin,
                                            upline : 100,
                                            commissionType: 'Win Commission',
                                            commissionPercentage:commissionPer,
                                            marketName:bet.marketName,
                                            loginUserId:usercommissiondata.userId,
                                            parentIdArray:childUser.parentUsers,
                                            uniqueId:usercommissiondata._id
                                        }
                                        let commissionData = await newCommissionModel.create(commissiondata)
                                    }
                                }
                            }catch(err){
                                console.log(err)
                            }
                        }
          }else{
            await betModel.findByIdAndUpdate(bet._id,{status:"LOSS"})
            let user 
            let exposure
            if(bet.bettype2 == 'BACK'){
              if(bet.marketName.toLowerCase().startsWith('match')){
                exposure = parseFloat(bet.Stake)
                }else{
                exposure = parseFloat(bet.Stake)
                }
                user = await userModel.findByIdAndUpdate(bey.userId,{$inc:{Loss:1, exposure:-exposure, result:data.result}})
              }else{
                if(entry.marketName.toLowerCase().startsWith('match')){
                  exposure = (parseFloat(bet.Stake * bet.oddValue) - parseFloat(bet.Stake)).toFixed(2)
                }else{
                  exposure = parseFloat(entry.Stake * entry.oddValue/100).toFixed(2)
                }
                user =  await userModel.findByIdAndUpdate(bet.userId,{$inc:{Loss:1, exposure:-exposure}})
              }
              
              let commissionMarket = await commissionMarketModel.find()
              let usercommissiondata;
              if(commissionMarket.some(item => item.marketId == bet.marketId)){
                  try{
                      let commission = await commissionModel.find({userId:user.id})
                      let commissionPer = 0
                      if ((bet.marketName.toLowerCase().startsWith('book') || bet.marketName.toLowerCase().startsWith('toss')) && commission[0].Bookmaker.type == "ENTRY_LOSS_" && commission[0].Bookmaker.status){
                          commissionPer = commission[0].Bookmaker.percentage
                      }
                      let commissionCoin = ((commissionPer * bet.Stake)/100).toFixed(4)
                      if(commissionPer > 0){
                          let commissiondata = {
                              userName : user.userName,
                              userId : user.id,
                              eventId : bet.eventId,
                              sportId : bet.gameId,
                              seriesName : bet.event,
                              marketId : bet.marketId,
                              eventDate : new Date(bet.eventDate),
                              eventName : bet.match,
                              commission : commissionCoin,
                              upline : 100,
                              commissionType: 'Entry Loss Wise Commission',
                              commissionPercentage:commissionPer,
                              date:Date.now(),
                              marketName:bet.marketName,
                              loginUserId:user._id,
                              parentIdArray:user.parentUsers
                          }
                          usercommissiondata = await newCommissionModel.create(commissiondata)
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
                              if ((bet.marketName.toLowerCase().startsWith('book') || bet.marketName.toLowerCase().startsWith('toss')) && commissionChild[0].Bookmaker.type == "ENTRY_LOSS_" && commissionChild[0].Bookmaker.status){
                              commissionPer = commissionChild[0].Bookmaker.percentage
                              }
                              let commissionCoin = ((commissionPer * bet.Stake)/100).toFixed(4)
                              if(commissionPer > 0){
                                  let commissiondata = {
                                      userName : childUser.userName,
                                      userId : childUser.id,
                                      eventId : bet.eventId,
                                      sportId : bet.gameId,
                                      seriesName : bet.event,
                                      marketId : bet.marketId,
                                      eventDate : new Date(bet.eventDate),
                                      eventName : bet.match,
                                      commission : commissionCoin,
                                      upline : 100,
                                      commissionType: 'Entry Loss Wise Commission',
                                      commissionPercentage:commissionPer,
                                      date:Date.now(),
                                      marketName:bet.marketName,
                                      loginUserId:usercommissiondata.userId,
                                      parentIdArray:childUser.parentUsers,
                                      uniqueId:usercommissiondata._id
                                  }
                                  let commissionData = await newCommissionModel.create(commissiondata)
                              }
                          }
                      }catch(err){
                          console.log(err)
                      }
              } 


              // console.log(bet.marketId)
            //   console.log(commissionMarket, "CommissionMarket")
            //   if(commissionMarket.some(item => item.marketId == bet.marketId)){
            //     console.log('work111111111111111111111111111111111111111111111111')
            //     try{
            //         let commission = await commissionModel.find({userId:user.id})
            //         let commissionPer = 0
            //         // if (bet.marketName == "Match Odds" && commission[0].matchOdd.status){
            //         //     commissionPer = commission[0].matchOdd.percentage
            //         //   }
            //           if ((bet.marketName.startsWith('Bookmake') || bet.marketName.startsWith('BOOKMAKE') || bet.marketName.startsWith('TOSS')) && commission[0].Bookmaker.type == "NET_LOSS" && commission[0].Bookmaker.status){
            //             commissionPer = commission[0].Bookmaker.percentage
            //           }
            //           let commissionCoin = ((commissionPer * bet.Stake)/100).toFixed(4)
            //           console.log(commissionCoin , "commisiion")
            //           console.log(commissionPer, "Percentage")
            //           if(commissionPer > 0){
            //             let user1 = await userModel.findById(user.id)
            //             // console.log(user1)
            //             // console.log(user1)
            //             let commissionReportData = {
            //                 userId:user.id,
            //                 market:bet.marketName,
            //                 // commType:'Entry Wise loss Commission',
            //                 percentage:commissionPer,
            //                 commPoints:bet.Stake,
            //                 event:bet.event,
            //                 match:bet.match,
            //                 Sport:bet.gameId
            //             }
            //             let commisssioReport = await netCommission.create(commissionReportData)
            //         }
            //         }catch(err){
            //             console.log(err)
            //         } 
            //         try{
            //             for(let i = user.parentUsers.length - 1; i >= 1; i--){
            //                 let childUser = await userModel.findById(user.parentUsers[i])
            //                 let parentUser = await userModel.findById(user.parentUsers[i - 1])
            //                 let commissionChild = await commissionModel.find({userId:childUser.id})
            //                 let commissionPer = 0
            //                 if ((bet.marketName.startsWith('Bookmake') || bet.marketName.startsWith('BOOKMAKE') || bet.marketName.startsWith('TOSS')) && commissionChild[0].Bookmaker.type == "NET_LOSS" && commissionChild[0].Bookmaker.status){
            //                   commissionPer = commissionChild[0].Bookmaker.percentage
            //                 }
            //                 let commissionCoin = ((commissionPer * bet.Stake)/100).toFixed(4)
            //                 // console.log(commissionCoin , "commisiion")
            //                 if(commissionPer > 0){
            //                     let user1 = await userModel.findById(childUser.id)
            //                     // console.log(user1.userName)
            //                     let commissionReportData = {
            //                         userId:childUser.id,
            //                         market:bet.marketName,
            //                         // commType:'Net loss Commission',
            //                         percentage:commissionPer,
            //                         commPoints:bet.Stake,
            //                         event:bet.event,
            //                         match:bet.match,
            //                         Sport:bet.gameId
            //                     }
            //                     let commisssioReport = await netCommission.create(commissionReportData)
            //                 }
            //             }
            //         }catch(err){
            //             console.log(err)
            //         }
            // }
            
          }
      }
      let checkDelete = await InprogressModel.findOneAndUpdate({marketId : bet.marketId, progressType:'SettleMent'}, {$inc:{settledBet:1}})
      if((checkDelete.settledBet + 1) == checkDelete.length){
        await InprogressModel.findOneAndDelete({marketId : bet.marketId, progressType:'SettleMent'})
      }
  });

  await Promise.all(betPromises);

  // let NetData = await netCommission.aggregate([
  //   {
  //     $match :{
  //       market:`${bets[0].marketName}`,
  //       match: `${bets[0].match}`
  //     }
  //   },
  //   {
  //     $group: {
  //       _id: {
  //         userId: "$userId",
  //         match: "$match",
  //         market: "$market"
  //       },
  //       totalReturn: { $sum: "$commPoints" },
  //       event: { $first: "$event" },
  //       percentage: { $first: "$percentage" },
  //       sport: { $first: "$Sport" } 
  //     }
  //   },
  //   {
  //     $group: {
  //       _id: {
  //         userId: "$_id.userId",
  //         match: "$_id.match"
  //       },
  //       markets: {
  //         $push: {
  //           market: "$_id.market",
  //           totalReturn: "$totalReturn",
  //           event: "$event",
  //           percentage: "$percentage",
  //           sport: "$sport" // Include sport field here as well
  //         }
  //       }
  //     }
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       userId: "$_id.userId",
  //       match: "$_id.match",
  //       markets: 1
  //     }
  //   }
  // ]);
  

  // console.log(NetData, "metDATA")
  // try{
  //   for(let i = 0; i < NetData.length; i++){
  //     // console.log("forLoop2")
  //     // console.log(NetData[i])
  //     // console.log(NetData[i].markets)
  //     for(let j = 0 ; j < NetData[i].markets.length; j++){
  //       let coint = ((NetData[i].markets[j].totalReturn * NetData[i].markets[j].percentage)/100).toFixed(4)
  //       let user = await userModel.findByIdAndUpdate(NetData[i].userId, {$inc:{netCommisssion: -coint, commission:coint  }})
  //         console.log(user, "user")
  //         let commissionReportData = {
  //           userId:NetData[i].userId,
  //           market:NetData[i].markets[j].market,
  //           commType:'Net lossing Commission',
  //           percentage:NetData[i].markets[j].percentage,
  //           commPoints:coint,
  //           event:NetData[i].markets[j].event,
  //           match:NetData[i].match,
  //           Sport:NetData[i].markets[j].sport
  //       }
  //       let commisiionReports = await commissionRepportModel.create(commissionReportData)
  //     }
  //     await netCommission.deleteMany({userId:NetData[i].userId, match:NetData[i].match})
  //   }
  // }catch(err){
  //   console.log(err)
  // }
}
}