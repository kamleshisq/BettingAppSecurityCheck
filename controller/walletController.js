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
const Decimal = require("decimal.js")
const loginLogs = require('../model/loginLogs')
const mongoose = require('mongoose');
const exposurecheckfunction = require('../utils/checkExpoOfThatUSer');
const reqIdModel = require('../model/reqIdModel');
// const Decimal = require("decima")
// const { use } = require('../app');
function readPem (filename) {
    return fs.readFileSync(path.resolve(__dirname, '../prev/' + filename), 'utf8')
  }

exports.consoleBodyAndURL = catchAsync(async(req, res, next) => {
    console.log("body:",req.body)
    // console.log("signature:", req.headers.signature)
    // console.log(req.ip)
    let x  = req.body
    let publicKey
    console.log(req.ip, "ipip")
    if(req.ip == "::ffff:3.9.120.247" || req.ip == "3.9.120.247"){
        publicKey = readPem("publicSport.pem")
    }else{
        publicKey = readPem("publicCasino.pem")
    }
    // console.log("PublicKey:",publicKey)
    if(!req.headers.signature ||  (req.headers.signature && req.headers.signature.trim() === '')){
        return res.status(200).json({
            "status": "RS_ERROR"
        })
    }
    let result = verify(req.headers.signature, publicKey, x)
    console.log(result)
    // next()
    if(result){
        if(req.body.reqId){
            let check = await reqIdModel.findOne({reqId:req.body.reqId})
            if(check){
                return res.status(200).json({
                    "status": "RS_ERROR"
                })
            }else{
                await reqIdModel.create({reqId:req.body.reqId})
            }
        }
        const ObjectId = mongoose.Types.ObjectId;
        let objectId = new ObjectId(req.body.userId);
        let loginData = await loginLogs.find({user_id:objectId, isOnline:true})
        // console.log(loginData[0].gameToken,req.body.token , "loginDataloginDataloginData12313211132")
        if(loginData[0] && loginData[0].gameToken){
            if(loginData[0].gameToken == req.body.token){
                next()
            }else{
                return res.status(200).json({
                "status": "RS_ERROR"
            })
            }
        }else{
            return res.status(200).json({
                "status": "RS_ERROR"
            })
        }
        console.log(result, "resultresultresult")
    }else{
        return res.status(200).json({
            "status": "RS_ERROR"
        })
    }
})


exports.getUserBalancebyiD = catchAsync(async(req, res, next) => {
    // console.log(req.body)
    const user = await userModel.findById(req.body.userId)
    if(!user){
        return  res.status(200).json({
            "status": "RS_ERROR"
        })
    }
    let exposureCheck  = await exposurecheckfunction(user)
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    let balanceSend = user.availableBalance - exposureCheck
    if(clientIP == "::ffff:3.9.120.247" || clientIP == "3.9.120.247"){
        res.status(200).json({
            "balance": balanceSend,
            "status": "RS_OK"
        })
    }else{
        res.status(200).json({
            "balance": balanceSend,
            "status": "OP_SUCCESS"
        })
    }
});

