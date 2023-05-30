const userModel = require('../model/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const betModel = require("../model/betmodel");
// const { use } = require('../app');

exports.consoleBodyAndURL = catchAsync(async(req, res, next) => {
    console.log(req.body)
    console.log(req.originalUrl)
    next()
})


exports.getUserBalancebyiD = catchAsync(async(req, res, next) => {
    // console.log(req.body)
    const user = await userModel.findById(req.body.userId)
    if(!user){
        return next(new AppError("There is no user with that id", 404))
    }
    res.status(200).json({
        "balance": user.availableBalance,
        "status": "OP_SUCCESS"
    })
});

exports.betrequest = catchAsync(async(req, res, next) => {
    let user = await userModel.findByIdAndUpdate(req.body.userId, {$inc:{balance: -req.body.debitAmount, availableBalance: -req.body.debitAmount}})
    // console.log(user)
    if(!user){
        return next(new AppError("There is no user with that id", 404))
    }
    req.body.result = "Pending"
    let bet = await betModel.create(req.body);
    res.status(200).json({
            "balance":user.availableBalance - req.body.debitAmount,
            "status": "OP_SUCCESS"
        })
});

exports.betResult = catchAsync(async(req, res, next) =>{
    // console.log(req.body)
    let user
    let balance
    if(req.body.creditAmount == 0){
        await betModel.findOneAndUpdate({transactionId:req.body.transactionId},{result:"LOSS"})
        user = await userModel.findById(req.body.userId)
        balance = user.balance
    }else{
        await betModel.findOneAndUpdate({transactionId:req.body.transactionId},{result:"WON", WinAmmount:req.body.creditAmount})
        user = await userModel.findByIdAndUpdate(req.body.userId,{$inc:{balance: req.body.creditAmount, availableBalance: req.body.creditAmount}})
        // console.log(user, 132)
        balance = user.balance + req.body.creditAmount
    }
    res.status(200).json({
        "status":"OP_SUCCESS",
        "balance":balance
    })
})