const userModel = require('../model/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const betModel = require("../model/betmodel");
const accountStatement = require('../model/accountStatementByUserModel');
const gameModel = require("../model/gameModel");
const path = require('path');
const fs = require('fs');
const verify = require("../utils/verify");//
// const { use } = require('../app');
function readPem (filename) {
    return fs.readFileSync(path.resolve(__dirname, '../prev/' + filename)).toString('ascii');
  }

exports.consoleBodyAndURL = catchAsync(async(req, res, next) => {
    console.log(req.body)
    console.log(req.originalUrl)
    console.log(req.headers)
    let x  = req.body
    const publicKey = readPem("public.pem")
    // console.log(publicKey)
    let result = verify(req.headers.signature, publicKey, x)
    console.log(result, 564)
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
    // console.log(req.body)
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    let date = Date.now()
    let game
    let description
    if(req.body.gameId){
        let game1 = await gameModel.findOne({game_id:req.body.gameId})
        game = game1.game_name
        description = `Bet for game ${game.game_name}, amount ${req.body.debitAmount}`
    }else{
        game = req.body.eventName
        description = `Bet for game ${req.body.eventName}, amount ${req.body.debitAmount}`
    }
    // console.log(game)
    let user = await userModel.findByIdAndUpdate(req.body.userId, {$inc:{balance: -req.body.debitAmount, availableBalance: -req.body.debitAmount, myPL: -req.body.debitAmount}})
    // console.log(user)
    if(!user){
        return next(new AppError("There is no user with that id", 404))
    }
    await userModel.updateMany({ _id: { $in: user.parentUsers } }, {$inc:{balance: -req.body.debitAmount, downlineBalance: -req.body.debitAmount}})
    // let A = await userModel.find({_id:user.parentUsers[0]})
    // console.log(A,123)
    // req.body.result = "Pending"
    let bet = {
        ...req.body,
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
    accountStatement.create(Acc)

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
    let game = await gameModel.findOne({game_id:req.body.gameId})
    // console.log(req.body)
    let user;
    let balance;
    if(req.body.creditAmount == 0){
        await betModel.findOneAndUpdate({transactionId:req.body.transactionId},{status:"LOSS"})
        user = await userModel.findById(req.body.userId)
        balance = user.balance
        let Acc = {
            // "user_id":req.body.userId,
            description:`Bet for game ${game.game_name} LOSS`,
            // "creditDebitamount" : req.body.creditAmount,
            // "balance" : balance,
            // "date" : Date.now(),
            // "userName" : user.userName,
            // "role_type" : user.role_type
        }
        await accountStatement.findOneAndUpdate({transactionId:req.body.transactionId},Acc)
    }else{
        await betModel.findOneAndUpdate({transactionId:req.body.transactionId},{status:"WON", returns:req.body.creditAmount})
        user = await userModel.findByIdAndUpdate(req.body.userId,{$inc:{balance: req.body.creditAmount, availableBalance: req.body.creditAmount, myPL: req.body.creditAmount}})
        // console.log(user.parentUsers)
        balance = user.availableBalance + req.body.creditAmount
        let Acc = {
            // "user_id":req.body.userId,
            description:`Bet for game ${game.game_name} WON and creditAmount is ${req.body.creditAmount}`,
            creditDebitamount: req.body.creditAmount,
            balance: balance,
            // "date" : Date.now(),
            // "userName" : user.userName,
            // "role_type" : user.role_type
        }
        await accountStatement.findOneAndUpdate({transactionId:req.body.transactionId},Acc)
        await userModel.updateMany({ _id: { $in: user.parentUsers } }, {$inc:{balance: req.body.creditAmount, downlineBalance: req.body.creditAmount}})
        // console.log(A)
        // console.log(user, 132)
    }
    res.status(200).json({
        "status":"RS_OK",
        "balance":balance
    })
});

exports.rollBack = catchAsync(async(req, res, next) => {
    let user;
    let balance;
    user = await userModel.findByIdAndUpdate(req.body.userId,{$inc:{balance:req.body.rollbackAmount, availableBalance:req.body.rollbackAmount, myPL: req.body.rollbackAmount}});
    // console.log(user.parentUsers)
    if(!user){
        res.status(200).json({
            "status": "OP_SUCCESS",
            "balance": 0
        })
    }else{
        await userModel.updateMany({ _id: { $in: user.parentUsers } }, {$inc:{balance:req.body.rollbackAmount, downlineBalance:req.body.rollbackAmount}})
        balance = user.balance + req.body.rollbackAmount;
        let bet =  await betModel.findOne({transactionId:req.body.transactionId})
        let acc = await accountStatement.find({transactionId:req.body.transactionId})
        if(bet){
            await betModel.findByIdAndUpdate(bet._id,{returns:0, status:"CANCEL"})
        }
        if(acc){
            await accountStatement.findByIdAndDelete(acc._id)
        }
        res.status(200).json({
            "status": "OP_SUCCESS",
            "balance": balance
        })
    }
})