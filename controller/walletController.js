const userModel = require('../model/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const betModel = require("../model/betmodel");
const betLimitModel = require("../model/betLimitModel");
const accountStatement = require('../model/accountStatementByUserModel');
const gameModel = require("../model/gameModel");
const path = require('path');
const fs = require('fs');
const verify = require("../utils/verify");//
const alert = require("../server");
// const Decimal = require("decima")
// const { use } = require('../app');
function readPem (filename) {
    return fs.readFileSync(path.resolve(__dirname, '../prev/' + filename), 'utf8')
  }

exports.consoleBodyAndURL = catchAsync(async(req, res, next) => {
    console.log("body:",req.body)
    console.log("signature:", req.headers.signature)
    // console.log(req.ip)
    let x  = req.body
    let publicKey
    if(req.ip == "::ffff:3.9.120.247"){
        publicKey = readPem("publicSport.pem")
    }else{
        publicKey = readPem("publicCasino.pem")
    }
    console.log("PublicKey:",publicKey)
    let result = verify(req.headers.signature, publicKey, x)
    console.log(result)
    if(result){
        next()
    }else{
        return next(new AppError("Please provide a valide signature", 404))
    }
})


exports.getUserBalancebyiD = catchAsync(async(req, res, next) => {
    // console.log(req.body)
    const user = await userModel.findById(req.body.userId)
    if(!user){
        return next(new AppError("There is no user with that id", 404))
    }
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    // console.log(clientIP)
    if(clientIP == "::ffff:3.9.120.247"){
        res.status(200).json({
            "balance": user.availableBalance,
            "status": "RS_OK"
        })
    }else{
        res.status(200).json({
            "balance": user.availableBalance,
            "status": "OP_SUCCESS"
        })
    }
});

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
    let user = await userModel.findByIdAndUpdate(req.body.userId, {$inc:{availableBalance: -req.body.debitAmount, myPL: -req.body.debitAmount, Bets : 1, exposure:req.body.debitAmount, uplinePL:req.body.debitAmount, pointsWL:-req.body.debitAmount}})
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
    // let parentUser
    // if(user.parentUsers.length < 2){
    //     // await userModel.updateMany({ _id: { $in: user.parentUsers } }, {$inc:{balance: -data.data.stake, downlineBalance: -data.data.stake}})
    //     // parentUser = await userModel.findByIdAndUpdate(user.parentUsers[0], {$inc:{availableBalance:data.data.stake}})
    //     parentUser = await userModel.findByIdAndUpdate(user.parentUsers[0],{$inc:{availableBalance:req.body.debitAmount, downlineBalance: -req.body.debitAmount}})
    // }else{
    //     await userModel.updateMany({ _id: { $in: user.parentUsers.slice(2) } }, {$inc:{balance: -req.body.debitAmount, downlineBalance: -req.body.debitAmount}})
    //     parentUser = await userModel.findByIdAndUpdate(user.parentUsers[1], {$inc:{availableBalance:req.body.debitAmount, downlineBalance: -req.body.debitAmount}})
    // }
    let amount = req.body.debitAmount
    for(let i = user.parentUsers.length - 1; i >= 1; i--){
        console.log("WORKING")
        let parentUser1 = await userModel.findById(user.parentUsers[i])
        let parentUser2 = await userModel.findById(user.parentUsers[i-1])
        let parentUser1Amount = (parseFloat(amount) * parseFloat(parentUser1.myShare)/100)
        let parentUser2Amount = (parseFloat(amount) * parseFloat(parentUser1.Share)/100)
        parentUser1Amount = Math.round(parentUser1Amount * 100) / 100;
        parentUser2Amount = Math.round(parentUser2Amount * 100) / 100;
        await userModel.findByIdAndUpdate(user.parentUsers[i], {$inc:{downlineBalance:-parseFloat(req.body.debitAmount), myPL : parentUser1Amount, uplinePL: parentUser2Amount, lifetimePL : parentUser1Amount, pointsWL:-req.body.debitAmount}})
        if(i === 1){
            await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {$inc:{downlineBalance:-parseFloat(req.body.debitAmount), myPL : parentUser2Amount, lifetimePL : parentUser2Amount, pointsWL:-req.body.debitAmount}})
        }
        amount = parentUser2Amount
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
    // let Acc2 = {
    //     "user_id":parentUser._id,
    //     "description": description2,
    //     "creditDebitamount" : req.body.debitAmount,
    //     "balance" : parentUser.availableBalance + (req.body.debitAmount * 1),
    //     "date" : Date.now(),
    //     "userName" : parentUser.userName,
    //     "role_type" : parentUser.role_type,
    //     "Remark":"-",
    //     "stake": req.body.debitAmount,
    //     "transactionId":`${req.body.transactionId}Parent`
    // }
    accountStatement.create(Acc)
    // accountStatement.create(Acc2)

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
        user = await userModel.findByIdAndUpdate(req.body.userId,{$inc:{availableBalance: req.body.creditAmount, myPL: req.body.creditAmount, Won:1, exposure:-bet.Stake, uplinePL:-req.body.creditAmount, pointsWL:req.body.creditAmount}});
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
            let parentUser1Amount = ((parseFloat(debitAmountForP) * parseFloat(parentUser1.myShare))/100)
            let parentUser2Amount = ((parseFloat(debitAmountForP) * parseFloat(parentUser1.Share))/100)
            parentUser1Amount = Math.round(parentUser1Amount * 100) / 100;
            parentUser2Amount = Math.round(parentUser2Amount * 100) / 100;
            await userModel.findByIdAndUpdate(user.parentUsers[i],{$inc:{downlineBalance:req.body.creditAmount, myPL:-(parentUser1Amount), uplinePL: -(parentUser2Amount), lifetimePL:-(parentUser1Amount), pointsWL:req.body.creditAmount}})
            if(i === 1){
                await userModel.findByIdAndUpdate(user.parentUsers[i - 1],{$inc:{downlineBalance:req.body.creditAmount, myPL:-(parentUser2Amount), lifetimePL:-(parentUser2Amount), pointsWL:req.body.creditAmount}})
            }
            debitAmountForP = parentUser2Amount
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

exports.rollBack = catchAsync(async(req, res, next) => {
    let user =  await userModel.findById(req.body.userId)
    // try{
    //     const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    // let user;
    // let balance;
    // let parentUser;
    // user = await userModel.findByIdAndUpdate(req.body.userId,{$inc:{availableBalance:req.body.rollbackAmount, myPL: req.body.rollbackAmount, exposure:-req.body.rollbackAmount, uplinePL:-req.body.rollbackAmount, pointsWL:req.body.rollbackAmount}});
    // console.log(user, "USer")
    // if(!user){
    //     if(clientIP == "::ffff:3.9.120.247"){
    //         res.status(200).json({
    //             "status": "RS_OK",
    //             "balance": 0
    //         })
    //     }else{
    //         res.status(200).json({
    //             "status": "OP_SUCCESS",
    //             "balance": 0
    //         })
    //     }
    // }else{
    //     let game = {}
    //     if(req.body.gameId){
    //         game = await gameModel.findOne({game_id:(req.body.gameId)*1})
    //     }else{
    //         let game1 = await betModel.findOne({transactionId:req.body.transactionId})
    //         game.game_name = game1.match
    //     }
    //     // if(user.parentUsers.length < 2){
    //     //     // await userModel.updateMany({ _id: { $in: user.parentUsers } }, {$inc:{balance: (entry.Stake * entry.oddValue), downlineBalance: (entry.Stake * entry.oddValue)}})
    //     //     parentUser = await userModel.findByIdAndUpdate(user.parentUsers[0], {$inc:{availableBalance: -req.body.rollbackAmount, downlineBalance: req.body.rollbackAmount}})
    //     // }else{
    //     //     await userModel.updateMany({ _id: { $in: user.parentUsers.slice(2) } }, {$inc:{balance: req.body.rollbackAmount, downlineBalance: req.body.rollbackAmount}})
    //     //     parentUser = await userModel.findByIdAndUpdate(user.parentUsers[1], {$inc:{availableBalance:-req.body.rollbackAmount, downlineBalance: req.body.rollbackAmount}})
    //     // }
    //     let debitAmountForP = req.body.rollbackAmount
    //     for(let i = user.parentUsers.length - 1; i >= 1; i--){
    //         let parentUser1 = await userModel.findById(user.parentUsers[i])
    //         let parentUser2 = await userModel.findById(user.parentUsers[i - 1])
    //         let parentUser1Amount = ((parseFloat(debitAmountForP) * parseFloat(parentUser1.myShare))/100)
    //         let parentUser2Amount = ((parseFloat(debitAmountForP) * parseFloat(parentUser1.Share))/100)
    //         parentUser1Amount = Math.round(parentUser1Amount * 100) / 100;
    //         parentUser2Amount = Math.round(parentUser2Amount * 100) / 100;
    //         await userModel.findByIdAndUpdate(user.parentUsers[i],{$inc:{downlineBalance:req.body.rollbackAmount, myPL:-(parentUser1Amount), uplinePL: -(parentUser2Amount), lifetimePL:-(parentUser1Amount), pointsWL:req.body.rollbackAmount}})
    //         if(i === 1){
    //             await userModel.findByIdAndUpdate(user.parentUsers[i - 1],{$inc:{downlineBalance:req.body.rollbackAmount, myPL:-(parentUser2Amount), lifetimePL:-(parentUser2Amount), pointsWL:req.body.rollbackAmount}})
    //         }
    //         debitAmountForP = parentUser2Amount
    //     }
    //     balance = user.balance + req.body.rollbackAmount;
    //     let bet =  await betModel.findOne({transactionId:req.body.transactionId})
    //     let acc = await accountStatement.find({transactionId:req.body.transactionId})
    //     if(bet){
    //         await betModel.findByIdAndUpdate(bet._id,{returns:0, status:"CANCEL"})
    //         let description = `Bet for ${game.game_name}/stake = ${bet.Stake}/CANCEL`
    //         let description2 = `Bet for ${game.game_name}/stake = ${bet.Stake}/user = ${user.userName}/CANCEL `
    //         if(acc){
    //             // let Acc2 = {
    //             //     "user_id":parentUser._id,
    //             //     "description": description2,
    //             //     "creditDebitamount" : -req.body.rollbackAmount,
    //             //     "balance" : parentUser.availableBalance - req.body.rollbackAmount,
    //             //     "date" : Date.now(),
    //             //     "userName" : parentUser.userName,
    //             //     "role_type" : parentUser.role_type,
    //             //     "Remark":"-",
    //             //     "stake": req.body.rollbackAmount,
    //             //     "transactionId":req.body.transactionId
    //             // }
    //             let Acc = {
    //                 "user_id":req.body.userId,
    //                 "description": description,
    //                 "creditDebitamount" : req.body.rollbackAmount,
    //                 "balance" : user.availableBalance + req.body.rollbackAmount,
    //                 "date" : Date.now(),
    //                 "userName" : user.userName,
    //                 "role_type" : user.role_type,
    //                 "Remark":"-",
    //                 "stake": req.body.rollbackAmount,
    //                 "transactionId":req.body.transactionId
    //             }
    //             await accountStatement.create(Acc)
    //             // await accountStatement.create(Acc2)
    //         }
    //     }
    //     console.log(balance)
    //     if(clientIP == "::ffff:3.9.120.247"){
    //         res.status(200).json({
    //             "status": "RS_OK",
    //             "balance": balance
    //         })
    //     }else{
    //         res.status(200).json({
    //             "status": "OP_SUCCESS",
    //             "balance": balance
    //         })
    //     }
    // }

    // }catch(err){
    //     console.log(err)
    // }
    
})