exports.betrequest = catchAsync(async(req, res, next) => {
    try{

        if(!req.body.transactionId || req.body.transactionId.trim() === ''){
            return res.status(200).json({
                "status": "RS_ERROR"
            })
        }

        if(!req.body.reqId || req.body.reqId.trim() === ''){
            return res.status(200).json({
                "status": "RS_ERROR"
            })
        }

        const check = await userModel.findById(req.body.userId)
        let exposureCheck  = await exposurecheckfunction(check)
        if(check.availableBalance - req.body.debitAmount - exposureCheck <= 0){
            return res.status(200).json({
                "status": "RS_ERROR"
            })
        }
        let betTYPE
        if(req.body.sportId){
            betTYPE = 'SPORTBOOK'
        }else{
            betTYPE = 'SPORTBOOK'
        }
        if(req.body.transactionId){
            let check = await betModel.findOne({transactionId:req.body.transactionId})
            // console.log(check, "checkcheckcheck")
            if(check){
                return res.status(200).json({
                    "status": "RS_ERROR"
                })
            }
        }
        let user
        if(req.body.gameId){
            user = await userModel.findByIdAndUpdate(req.body.userId, {$inc:{availableBalance: -req.body.debitAmount, myPL: -req.body.debitAmount, Bets : 1, exposure:req.body.debitAmount, uplinePL:req.body.debitAmount, pointsWL:-req.body.debitAmount}})
        }else{
            user = await userModel.findById(req.body.userId)
        }
        const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        let date = Date.now()
        let game
        let description
        let description2
        let betType2
        let betDATA
        if(req.body.gameId){
            let game1 = await gameModel.findOne({game_id:(req.body.gameId)*1})
            // console.log(game1)
            if(!game1){
                return res.status(200).json({
                    "status": "RS_ERROR"
                })
            }
            game = game1.game_name
            description = `Bet for game ${game}/amount ${req.body.debitAmount}`
            description2 = `Bet for game ${game}/amount ${req.body.debitAmount}/user = ${user.userName}`
            betDATA = {
                userId : req.body.userId,
                userName : user.userName,
                transactionId : req.body.transactionId,
                Stake : req.body.debitAmount,
                date : date,
                status : "OPEN",
                returns : -req.body.debitAmount,
                role_type:user.role_type,
                event : game,
                betType : 'Casino',
                operatorId : req.body.operatorId,
                token : req.body.token,
                gameId : req.body.gameId,
                roundId : req.body.roundId,
                exposure:req.body.debitAmount
            }
        }else{
            game = req.body.competitionName
            description = `Bet for game ${req.body.eventName}/amount ${req.body.debitAmount}`
            description2 = `Bet for game ${req.body.eventName}/amount ${req.body.debitAmount}/user = ${user.userName}`
            betType2 = 'SportBook'
            betDATA = {
                operatorId : req.body.operatorId,
                token : req.body.token,
                userId : req.body.userId,
                userName : user.userName,
                transactionId : req.body.transactionId,
                betType : 'SportBook',
                date : date,
                event : game,
                selectionName:req.body.selectionName,
                oddValue : req.body.oddValue,
                Stake : req.body.debitAmount,
                status : "OPEN",
                returns : -req.body.debitAmount,
                role_type:user.role_type,
                match:req.body.eventName,
                marketName:req.body.marketName,
                eventId:req.body.eventId,
                bettype2:req.body.betType,
                marketId:req.body.marketId,
                exposure:req.body.debitAmount
            }
        }
        if(!user){
            return res.status(200).json({
                "status": "RS_ERROR"
            })
        }
        if(req.body.gameId){
            let amount = req.body.debitAmount
            for(let i = user.parentUsers.length - 1; i >= 1; i--){
                let parentUser1 = await userModel.findById(user.parentUsers[i])
                let parentUser2 = await userModel.findById(user.parentUsers[i-1])
                let parentUser1Amount = new Decimal(parentUser1.myShare).times(amount).dividedBy(100)
                let parentUser2Amount = new Decimal(parentUser1.Share).times(amount).dividedBy(100);
                parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                await userModel.findByIdAndUpdate(user.parentUsers[i], {
                    $inc: {
                        downlineBalance: -req.body.debitAmount,
                        myPL: parentUser1Amount,
                        uplinePL: parentUser2Amount,
                        lifetimePL: parentUser1Amount,
                        pointsWL: -req.body.debitAmount
                    }
                });
            
                if (i === 1) {
                    await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                        $inc: {
                            downlineBalance: -req.body.debitAmount,
                            myPL: parentUser2Amount,
                            lifetimePL: parentUser2Amount,
                            pointsWL: -req.body.debitAmount
                        }
                    });
                }
                amount = parentUser2Amount
            }

        }
        // console.log(betDATA, "betDATAbetDATAbetDATAbetDATA")
        await betModel.create(betDATA);
        if(req.body.gameId){
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
                "transactionId":req.body.transactionId,
                "gameId": req.body.gameId
            }
            accountStatement.create(Acc)
        }
        if(clientIP == "::ffff:3.9.120.247" || clientIP == "3.9.120.247"){
            return res.status(200).json({
                "balance": user.availableBalance - req.body.debitAmount - exposureCheck,
                "status": "RS_OK"
            })
        }else{
            return res.status(200).json({
                "balance": user.availableBalance - req.body.debitAmount - exposureCheck,
                "status": "OP_SUCCESS"
            })
        }
    }catch(err){
        console.log(err)
    }
});

