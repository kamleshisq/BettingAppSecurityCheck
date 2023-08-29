const userModel = require("../model/userModel");
const accModel = require("../model/accountStatementByUserModel");
const betModel = require("../model/betmodel");
const commissionRepportModel = require("../model/commissionReport");
const commissionModel = require("../model/CommissionModel");
const commissionMarketModel = require("../model/CommissionMarketsModel");
// const commissionModel = require("../model/CommissionModel")
const settlementHistory = require("../model/settelementHistory");
const Decimal = require('decimal.js');

exports.mapbet = async(data) => {
    //og(data)
    // let bets = await betModel.find({marketId:`${data.id}`})
    let bets = await betModel.aggregate([
        {
            $match:{
                marketId:`${data.id}`,
                status:"OPEN"
            }
        },
        {
            $lookup: {
              from: "users",
              localField: "userName",
              foreignField: "userName",
              as: "user"
            }
          },
          {
            $unwind: "$user"
          },
          {
            $match: {
              "user.parentUsers": { $in: [data.LOGINDATA.LOGINUSER._id] }
            }
          },
    ])
    // console.log(bets[0], 456456456)
    let dataForHistory = {
      marketID:`${data.id}`,
      userId:`${data.LOGINDATA.LOGINUSER._id}`,
      eventName: `${bets[0].match}`,
      date:Date.now(),
      result:data.result,
      marketName : `${bets[0].marketName}`
    }
    await settlementHistory.create(dataForHistory)
    bets.forEach(async(bet) => {
        if(data.result === "yes" || data.result === "no"){
            if(bet.secId === "odd_Even_Yes" && data.result === "yes" || bet.secId === "odd_Even_No" && data.result === "no" ){
                let bet1 = await betModel.findByIdAndUpdate(bet._id,{status:"WON", returns:parseFloat(bet.Stake * bet.oddValue)})
                        let user = await userModel.findByIdAndUpdate(bet.userId,{$inc:{availableBalance: parseFloat(bet.Stake * bet.oddValue), myPL: parseFloat(bet.Stake * bet.oddValue), Won:1, exposure:- parseFloat(bet.Stake), uplinePL:-parseFloat(bet.Stake * bet.oddValue), pointsWL:parseFloat(bet.Stake * bet.oddValue)}})
                        //og(user)
                        let description = `Bet for /stake = ${bet.Stake}/WON`
                        let description2 = `Bet for ${bet.match}/stake = ${bet.Stake}/user = ${user.userName}/WON `
                        // let parentUser

                        // if(user.parentUsers.length < 2){
                        //     // await userModel.updateMany({ _id: { $in: user.parentUsers } }, {$inc:{balance: (bet.Stake * bet.oddValue), downlineBalance: (bet.Stake * bet.oddValue)}})
                        //     parentUser = await userModel.findByIdAndUpdate(user.parentUsers[0], {$inc:{availableBalance: -parseFloat(bet.Stake * bet.oddValue), downlineBalance: parseFloat(bet.Stake * bet.oddValue), myPL: -parseFloat(bet.Stake * bet.oddValue)}})
                        // }else{
                        //     await userModel.updateMany({ _id: { $in: user.parentUsers.slice(2) } }, {$inc:{balance: parseFloat(bet.Stake * bet.oddValue), downlineBalance: parseFloat(bet.Stake * bet.oddValue)}})
                        //     parentUser = await userModel.findByIdAndUpdate(user.parentUsers[1], {$inc:{availableBalance: -parseFloat(bet.Stake * bet.oddValue), downlineBalance: parseFloat(bet.Stake * bet.oddValue), myPL: -parseFloat(bet.Stake * bet.oddValue)}})
                        // }
                        let debitAmountForP = parseFloat(bet.Stake * bet.oddValue)
                        for(let i = user.parentUsers.length - 1; i >= 1; i--){
                            let parentUser1 = await userModel.findById(user.parentUsers[i])
                            let parentUser2 = await userModel.findById(user.parentUsers[i - 1])
                            let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                            let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                            // parentUser1Amount = Math.round(parentUser1Amount * 10000) / 10000;
                            // parentUser2Amount = Math.round(parentUser2Amount * 10000) / 10000;
                            parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                            parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                            // await userModel.findByIdAndUpdate(user.parentUsers[i],{$inc:{downlineBalance:parseFloat(bet.Stake * bet.oddValue), myPL:-(parentUser1Amount), uplinePL: -(parentUser2Amount), lifetimePL:-(parentUser1Amount), pointsWL:parseFloat(bet.Stake * bet.oddValue)}})
                            // if(i === 1){
                            //     await userModel.findByIdAndUpdate(user.parentUsers[i - 1],{$inc:{downlineBalance:parseFloat(bet.Stake * bet.oddValue), myPL:-(parentUser2Amount), lifetimePL:-(parentUser2Amount), pointsWL:parseFloat(bet.Stake * bet.oddValue)}})
                            // }
                            await userModel.findByIdAndUpdate(user.parentUsers[i], {
                              $inc: {
                                  downlineBalance: (bet.Stake * bet.oddValue),
                                  myPL: -parentUser1Amount,
                                  uplinePL: -parentUser2Amount,
                                  lifetimePL: -parentUser1Amount,
                                  pointsWL: (bet.Stake * bet.oddValue)
                              }
                          });
                      
                          if (i === 1) {
                              await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                                  $inc: {
                                      downlineBalance: (bet.Stake * bet.oddValue),
                                      myPL: -parentUser2Amount,
                                      lifetimePL: -parentUser2Amount,
                                      pointsWL: (bet.Stake * bet.oddValue)
                                  }
                              });
                          }
                            debitAmountForP = parentUser2Amount
                        }
                        
                        await accModel.create({
                          "user_id":user._id,
                          "description": description,
                          "creditDebitamount" : (bet.Stake * bet.oddValue),
                          "balance" : user.availableBalance + (bet.Stake * bet.oddValue),
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
                        //   "creditDebitamount" : -(bet.Stake * bet.oddValue),
                        //   "balance" : parentUser.availableBalance - (bet.Stake * bet.oddValue),
                        //   "date" : Date.now(),
                        //   "userName" : parentUser.userName,
                        //   "role_type" : parentUser.role_type,
                        //   "Remark":"-",
                        //   "stake": bet.Stake,
                        //   "transactionId":`${bet.transactionId}Parent`
                        // })
            }else{
            let user = await userModel.findById(bet.userId)
              // let commission = await commissionModel.find({userId:user.parentUsers[1]})
              let commissionPer = 0
              // if (commission[0].fency.type == "WIN" && !(bet.marketName.startsWith('Bookmake') || bet.marketName.startsWith('TOSS') || bet.marketName.startsWith('Match Odds'))){
              //   commissionPer = parseFloat(commission[0].fency.percentage)/100
              // }
              
              await betModel.findByIdAndUpdate(bet._id,{status:"LOSS"})
              await userModel.findByIdAndUpdate(bet.userId,{$inc:{Loss:1, exposure:-parseFloat(bet.Stake)}})
              // if(commissionPer > 0){
              //   let WhiteLableUser = await userModel.findByIdAndUpdate(user.parentUsers[1], {$inc:{myPL: - parseFloat(commissionPer * bet.Stake), availableBalance : -parseFloat(commissionPer * bet.Stake)}})
              //   let houseUser = await userModel.findByIdAndUpdate(user.parentUsers[0], {$inc:{myPL: parseFloat(commissionPer * bet.Stake), availableBalance : parseFloat(commissionPer * bet.Stake)}})
              //   await accModel.create({
              //     "user_id":WhiteLableUser._id,
              //     "description": `commission for ${bet.match}/stake = ${bet.Stake}`,
              //     "creditDebitamount" : - parseFloat(commissionPer * bet.Stake),
              //     "balance" : WhiteLableUser.availableBalance - parseFloat(commissionPer * bet.Stake),
              //     "date" : Date.now(),
              //     "userName" : WhiteLableUser.userName,
              //     "role_type" : WhiteLableUser.role_type,
              //     "Remark":"-",
              //     "stake": bet.Stake,
              //     "transactionId":`${bet.transactionId}`
              //   })

              //   await accModel.create({
              //     "user_id":houseUser._id,
              //     "description": `commission for ${bet.match}/stake = ${bet.Stake}/from user ${WhiteLableUser.userName}`,
              //     "creditDebitamount" : parseFloat(commissionPer * bet.Stake),
              //     "balance" : houseUser.availableBalance + parseFloat(commissionPer * bet.Stake),
              //     "date" : Date.now(),
              //     "userName" : houseUser.userName,
              //     "role_type" : houseUser.role_type,
              //     "Remark":"-",
              //     "stake": bet.Stake,
              //     "transactionId":`${bet.transactionId}Parent`
              //   })
              // }
            }
        }else{
            if(bet.selectionName.toLowerCase().includes(data.result.toLowerCase())){
                let bet1 = await betModel.findByIdAndUpdate(bet._id,{status:"WON", returns:parseFloat(bet.Stake * bet.oddValue)})
                let user = await userModel.findByIdAndUpdate(bet.userId,{$inc:{availableBalance: parseFloat(bet.Stake * bet.oddValue), myPL: parseFloat(bet.Stake * bet.oddValue), Won:1, exposure:-parseFloat(bet.Stake), uplinePL:-parseFloat(bet.Stake * bet.oddValue), pointsWL:parseFloat(bet.Stake * bet.oddValue)}})
                let description = `Bet for ${bet.match}/stake = ${bet.Stake}/WON`
                let description2 = `Bet for ${bet.match}/stake = ${bet.Stake}/user = ${user.userName}/WON `
                let parentUser

                // if(user.parentUsers.length < 2){
                //     // await userModel.updateMany({ _id: { $in: user.parentUsers } }, {$inc:{balance: (bet.Stake * bet.oddValue), downlineBalance: (bet.Stake * bet.oddValue)}})
                //     parentUser = await userModel.findByIdAndUpdate(user.parentUsers[0], {$inc:{availableBalance: -parseFloat(bet.Stake * bet.oddValue), downlineBalance: parseFloat(bet.Stake * bet.oddValue), myPL: -parseFloat(bet.Stake * bet.oddValue)}})
                // }else{
                //     await userModel.updateMany({ _id: { $in: user.parentUsers.slice(2) } }, {$inc:{balance: parseFloat(bet.Stake * bet.oddValue), downlineBalance: parseFloat(bet.Stake * bet.oddValue)}})
                //     parentUser = await userModel.findByIdAndUpdate(user.parentUsers[1], {$inc:{availableBalance:-parseFloat(bet.Stake * bet.oddValue), downlineBalance: parseFloat(bet.Stake * bet.oddValue), myPL: -parseFloat(bet.Stake * bet.oddValue)}})
                // }

                let debitAmountForP = parseFloat(bet.Stake * bet.oddValue)
                for(let i = user.parentUsers.length - 1; i >= 1; i--){
                    let parentUser1 = await userModel.findById(user.parentUsers[i])
                    let parentUser2 = await userModel.findById(user.parentUsers[i - 1])
                    let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                    let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                    // parentUser1Amount = Math.round(parentUser1Amount * 10000) / 10000;
                    // parentUser2Amount = Math.round(parentUser2Amount * 10000) / 10000;
                    parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                    parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                    // await userModel.findByIdAndUpdate(user.parentUsers[i],{$inc:{downlineBalance:parseFloat(bet.Stake * bet.oddValue), myPL:-(parentUser1Amount), uplinePL: -(parentUser2Amount), lifetimePL:-(parentUser1Amount), pointsWL:parseFloat(bet.Stake * bet.oddValue)}})
                    // if(i === 1){
                    //     await userModel.findByIdAndUpdate(user.parentUsers[i - 1],{$inc:{downlineBalance:parseFloat(bet.Stake * bet.oddValue), myPL:-(parentUser2Amount), lifetimePL:-(parentUser2Amount), pointsWL:parseFloat(bet.Stake * bet.oddValue)}})
                    // }
                    await userModel.findByIdAndUpdate(user.parentUsers[i], {
                      $inc: {
                          downlineBalance: (bet.Stake * bet.oddValue),
                          myPL: -parentUser1Amount,
                          uplinePL: -parentUser2Amount,
                          lifetimePL: -parentUser1Amount,
                          pointsWL: (bet.Stake * bet.oddValue)
                      }
                  });
              
                  if (i === 1) {
                      await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                          $inc: {
                              downlineBalance: (bet.Stake * bet.oddValue),
                              myPL: -parentUser2Amount,
                              lifetimePL: -parentUser2Amount,
                              pointsWL: (bet.Stake * bet.oddValue)
                          }
                      });
                  }
                    debitAmountForP = parentUser2Amount
                }

                //og()
                await accModel.create({
                  "user_id":user._id,
                  "description": description,
                  "creditDebitamount" : parseFloat(bet.Stake * bet.oddValue),
                  "balance" : user.availableBalance + (bet.Stake * bet.oddValue),
                  "date" : Date.now(),
                  "userName" : user.userName,
                  "role_type" : user.role_type,
                  "Remark":"-",
                  "stake": bet.Stake,
                  "transactionId":`${bet.transactionId}`
                })

                let commissionMarket = await commissionMarketModel.find()
                if(commissionMarket.some(item => item.marketId == bet.marketId)){
                  try{
                    let commission = await commissionModel.find({userId:user.id})
                    let commissionPer = 0
                    if (bet.marketName == "Match Odds" && commission[0].matchOdd.status){
                        commissionPer = commission[0].matchOdd.percentage
                      }
                      let commissionCoin = ((commissionPer * bet.Stake)/100).toFixed(4)
                      if(commissionPer > 0){
                        let user1 = await userModel.findByIdAndUpdate(user.id, {$inc:{commission:commissionCoin}})
                        console.log(user)
                        // console.log(user1)
                        let commissionReportData = {
                            userId:user.id,
                            market:bet.marketName,
                            commType:'Win Commission',
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
                          if (bet.marketName == "Match Odds" && commissionChild[0].matchOdd.status){
                              commissionPer = commissionChild[0].matchOdd.percentage
                            }
                          let commissionCoin = ((commissionPer * bet.Stake)/100).toFixed(4)
                          console.log(commissionCoin)
                          if(commissionPer > 0){
                              let user1 = await userModel.findByIdAndUpdate(childUser.id, {$inc:{commissionChild:commissionCoin}})
                              console.log(user1.userName)
                              let commissionReportData = {
                                  userId:childUser.id,
                                  market:bet.marketName,
                                  commType:'Win Commission',
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
            }else{
              // let user = await userModel.findById(bet.userId)
              // let commission = await commissionModel.find({userId:user.parentUsers[1]})
              // let commissionPer = 0
              // if(bet.marketName.startsWith('Match Odds') && commission[0].matchOdd.type == "WIN"){
              //   commissionPer = parseFloat(commission[0].matchOdd.percentage)/100
              // }else if ((bet.marketName.startsWith('Bookmake') || bet.marketName.startsWith('TOSS')) && commission[0].Bookmaker.type == "WIN"){
              //   commissionPer = parseFloat(commission[0].Bookmaker.percentage)/100
              // }
              await betModel.findByIdAndUpdate(bet._id,{status:"LOSS"})
              let user =  await userModel.findByIdAndUpdate(bet.userId,{$inc:{Loss:1, exposure:-parseFloat(bet.Stake)}})
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
                                  commType:'Entry Wise loss Commission',
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
              // if(commissionPer > 0){
              //     let WhiteLableUser = await userModel.findByIdAndUpdate(user.parentUsers[1], {$inc:{myPL: - parseFloat(commissionPer * bet.Stake), availableBalance : -parseFloat(commissionPer * bet.Stake)}})
              //     let houseUser = await userModel.findByIdAndUpdate(user.parentUsers[0], {$inc:{myPL: parseFloat(commissionPer * bet.Stake), availableBalance : parseFloat(commissionPer * bet.Stake)}})
              //     await accModel.create({
              //       "user_id":WhiteLableUser._id,
              //       "description": `commission for ${bet.match}/stake = ${bet.Stake}`,
              //       "creditDebitamount" : - parseFloat(commissionPer * bet.Stake),
              //       "balance" : WhiteLableUser.availableBalance - parseFloat(commissionPer * bet.Stake),
              //       "date" : Date.now(),
              //       "userName" : WhiteLableUser.userName,
              //       "role_type" : WhiteLableUser.role_type,
              //       "Remark":"-",
              //       "stake": bet.Stake,
              //       "transactionId":`${bet.transactionId}`
              //     })
  
              //     await accModel.create({
              //       "user_id":houseUser._id,
              //       "description": `commission for ${bet.match}/stake = ${bet.Stake}/from user ${WhiteLableUser.userName}`,
              //       "creditDebitamount" : parseFloat(commissionPer * bet.Stake),
              //       "balance" : houseUser.availableBalance + parseFloat(commissionPer * bet.Stake),
              //       "date" : Date.now(),
              //       "userName" : houseUser.userName,
              //       "role_type" : houseUser.role_type,
              //       "Remark":"-",
              //       "stake": bet.Stake,
              //       "transactionId":`${bet.transactionId}Parent`
              //     })
              //   }
            }
        }
    });
}