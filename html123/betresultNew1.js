exports.betResult = catchAsync(async(req, res, next) =>{
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    let check = await userModel.findById(req.body.userId);
    if(!check){
        if(clientIP == "::ffff:3.9.120.247"){
            return res.status(200).json({
                "balance": 0,
                "status": "RS_OK"
            })
        }else{
            return res.status(200).json({
                "balance": 0,
                "status": "OP_SUCCESS"
            })
        }
    }
    let game = {}
    if(req.body.gameId){
        game = await gameModel.findOne({game_id:(req.body.gameId)*1})
    }else{
        let game1 = await betModel.findOne({transactionId:req.body.transactionId})
        game.game_name = game1.match
    }
    // console.log(req.body)
    let user;
    let balance;
    if(req.body.creditAmount === 0){
        let betforStake = await betModel.findOneAndUpdate({transactionId:req.body.transactionId},{status:"LOSS"})
        user = await userModel.findByIdAndUpdate(req.body.userId,{$inc:{Loss:1, exposure: -parseFloat(betforStake.Stake)}})
        balance = user.balance
        // let Acc = {
        //     // "user_id":req.body.userId,
        //     description:`Bet for game ${game.game_name} LOSS`,
        //     // "creditDebitamount" : req.body.creditAmount,
        //     // "balance" : balance,
        //     // "date" : Date.now(),
        //     // "userName" : user.userName,
        //     // "role_type" : user.role_type
        // }
        // await accountStatement.findOneAndUpdate({transactionId:req.body.transactionId},Acc)
    }else{
        let bet = await betModel.findOneAndUpdate({transactionId:req.body.transactionId},{status:"WON", returns:req.body.creditAmount});
        user = await userModel.findByIdAndUpdate(req.body.userId,{$inc:{availableBalance: req.body.creditAmount, myPL: req.body.creditAmount, Won:1, exposure:-bet.Stake}});
        // let parentUser
        let description = `Bet for ${game.game_name}/stake = ${bet.Stake}/WON`
        let description2 = `Bet for ${game.game_name}/stake = ${bet.Stake}/user = ${user.userName}/WON `
        // if(user.parentUsers.length < 2){
        //     // await userModel.updateMany({ _id: { $in: user.parentUsers } }, {$inc:{balance: (entry.Stake * entry.oddValue), downlineBalance: (entry.Stake * entry.oddValue)}})
        //     parentUser = await userModel.findByIdAndUpdate(user.parentUsers[0], {$inc:{availableBalance: -req.body.creditAmount, downlineBalance: req.body.creditAmount}})
        // }else{
        //     await userModel.updateMany({ _id: { $in: user.parentUsers.slice(2) } }, {$inc:{balance: req.body.creditAmount, downlineBalance: req.body.creditAmount}})
        //     parentUser = await userModel.findByIdAndUpdate(user.parentUsers[1], {$inc:{availableBalance:-req.body.creditAmount, downlineBalance: req.body.creditAmount}})
        // }
        let debitAmountForP = req.body.creditAmount
        for(let i = user.parentUsers.length - 1; i >= 1; i--){
            let parentUser1 = await userModel.findById(user.parentUsers[i])
            let parentUser2 = await userModel.findById(user.parentUsers[i - 1])
            let parentUser1Amount = parseFloat((parseFloat(debitAmountForP) * parseFloat(parentUser1.myShare))/100)
            let parentUser2Amount = parseFloat((parseFloat(debitAmountForP) * parseFloat(parentUser1.Share))/100)
            await userModel.findByIdAndUpdate(user.parentUsers[i],{$inc:{downlineBalance:req.body.creditAmount, myPL:-(parentUser1Amount), uplinePL: -(parentUser2Amount), lifetimePL:-(parentUser1Amount)}})
            if(i === 1){
                await userModel.findByIdAndUpdate(user.parentUsers[i - 1],{$inc:{downlineBalance:req.body.creditAmount, myPL:-(parentUser2Amount), lifetimePL:-(parentUser2Amount)}})
            }
        }
        // console.log(user.parentUsers)
        if(!user){
            if(clientIP == "::ffff:3.9.120.247"){
                res.status(200).json({
                    "balance": 0,
                    "status": "RS_OK"
                })
            }else{
                res.status(200).json({
                    "balance": 0,
                    "status": "OP_SUCCESS"
                })
            }
        }
        balance = user.availableBalance + req.body.creditAmount

        await accountStatement.create({
            "user_id":user._id,
            "description": description,
            "creditDebitamount" : req.body.creditAmount,
            "balance" : user.availableBalance + req.body.creditAmount,
            "date" : Date.now(),
            "userName" : user.userName,
            "role_type" : user.role_type,
            "Remark":"-",
            "stake": bet.Stake,
            "transactionId":`${bet.transactionId}`
          })

        //   await accountStatement.create({
        //     "user_id":parentUser._id,
        //     "description": description2,
        //     "creditDebitamount" : -req.body.creditAmount,
        //     "balance" : parentUser.availableBalance - req.body.creditAmount,
        //     "date" : Date.now(),
        //     "userName" : parentUser.userName,
        //     "role_type" : parentUser.role_type,
        //     "Remark":"-",
        //     "stake": bet.Stake,
        //     "transactionId":`${bet.transactionId}Parent`
        //   })


        // let Acc = {
        //     // "user_id":req.body.userId,
        //     description:`Bet for game ${game.game_name} WON and creditAmount is ${req.body.creditAmount}`,
        //     creditDebitamount: req.body.creditAmount,
        //     balance: balance,
        //     // "date" : Date.now(),
        //     // "userName" : user.userName,
        //     // "role_type" : user.role_type
        // }
        // console.log(user.parentUsers);
        // await accountStatement.findOneAndUpdate({transactionId:req.body.transactionId},Acc)
        // await userModel.updateMany({ _id: { $in: user.parentUsers } }, {$inc:{balance: req.body.creditAmount, downlineBalance: req.body.creditAmount}})
        // console.log(A)
        // console.log(user, 132)
    }

    if(clientIP == "::ffff:3.9.120.247"){
        res.status(200).json({
            "balance": balance,
            "status": "RS_OK"
        })
    }else{
        res.status(200).json({
            "balance": balance,
            "status": "OP_SUCCESS"
        })
    }
});