exports.betResult = catchAsync(async(req, res, next) =>{
    try{
        if(!req.body.transactionId || req.body.transactionId.trim() === ''){
            return res.status(200).json({
                "status": "RS_ERROR"
            })
        }

        if(!req.body.reqId || req.body.reqId.trim() === ''){
            return res.status(200).json({
                "status": "RS_ERROR"
            })
        }
        const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        let check = await userModel.findById(req.body.userId);
        let exposureCheck  = await exposurecheckfunction(check)
        if(!check){
            if(clientIP == "::ffff:3.9.120.247" || clientIP == "3.9.120.247"){
                return res.status(200).json({
                    "status": "RS_ERROR"
                })
            }else{
                return res.status(200).json({
                    "status": "RS_ERROR"
                })
            }
        }
        let thatBet = await betModel.findOne({transactionId:req.body.transactionId})
        if(thatBet){
            if(thatBet.status !== "OPEN"){
                return res.status(200).json({
                    "status": "RS_ERROR"
                }) 
            }
        }else{
            return res.status(200).json({
                "status": "RS_ERROR"
            })
        }
        let game = {}
        if(req.body.gameId){
            game = await gameModel.findOne({game_id:(req.body.gameId)*1})
            if(!game){
                return res.status(200).json({
                    "status": "RS_ERROR"
                })
            }
        }else{
            let game1 = await betModel.findOne({transactionId:req.body.transactionId})
            game.game_name = game1.match
        }
        let user;
        let balance;
        if(req.body.creditAmount === 0){
            if(req.body.gameId){
                let betforStake = await betModel.findOneAndUpdate({transactionId:req.body.transactionId},{status:"LOSS", settleDate:Date.now(), closingBalance:parseFloat(user.balance)})
                user = await userModel.findByIdAndUpdate(req.body.userId,{$inc:{Loss:1, exposure: -parseFloat(betforStake.Stake)}})
                balance = user.balance
            }else{
                let exposure = thatBet.returns
                user = await userModel.findByIdAndUpdate(thatBet.userId, {$inc:{Loss:1, exposure:exposure, availableBalance: exposure, myPL:exposure, uplinePL: -parseFloat(exposure), pointsWL:exposure}})
                let betforStake = await betModel.findOneAndUpdate({transactionId:req.body.transactionId},{status:"LOSS",result:req.body.marketWinner,settleDate:Date.now(), closingBalance:parseFloat(user.balance - exposure)})
                let description = `Bet for ${thatBet.match}/Result = ${req.body.marketWinner}/LOSS`
                let debitAmountForP =  - exposure
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

                let Acc = {
                    "user_id":req.body.userId,
                    "description": description,
                    "creditDebitamount" : -exposure,
                    "balance" : user.availableBalance - exposure,
                    "date" : Date.now(),
                    "userName" : user.userName,
                    "role_type" : user.role_type,
                    "Remark":"-",
                    "stake": betforStake.Stake,
                    "transactionId":req.body.transactionId,
                    "marketId":`${req.body.marketId}`
                }

                accountStatement.create(Acc)
                balance = user.balance
            }
        }else{
            // let returnAmount = 
            let thatBet = await betModel.findOne({transactionId:req.body.transactionId})
            if(thatBet.marketId){
                let debitCreditAmount = req.body.creditAmount + thatBet.returns
                // console.log(debitCreditAmount)
                let exposure = Math.abs(thatBet.returns)
                let user = await userModel.findByIdAndUpdate(thatBet.userId,{$inc:{availableBalance: parseFloat(debitCreditAmount), myPL: parseFloat(debitCreditAmount), Won:1, exposure:-parseFloat(exposure), uplinePL:-parseFloat(debitCreditAmount), pointsWL:parseFloat(debitCreditAmount)}})
                let bet = await betModel.findOneAndUpdate({transactionId:req.body.transactionId},{status:"WON", returns:debitCreditAmount, result: req.body.marketWinner,  settleDate:Date.now(), closingBalance:parseFloat(user.availableBalance + debitCreditAmount)});
                let description = `Bet for ${thatBet.match}/Result = ${req.body.marketWinner}/WON`
                
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
                  })
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

              await accountStatement.create({
                "user_id":user._id,
                "description": description,
                "creditDebitamount" : debitCreditAmount,
                "balance" : user.availableBalance + debitCreditAmount,
                "date" : Date.now(),
                "userName" : user.userName,
                "role_type" : user.role_type,
                "Remark":"-",
                "stake": bet.Stake,
                "transactionId":`${bet.transactionId}`,
                "marketId":`${bet.marketId}`
              })

              balance = user.availableBalance + debitCreditAmount

            }else{
                let returnAmount = req.body.creditAmount + thatBet.returns
                user = await userModel.findByIdAndUpdate(req.body.userId,{$inc:{availableBalance: req.body.creditAmount, myPL: req.body.creditAmount, Won:1, exposure:-bet.Stake, uplinePL:-req.body.creditAmount, pointsWL:req.body.creditAmount}});
                let bet = await betModel.findOneAndUpdate({transactionId:req.body.transactionId},{status:"WON", returns:returnAmount,settleDate:Date.now(), closingBalance:parseFloat(user.availableBalance + req.body.creditAmount)});
                let description = `Bet for ${game.game_name}/stake = ${bet.Stake}/WON`
                let debitAmountForP = req.body.creditAmount
                for(let i = user.parentUsers.length - 1; i >= 1; i--){
                    let parentUser1 = await userModel.findById(user.parentUsers[i])
                    let parentUser2 = await userModel.findById(user.parentUsers[i - 1])
                    let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                    let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                    parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                    parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                    await userModel.findByIdAndUpdate(user.parentUsers[i], {
                        $inc: {
                            downlineBalance: req.body.creditAmount,
                            myPL: -parentUser1Amount,
                            uplinePL: -parentUser2Amount,
                            lifetimePL: -parentUser1Amount,
                            pointsWL: req.body.creditAmount
                        }
                    });
                
                    if (i === 1) {
                        await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                            $inc: {
                                downlineBalance: req.body.creditAmount,
                                myPL: -parentUser2Amount,
                                lifetimePL: -parentUser2Amount,
                                pointsWL: req.body.creditAmount
                            }
                        });
                    }
                    debitAmountForP = parentUser2Amount
                }
                if(!user){
                    if(clientIP == "::ffff:3.9.120.247" || clientIP == "3.9.120.247"){
                        return res.status(200).json({
                            "status": "RS_ERROR"
                        })
                    }else{
                        return res.status(200).json({
                            "status": "RS_ERROR"
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
                    "transactionId":`${bet.transactionId}`,
                    "gameId": req.body.gameId
                  })

            }
        }

        let sendBalance = balance - exposureCheck
        if(clientIP == "::ffff:3.9.120.247" || clientIP == "3.9.120.247"){
            res.status(200).json({
                "balance": sendBalance,
                "status": "RS_OK"
            })
        }else{
            res.status(200).json({
                "balance": sendBalance,
                "status": "OP_SUCCESS"
            })
        }
    }catch(err){
        console.log(err)
    }

});

