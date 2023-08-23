exports.betrequest = catchAsync(async(req, res, next) => {
    const check = await userModel.findById(req.body.userId)
    if(check.availableBalance < 0){
        return "Error: Insufficient balance"
    }
    let betLimit
    if(req.body.sportId){
        betLimit = await betLimitModel.findOne({type:"Sport"})
    }else{
        betLimit = await betLimitModel.findOne({type:"Casino"})
    }
    if(check.exposureLimit === check.exposure){
        console.log("Working")
        await alert.alert("Please try again later, Your exposure Limit is full")
        res.status(404).json({
            "status":"RS_ERRORbalance"
        })
    }else if(betLimit.min_stake > req.body.debitAmount ){
        return `Invalide stake, Please play with atleast minimum stake (${betLimit.min_stake})`
    }else if(betLimit.max_stake < req.body.debitAmount){
        return `Invalide stake, Please play with atmost maximum stake (${betLimit.max_stake})`
    }else if(betLimit.max_odd < req.body.oddValue ){
        return `Invalide odds valur, Please play with atmost maximum odds (${betLimit.max_odd})`
    }
    // console.log(req.body)
    let user = await userModel.findByIdAndUpdate(req.body.userId, {$inc:{balance: -req.body.debitAmount, availableBalance: -req.body.debitAmount, myPL: -req.body.debitAmount, Bets : 1, exposure:req.body.debitAmount, uplinePL: -req.body.debitAmount }})
    // let betDetails = await betLimitModel.find()
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    let date = Date.now()
    let game
    let description
    let description2
    if(req.body.gameId){
        let game1 = await gameModel.findOne({game_id:(req.body.gameId)*1})
        console.log(game1)
        game = game1.game_name
        description = `Bet for game ${game}/amount ${req.body.debitAmount}`
        description2 = `Bet for game ${game}/amount ${req.body.debitAmount}/user = ${user.userName}`
    }else{
        game = req.body.competitionName
        description = `Bet for game ${req.body.eventName}/amount ${req.body.debitAmount}`
        description2 = `Bet for game ${req.body.eventName}/amount ${req.body.debitAmount}/user = ${user.userName}`
    }
    // console.log(game)
    // console.log(user)
    if(!user){
        return next(new AppError("There is no user with that id", 404))
    }
    let parentUser
    if(user.parentUsers.length < 2){
        // await userModel.updateMany({ _id: { $in: user.parentUsers } }, {$inc:{balance: -data.data.stake, downlineBalance: -data.data.stake}})
        // parentUser = await userModel.findByIdAndUpdate(user.parentUsers[0], {$inc:{availableBalance:data.data.stake}})
        parentUser = await userModel.findByIdAndUpdate(user.parentUsers[0],{$inc:{availableBalance:req.body.debitAmount, downlineBalance: -req.body.debitAmount}})
    }else{
        await userModel.updateMany({ _id: { $in: user.parentUsers.slice(2) } }, {$inc:{balance: -req.body.debitAmount, downlineBalance: -req.body.debitAmount}})
        parentUser = await userModel.findByIdAndUpdate(user.parentUsers[1], {$inc:{availableBalance:req.body.debitAmount, downlineBalance: -req.body.debitAmount}})
    }
    // await userModel.updateMany({ _id: { $in: user.parentUsers } }, {$inc:{balance: -req.body.debitAmount, downlineBalance: -req.body.debitAmount}})
    // let A = await userModel.find({_id:user.parentUsers[0]})
    // console.log(A,123)
    // req.body.result = "Pending"
    let bet = {
        ...req.body,
        match   : req.body.eventName,
        date : date,
        event : game,
        status : "OPEN",
        returns : -req.body.debitAmount,
        Stake : req.body.debitAmount,
        userName : user.userName,
        role_type:user.role_type
    }
    // console.log(bet)
    await betModel.create(bet);
    let Acc = {
        "user_id":req.body.userId,
        "description": description,
        "creditDebitamount" : -req.body.debitAmount,
        "balance" : user.availableBalance - req.body.debitAmount,
        "date" : Date.now(),
        "userName" : user.userName,
        "role_type" : user.role_type,
        "Remark":"-",
        "stake": req.body.debitAmount,
        "transactionId":req.body.transactionId
    }
    let Acc2 = {
        "user_id":parentUser._id,
        "description": description2,
        "creditDebitamount" : req.body.debitAmount,
        "balance" : parentUser.availableBalance + (req.body.debitAmount * 1),
        "date" : Date.now(),
        "userName" : parentUser.userName,
        "role_type" : parentUser.role_type,
        "Remark":"-",
        "stake": req.body.debitAmount,
        "transactionId":`${req.body.transactionId}Parent`
    }
    accountStatement.create(Acc)
    accountStatement.create(Acc2)

    if(clientIP == "::ffff:3.9.120.247"){
        res.status(200).json({
            "balance": user.availableBalance - req.body.debitAmount,
            "status": "RS_OK"
        })
    }else{
        res.status(200).json({
            "balance": user.availableBalance - req.body.debitAmount,
            "status": "OP_SUCCESS"
        })
    }
});