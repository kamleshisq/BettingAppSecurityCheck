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
 //NET LOSING COMMISSION

 console.log('net losing commission start ....')
 let commissionMarket = await commissionMarketModel.find()
 let usercommissiondata3
  if(commissionMarket.some(item => (item.marketId == bets[0].marketId) && (item.commisssionStatus == false))){
    await commissionMarket.findOneAndUpdate({marketId:bets[0].marketId},{commisssionStatus:true})

    let filterUser = await commissionModel.find({"$Bookmaker.type":'NET_LOSS'})
    let newfilterUser = filterUser.map(ele => {
        return ele.userId
    })
   
  
    let netLossingCommission = await betModel.aggregate([
      {
        $match:{
            market : { $regex: /^book/i},
            match: `${bets[0].match}`,
            userId:{$in:newfilterUser},
            marketId:`${bets[0].marketId}`,
            status:{$in:['WON','LOSS']}
        }
      },
      {
        $group:{
            _id:'$userName',
            returns:{$sum:{$cond:[{$in:['$status',['LOSS']]},'$returns',{"$subtract": [ "$returns", "$Stake" ]}]}},
            userId:{$first:'$userId'},
            eventId:{$first:'$eventId'},
            gameId:{$first:'$gameId'},
            event:{$first:'$event'},
            marketId:{$first:'$marketId'},
            match:{$first:'$match'},
            eventDate:{$first:'$eventDate'},
            marketName:{$first:'$marketName'}
  
  
        }
    },
      {
        $group: {
          _id: {
            userId: "$_id.userId",
            match: "$_id.match"
          },
          markets: {
            $push: {
              market: "$_id.market",
              totalReturn: "$totalReturn",
              event: "$event",
              percentage: "$percentage",
              sport: "$sport" // Include sport field here as well
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          match: "$_id.match",
          markets: 1
        }
      }
    ]);
    
  
      console.log(netLossingCommission,'netlossingcommission test')
                      
      for(let i = 0;i<netLossingCommission.length;i++) {
        let user = await userModel.findById(netLossingCommission[i].userId)
        try{
                let commission = await commissionModel.find({userId:netLossingCommission[i].userId})
                let commissionPer = 0
                if (commission[0].Bookmaker.type == "NET_LOSS" && commission[0].Bookmaker.status){
                    commissionPer = commission[0].Bookmaker.percentage
                }
                let commissionCoin = ((commissionPer * netLossingCommission[i].returns)/100).toFixed(4)
                if(commissionPer > 0 && commissionCoin > 0){
                    let commissiondata = {
                        userName : user.userName,
                        userId : user._id,
                        eventId : netLossingCommission[i].eventId,
                        sportId : netLossingCommission[i].gameId,
                        seriesName : netLossingCommission[i].event,
                        marketId : netLossingCommission[i].marketId,
                        eventDate : new Date(netLossingCommission[i].eventDate),
                        eventName : netLossingCommission[i].match,
                        commission : commissionCoin,
                        upline : 100,
                        commissionType: 'Net Losing Commission',
                        commissionPercentage:commissionPer,
                        date:Date.now(),
                        marketName:netLossingCommission[i].marketName,
                        loginUserId:user._id,
                        parentIdArray:user.parentUsers
                    }
                    usercommissiondata3 = await newCommissionModel.create(commissiondata)
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
                if (commissionChild[0].Bookmaker.type == "NET_LOSS" && commissionChild[0].Bookmaker.status){
                    commissionPer = commissionChild[0].Bookmaker.percentage
                }
                let commissionCoin = ((commissionPer * netLossingCommission[i].returns)/100).toFixed(4)
                if(commissionPer > 0 && commissionCoin > 0){
                    let commissiondata = {
                        userName : childUser.userName,
                        userId : childUser.id,
                        eventId : netLossingCommission[i].eventId,
                        sportId : netLossingCommission[i].gameId,
                        seriesName : netLossingCommission[i].event,
                        marketId : netLossingCommission[i].marketId,
                        eventDate : new Date(netLossingCommission[i].eventDate),
                        eventName : netLossingCommission[i].match,
                        commission : commissionCoin,
                        upline : 100,
                        commissionType: 'Net Losing Commission',
                        commissionPercentage:commissionPer,
                        date:Date.now(),
                        marketName:netLossingCommission[i].marketName,
                        uniqueId:usercommissiondata3._id,
                        loginUserId:usercommissiondata3.userId,
                        parentIdArray:childUser.parentUsers,
                    }
                    let commissionData = await newCommissionModel.create(commissiondata)
                }
            }
        }catch(err){
            console.log(err)
        }
      }

  }
}