exports.rollBack = catchAsync(async(req, res, next) => {
    try{
    let user1 =  await userModel.findById(req.body.userId)
    let bet1 =  await betModel.findOne({transactionId:req.body.transactionId})
    let clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if(!req.body.transactionId || req.body.transactionId.trim() === ''){
        return res.status(200).json({
            "status": "RS_ERROR"
        })
    }

    if(!req.body.reqId || req.body.reqId.trim() === ''){
        return res.status(200).json({
            "status": "RS_ERROR"
        })
    }

    if(req.body.transactionId){
        let check = await reqIdModel.findOne({reqId:req.body.transactionId})
        // console.log(check,bet1.status, "bet1.statusbet1.statusbet1.statusbet1.status" )
        if(check && (bet1.status === "OPEN" || bet1.status === "CANCEL")){
            return res.status(200).json({
                "status": "RS_ERROR"
            })
        }else{
            if(!check){
                await reqIdModel.create({reqId:req.body.transactionId})
            }
        }
    }
    // console.log(user, bet1)

    if(bet1 != null){
        if(bet1.status !== "OPEN"){
           let debitCreditAmoun 
           let user
           if(req.body.gameId){
            debitCreditAmoun = req.body.rollbackAmount
           }else{
            if(bet1.exposure){
                debitCreditAmoun = req.body.rollbackAmount + bet1.exposure
            }else{
                debitCreditAmoun = req.body.rollbackAmount
            }
           }
           console.log(debitCreditAmoun,  req.body.rollbackAmount, bet1.exposure, "bet1.exposurebet1.exposurebet1.exposurebet1.exposure")
           user = await userModel.findByIdAndUpdate(req.body.userId,{$inc:{availableBalance:debitCreditAmoun, myPL: debitCreditAmoun, exposure:-debitCreditAmoun, uplinePL:-debitCreditAmoun, pointsWL:debitCreditAmoun}}); 
           if(!user){
                if(clientIP == "::ffff:3.9.120.247" || clientIP == "3.9.120.247"){
                    return res.status(200).json({
                        "status": "RS_ERROR"
                    })
                }else{
                    return res.status(200).json({
                        "status": "RS_ERROR"
                    })
                }
            }else{
                let game = {}
                if(req.body.gameId){
                    game = await gameModel.findOne({game_id:(req.body.gameId)*1})
                    if(!game){
                        return res.status(200).json({
                            "status": "RS_ERROR"
                        })
                    }
                }else{
                    let game1 = await betModel.findOne({transactionId:req.body.transactionId})
                    game.game_name = game1.match
                }
                let debitAmountForP = debitCreditAmoun
                for(let i = user.parentUsers.length - 1; i >= 1; i--){
                    let parentUser1 = await userModel.findById(user.parentUsers[i])
                    let parentUser2 = await userModel.findById(user.parentUsers[i - 1])
                    let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                    let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                    parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                    parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                    await userModel.findByIdAndUpdate(user.parentUsers[i], {
                        $inc: {
                            downlineBalance: req.body.rollbackAmount,
                            myPL: -parentUser1Amount,
                            uplinePL: -parentUser2Amount,
                            lifetimePL: -parentUser1Amount,
                            pointsWL: req.body.rollbackAmount
                        }
                    });
                
                    if (i === 1) {
                        await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                            $inc: {
                                downlineBalance: req.body.rollbackAmount,
                                myPL: -parentUser2Amount,
                                lifetimePL: -parentUser2Amount,
                                pointsWL: req.body.rollbackAmount
                            }
                        });
                    }
                    debitAmountForP = parentUser2Amount
                }

                balance = user.balance + debitCreditAmoun;

                let bet =  await betModel.findOne({transactionId:req.body.transactionId})
                let acc = await accountStatement.find({transactionId:req.body.transactionId})
                if(bet){
                    await betModel.findByIdAndUpdate(bet._id,{returns:-bet.exposure, status:"OPEN"})
                    if(req.body.gameId){
                        let description = `Bet for ${game.game_name}/stake = ${bet.Stake}/ROLLBACK`
                        if(acc){
                            if(req.body.gameId){
                                let Acc = {
                                    "user_id":req.body.userId,
                                    "description": description,
                                    "creditDebitamount" : req.body.rollbackAmount,
                                    "balance" : user.availableBalance + req.body.rollbackAmount,
                                    "date" : Date.now(),
                                    "userName" : user.userName,
                                    "role_type" : user.role_type,
                                    "Remark":"-",
                                    "stake": req.body.rollbackAmount,
                                    "transactionId":req.body.transactionId
                                }
                                await accountStatement.create(Acc)
                            }else{
                                let Acc = {
                                    "user_id":req.body.userId,
                                    "description": description,
                                    "creditDebitamount" : req.body.rollbackAmount,
                                    "balance" : user.availableBalance + req.body.rollbackAmount,
                                    "date" : Date.now(),
                                    "userName" : user.userName,
                                    "role_type" : user.role_type,
                                    "Remark":"-",
                                    "stake": req.body.rollbackAmount,
                                    "transactionId":req.body.transactionId,
                                    "marketId":req.body.marketId

                                }
                                await accountStatement.create(Acc)
                            }
                        }
                    }
                }
                // console.log(balance)
                if(clientIP == "::ffff:3.9.120.247" || clientIP == "3.9.120.247"){
                    res.status(200).json({
                        "status": "RS_OK",
                        "balance": balance
                    })
                }else{
                    res.status(200).json({
                        "status": "OP_SUCCESS",
                        "balance": balance
                    })
                }
            }
        }else{

            let user;
            let balance;
            let parentUser;
            if(req.body.gameId){
                user = await userModel.findByIdAndUpdate(req.body.userId,{$inc:{availableBalance:req.body.rollbackAmount, myPL: req.body.rollbackAmount, exposure:-req.body.rollbackAmount, uplinePL:-req.body.rollbackAmount, pointsWL:req.body.rollbackAmount}});
            }else{
                user = await userModel.findById(req.body.userId)
                balance = user.availableBalance
            }
            // console.log(user, "USer")
            if(!user){
                if(clientIP == "::ffff:3.9.120.247" || clientIP == "3.9.120.247"){
                    return res.status(200).json({
                        "status": "RS_ERROR"
                    })
                }else{
                    return res.status(200).json({
                        "status": "RS_ERROR"
                    })
                }
            }else{
                let game = {}
                if(req.body.gameId){
                    game = await gameModel.findOne({game_id:(req.body.gameId)*1})
                    if(!game){
                        return res.status(200).json({
                            "status": "RS_ERROR"
                        })
                    }
                }else{
                    let game1 = await betModel.findOne({transactionId:req.body.transactionId})
                    game.game_name = game1.match
                }
                if(req.body.gameId){
                    let debitAmountForP = req.body.rollbackAmount
                    for(let i = user.parentUsers.length - 1; i >= 1; i--){
                        let parentUser1 = await userModel.findById(user.parentUsers[i])
                        let parentUser2 = await userModel.findById(user.parentUsers[i - 1])
                        let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                        let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                        // parentUser1Amount = Math.round(parentUser1Amount * 10000) / 10000;
                        // parentUser2Amount = Math.round(parentUser2Amount * 10000) / 10000;
                        parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                        parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                        // await userModel.findByIdAndUpdate(user.parentUsers[i],{$inc:{downlineBalance:req.body.rollbackAmount, myPL:-(parentUser1Amount), uplinePL: -(parentUser2Amount), lifetimePL:-(parentUser1Amount), pointsWL:req.body.rollbackAmount}})
                        // if(i === 1){
                        //     await userModel.findByIdAndUpdate(user.parentUsers[i - 1],{$inc:{downlineBalance:req.body.rollbackAmount, myPL:-(parentUser2Amount), lifetimePL:-(parentUser2Amount), pointsWL:req.body.rollbackAmount}})
                        // }
                        await userModel.findByIdAndUpdate(user.parentUsers[i], {
                            $inc: {
                                downlineBalance: req.body.rollbackAmount,
                                myPL: -parentUser1Amount,
                                uplinePL: -parentUser2Amount,
                                lifetimePL: -parentUser1Amount,
                                pointsWL: req.body.rollbackAmount
                            }
                        });
                    
                        if (i === 1) {
                            await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                                $inc: {
                                    downlineBalance: req.body.rollbackAmount,
                                    myPL: -parentUser2Amount,
                                    lifetimePL: -parentUser2Amount,
                                    pointsWL: req.body.rollbackAmount
                                }
                            });
                        }
                        debitAmountForP = parentUser2Amount
                    }
    
                    balance = user.availableBalance + req.body.rollbackAmount;
                }
                let bet =  await betModel.findOne({transactionId:req.body.transactionId})
                let acc = await accountStatement.find({transactionId:req.body.transactionId})
                if(bet){
                    let thatBet = await betModel.findByIdAndUpdate(bet._id,{returns:0, status:"CANCEL"})
                    console.log(thatBet, "thatBetthatBet")
                    if(req.body.gameId){
                        let description = `Bet for ${game.game_name}/stake = ${bet.Stake}/CANCEL`
                        let description2 = `Bet for ${game.game_name}/stake = ${bet.Stake}/user = ${user.userName}/CANCEL `
                        if(acc){
                            // let Acc2 = {
                            //     "user_id":parentUser._id,
                            //     "description": description2,
                            //     "creditDebitamount" : -req.body.rollbackAmount,
                            //     "balance" : parentUser.availableBalance - req.body.rollbackAmount,
                            //     "date" : Date.now(),
                            //     "userName" : parentUser.userName,
                            //     "role_type" : parentUser.role_type,
                            //     "Remark":"-",
                            //     "stake": req.body.rollbackAmount,
                            //     "transactionId":req.body.transactionId
                            // }
                            let Acc = {
                                "user_id":req.body.userId,
                                "description": description,
                                "creditDebitamount" : req.body.rollbackAmount,
                                "balance" : user.availableBalance + req.body.rollbackAmount,
                                "date" : Date.now(),
                                "userName" : user.userName,
                                "role_type" : user.role_type,
                                "Remark":"-",
                                "stake": req.body.rollbackAmount,
                                "transactionId":req.body.transactionId
                            }
                            await accountStatement.create(Acc)
                            // await accountStatement.create(Acc2)
                        }
                    }
                }
                console.log(balance)
                if(clientIP == "::ffff:3.9.120.247" || clientIP == "3.9.120.247"){
                    res.status(200).json({
                        "status": "RS_OK",
                        "balance": balance
                    })
                }else{
                    res.status(200).json({
                        "status": "OP_SUCCESS",
                        "balance": balance
                    })
                }
            }
        }
    }else{
        if(clientIP == "::ffff:3.9.120.247" || clientIP == "3.9.120.247"){
            return res.status(200).json({
                "status": "RS_ERROR"
            })
        }else{
            return res.status(200).json({
                "status": "RS_ERROR"
            })
        }
    }
    
        }catch(err){
            console.log(err)
        }
    
})