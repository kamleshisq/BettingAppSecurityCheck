socket.on('voidBet', async(data) => {
    try{
        let user = await User.findById(data.LOGINDATA.LOGINUSER._id).select('+password')
        const passcheck = await user.correctPasscode(data.data.password, user.passcode)
        if(passcheck){
            let bet = await Bet.findByIdAndUpdate(data.id, {status:"CANCEL",alertStatus:"CANCEL",remark:data.data.Remark,returns:0});
            let DebitCreditAmount 
            if(bet.bettype2 === "Back"){
                if(bet.marketName.toLowerCase().startsWith('match')){
                    DebitCreditAmount = bet.Stake
                }else if(bet.marketName.toLowerCase().startsWith('book') || bet.marketName.toLowerCase().startsWith('toss')){
                    DebitCreditAmount = bet.Stake
                }else{
                    DebitCreditAmount = bet.Stake
                }
            }else{
                if(bet.marketName.toLowerCase().startsWith('match')){
                    DebitCreditAmount = ((bet.Stake * bet.oddValue) - bet.Stake).toFixed(2)
                }else if(bet.marketName.toLowerCase().startsWith('book') || bet.marketName.toLowerCase().startsWith('toss')){
                    DebitCreditAmount = ((bet.Stake * bet.oddValue)/100).toFixed(2)
                }else{
                    DebitCreditAmount = ((bet.Stake * bet.oddValue)/100).toFixed(2)
                }
            }
            // console.log(bet);
            let user = await User.findByIdAndUpdate(bet.userId, {$inc:{availableBalance: DebitCreditAmount, myPL: DebitCreditAmount, exposure:-DebitCreditAmount}})
            let timelyVoideCheck = await timelyNotificationModel.findOne({marketId : bet.marketId})
            let notification
            if(timelyVoideCheck){
                notification = await timelyNotificationModel.findOneAndUpdate({marketId : bet.marketId}, {message:data.data.Remark})
            }else{
                let timelyNotification = {
                    message : data.data.Remark,
                    userName : user.userName,
                    marketId : bet.marketId
                }
                notification = await timelyNotificationModel.create(timelyNotification)
            }
            let description = `Bet for ${bet.match}/stake = ${bet.Stake}/CANCEL`
            // console.log(user.availableBalance, DebitCreditAmount, user.availableBalance + DebitCreditAmount)
            let userAcc = {
                "user_id":user._id,
                "description": description,
                "creditDebitamount" : DebitCreditAmount,
                "balance" : user.availableBalance + parseFloat(DebitCreditAmount),
                "date" : Date.now(),
                "userName" : user.userName,
                "role_type" : user.role_type,
                "Remark":"-",
                "stake": DebitCreditAmount,
                "transactionId":`${bet.transactionId}`
            }
            
            let debitAmountForP = DebitCreditAmount
              for(let i = user.parentUsers.length - 1; i >= 1; i--){
                  let parentUser1 = await User.findById(user.parentUsers[i])
                  let parentUser2 = await User.findById(user.parentUsers[i - 1])
                  let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                  let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                  parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                  parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                  await User.findByIdAndUpdate(user.parentUsers[i], {
                    $inc: {
                        downlineBalance: DebitCreditAmount,
                        myPL: -parentUser1Amount,
                        uplinePL: -parentUser2Amount,
                        lifetimePL: -parentUser1Amount,
                        pointsWL: DebitCreditAmount
                    }
                });
            
                if (i === 1) {
                    await User.findByIdAndUpdate(user.parentUsers[i - 1], {
                        $inc: {
                            downlineBalance: DebitCreditAmount,
                            myPL: -parentUser2Amount,
                            lifetimePL: -parentUser2Amount,
                            pointsWL: DebitCreditAmount
                        }
                    });
                }
                  debitAmountForP = parentUser2Amount
              }
            
            await AccModel.create(userAcc);
            socket.emit('voidBet', {bet, status:"success"})
        }else{
            socket.emit('voidBet', {status:"fail",msg:'Please provide valide password'})
        }
    }catch(err){
        console.log(err)
        socket.emit("voidBet",{msg:"Please try again leter", status:"fail"})
    }
    })