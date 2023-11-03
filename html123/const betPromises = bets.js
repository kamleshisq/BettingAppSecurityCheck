 const betPromises = bets.map(async (bet) => {
    // console.log(bet, data.result, "DATADATA123456")
    if(!(bet.marketName.toLowerCase().startsWith('book') || bet.marketName.toLowerCase().startsWith('winn') || bet.marketName.toLowerCase().startsWith('match'))){ 
        if(bet.marketId.slice(-2).startsWith('OE')){
            if((bet.secId === "odd_Even_No" && data.result === "LAY") || (bet.secId === "odd_Even_Yes" && data.result === "BACK")) {
                let debitCreditAmount 
                let exposure = bet.exposure
                if(bet.bettype2 == "BACK"){
                    debitCreditAmount = (bet.Stake * bet.oddValue)/100
                }else{
                    debitCreditAmount = bet.Stake
                }
                let thatbet = await betModel.findByIdAndUpdate(bet._id,{status:"WON", returns:debitCreditAmount, result:data.result})
                let user = await userModel.findByIdAndUpdate(bet.userId,{$inc:{availableBalance: debitCreditAmount, myPL: debitCreditAmount, Won:1, exposure:-parseFloat(exposure), uplinePL:-debitCreditAmount, pointsWL:debitCreditAmount}})
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
            }else{
                let thatbet = await betModel.findByIdAndUpdate(bet._id,{status:"LOSS", result:data.result})
                        let user 
                        let exposure = bet.exposure
                        user = await userModel.findByIdAndUpdate(bet.userId, {$inc:{Loss:1, exposure:-exposure, availableBalance: -exposure, myPL:-exposure, uplinePL:exposure, pointsWL:-exposure}})
                        let description = `Bet for ${bet.match}/stake = ${bet.Stake}/LOSS`

                        let debitAmountForP = exposure
                        for(let i = user.parentUsers.length - 1; i >= 1; i--){
                            let parentUser1 = await userModel.findById(user.parentUsers[i])
                            let parentUser2 = await userModel.findById(user.parentUsers[i - 1])
                            let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                            let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                            parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                            parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                            await userModel.findByIdAndUpdate(user.parentUsers[i], {
                                $inc: {
                                    downlineBalance: -exposure,
                                    myPL: parentUser1Amount,
                                    uplinePL: parentUser2Amount,
                                    lifetimePL: parentUser1Amount,
                                    pointsWL: -exposure
                                }
                            });
                        
                            if (i === 1) {
                                await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                                    $inc: {
                                        downlineBalance: -exposure,
                                        myPL: parentUser2Amount,
                                        lifetimePL: parentUser2Amount,
                                        pointsWL: -exposure
                                    }
                                });
                            }
                            debitAmountForP = parentUser2Amount
                        }
                        await accModel.create({
                            "user_id":user._id,
                            "description": description,
                            "creditDebitamount" : -exposure,
                            "balance" : user.availableBalance - exposure,
                            "date" : Date.now(),
                            "userName" : user.userName,
                            "role_type" : user.role_type,
                            "Remark":"-",
                            "stake": bet.Stake,
                            "transactionId":`${bet.transactionId}`
                          })
            }
        }else{
            if(((bet.selectionName.split('@')[1] <=  data.result) && bet.bettype2 == 'BACK') || ((bet.selectionName.split('@')[1] >= data.result) && bet.bettype2 == "LAY")){
                let creditDebitamount 
                        let exposure = bet.exposure
                        if(bet.bettype2 == "BACK"){
                            creditDebitamount = (bet.Stake * bet.oddValue)/100
                        }else{
                            creditDebitamount = bet.Stake
                        }
                        let thatbet = await betModel.findByIdAndUpdate(bet._id,{status:"WON", returns:creditDebitamount, result:data.result})
                        let user = await userModel.findByIdAndUpdate(bet.userId,{$inc:{availableBalance: creditDebitamount, myPL: creditDebitamount, Won:1, exposure:-parseFloat(exposure), uplinePL:-creditDebitamount, pointsWL:creditDebitamount}})
                        let description = `Bet for ${bet.match}/stake = ${bet.Stake}/WON`

                        let debitAmountForP = creditDebitamount
                        for(let i = user.parentUsers.length - 1; i >= 1; i--){
                            let parentUser1 = await userModel.findById(user.parentUsers[i])
                            let parentUser2 = await userModel.findById(user.parentUsers[i - 1])
                            let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                            let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                            parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                            parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                            await userModel.findByIdAndUpdate(user.parentUsers[i], {
                                $inc: {
                                    downlineBalance: creditDebitamount,
                                    myPL: -parentUser1Amount,
                                    uplinePL: -parentUser2Amount,
                                    lifetimePL: -parentUser1Amount,
                                    pointsWL: creditDebitamount
                                }
                            });
                        
                            if (i === 1) {
                                await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                                    $inc: {
                                        downlineBalance: creditDebitamount,
                                        myPL: -parentUser2Amount,
                                        lifetimePL: -parentUser2Amount,
                                        pointsWL: creditDebitamount
                                    }
                                });
                            }
                            debitAmountForP = parentUser2Amount
                        }
                        
                        await accModel.create({
                          "user_id":user._id,
                          "description": description,
                          "creditDebitamount" : creditDebitamount,
                          "balance" : user.availableBalance + creditDebitamount,
                          "date" : Date.now(),
                          "userName" : user.userName,
                          "role_type" : user.role_type,
                          "Remark":"-",
                          "stake": bet.Stake,
                          "transactionId":`${bet.transactionId}`
                        })
            }else{
                let thatbet = await betModel.findByIdAndUpdate(bet._id,{status:"LOSS", result:data.result})
                        let user 
                        let exposure = bet.exposure
                        user = await userModel.findByIdAndUpdate(bet.userId, {$inc:{Loss:1, exposure:-exposure, availableBalance: -exposure, myPL:-exposure, uplinePL:exposure, pointsWL:-exposure}})
                        let description = `Bet for ${bet.match}/stake = ${bet.Stake}/LOSS`

                        let debitAmountForP = exposure
                        for(let i = user.parentUsers.length - 1; i >= 1; i--){
                            let parentUser1 = await userModel.findById(user.parentUsers[i])
                            let parentUser2 = await userModel.findById(user.parentUsers[i - 1])
                            let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                            let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                            parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                            parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                            await userModel.findByIdAndUpdate(user.parentUsers[i], {
                                $inc: {
                                    downlineBalance: -exposure,
                                    myPL: parentUser1Amount,
                                    uplinePL: parentUser2Amount,
                                    lifetimePL: parentUser1Amount,
                                    pointsWL: -exposure
                                }
                            });
                        
                            if (i === 1) {
                                await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                                    $inc: {
                                        downlineBalance: -exposure,
                                        myPL: parentUser2Amount,
                                        lifetimePL: parentUser2Amount,
                                        pointsWL: -exposure
                                    }
                                });
                            }
                            debitAmountForP = parentUser2Amount
                        }
                        await accModel.create({
                            "user_id":user._id,
                            "description": description,
                            "creditDebitamount" : -exposure,
                            "balance" : user.availableBalance - exposure,
                            "date" : Date.now(),
                            "userName" : user.userName,
                            "role_type" : user.role_type,
                            "Remark":"-",
                            "stake": bet.Stake,
                            "transactionId":`${bet.transactionId}`
                          })
            }
        }

    }else{
      if(bet.selectionName.toLowerCase().includes(data.result.toLowerCase()) && bet.bettype2 == 'BACK' || !bet.selectionName.toLowerCase().includes(data.result.toLowerCase()) && bet.bettype2 == 'LAY'){
        let debitCreditAmount;
        let exposure = bet.exposure
        if(bet.bettype2 == 'BACK'){
          if(bet.marketName.toLowerCase().startsWith('match') || bet.marketName.toLowerCase().startsWith('winne')){
            debitCreditAmount = parseFloat((bet.Stake * bet.oddValue).toFixed(2)) - bet.Stake
          }else{
            debitCreditAmount = parseFloat(bet.Stake * bet.oddValue/100).toFixed(2)
          }
          // exposure = parseFloat(bet.Stake)
        }else{
          if(bet.marketName.toLowerCase().startsWith('match')){
            debitCreditAmount = parseFloat(bet.Stake).toFixed(2)
            // exposure = (parseFloat(bet.Stake * bet.oddValue) - parseFloat(bet.Stake)).toFixed(2)
          }else{
            debitCreditAmount = parseFloat(bet.Stake).toFixed(2)
            // exposure = (parseFloat(bet.Stake * bet.oddValue) / 100 ).toFixed(2)
          }
        }
          let bet1 = await betModel.findByIdAndUpdate(bet._id,{status:"WON", returns:debitCreditAmount, result: data.result})
          let user = await userModel.findByIdAndUpdate(bet.userId,{$inc:{availableBalance: debitCreditAmount, myPL: debitCreditAmount, Won:1, exposure:-exposure, uplinePL:-debitCreditAmount, pointsWL:debitCreditAmount}})
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
            "creditDebitamount" : parseFloat(debitCreditAmount),
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
        await betModel.findByIdAndUpdate(bet._id,{status:"LOSS", result: data.result})
        let user 
        let exposure = bet.exposure
        user = await userModel.findByIdAndUpdate(bet.userId, {$inc:{Loss:1, exposure:-exposure, availableBalance: -exposure, myPL:-exposure, uplinePL:exposure, pointsWL:-exposure}})
        let description = `Bet for ${bet.match}/stake = ${bet.Stake}/LOSS`
        let debitAmountForP = exposure
                        for(let i = user.parentUsers.length - 1; i >= 1; i--){
                            let parentUser1 = await userModel.findById(user.parentUsers[i])
                            let parentUser2 = await userModel.findById(user.parentUsers[i - 1])
                            let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                            let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                            parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                            parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                            await userModel.findByIdAndUpdate(user.parentUsers[i], {
                                $inc: {
                                    downlineBalance: -exposure,
                                    myPL: parentUser1Amount,
                                    uplinePL: parentUser2Amount,
                                    lifetimePL: parentUser1Amount,
                                    pointsWL: -exposure
                                }
                            });
                        
                            if (i === 1) {
                                await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                                    $inc: {
                                        downlineBalance: -exposure,
                                        myPL: parentUser2Amount,
                                        lifetimePL: parentUser2Amount,
                                        pointsWL: -exposure
                                    }
                                });
                            }
                            debitAmountForP = parentUser2Amount
                        }
        

                        await accModel.create({
                          "user_id":user._id,
                          "description": description,
                          "creditDebitamount" : -exposure,
                          "balance" : user.availableBalance - exposure,
                          "date" : Date.now(),
                          "userName" : user.userName,
                          "role_type" : user.role_type,
                          "Remark":"-",
                          "stake": bet.Stake,
                          "transactionId":`${bet.transactionId}`
                        })



          //COMMISSSION 
          
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
        
      }
    }
    console.log("GOT GERE ")
    try{
        let checkDelete = await InprogressModel.findOneAndUpdate({marketId : bet.marketId, progressType:'SettleMent'}, {$inc:{settledBet:1}})
        if((checkDelete.settledBet + 1) == checkDelete.length){
          await InprogressModel.findOneAndDelete({marketId : bet.marketId, progressType:'SettleMent'})
          await runnerDataModel.findOneAndDelete({marketId:bet.marketId})
        }
    }catch(err){
        console.log(err)
    }
  });