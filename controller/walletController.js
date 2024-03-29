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
const updateParents = require('../utils/parentUserUpdateByBet');
const updateParents2 = require('../utils/parentUpdateByBetsaWin');
// const Decimal = require("decima")
// const { use } = require('../app');
function readPem (filename) {
    return fs.readFileSync(path.resolve(__dirname, '../prev/' + filename), 'utf8')
  }

exports.consoleBodyAndURL = catchAsync(async(req, res, next) => {
    //console.time('verification');
    if(!(req.ip == '3.9.38.120' || req.ip == '::ffff:3.9.38.120' || req.ip == "::ffff:35.178.88.91" || req.ip == "35.178.88.91")){
        return res.status(200).json({
            "status": "RS_ERROR"
        })
    }
    console.log('Body:',req.body, 'ip:',  req.ip)
    let x  = req.body
    let publicKey
    if(req.ip == "::ffff:35.178.88.91" || req.ip == "35.178.88.91"){
        publicKey = readPem("publicSportLive.pem")
    }else{
        publicKey = readPem("publicCasino.pem")
    }
    if(!req.headers.signature ||  (req.headers.signature && req.headers.signature.trim() === '')){
        return res.status(200).json({
            "status": "RS_ERROR"
        })
    }
    let result = verify(req.headers.signature, publicKey, x)
    // console.log(result, "resultresultresultresult")
    // next()
    if(result){
        if(req.body.reqId){
            let check = await reqIdModel.findOne({reqId:req.body.reqId})
            if(check){
                if(req.ip == "::ffff:35.178.88.91" || req.ip == "35.178.88.91"){
                    return res.status(200).json({
                        "status": "RS_ERROR"
                    })
                }else{
                    return res.status(200).json({
                        "status": "OP_DUPLICATE_TRANSACTION"
                    })
                }
            }else{
                await reqIdModel.create({reqId:req.body.reqId})
            }
        }
        if(req.body.userId && req.body.userId === 'TEST'){
            return res.status(200).json({
                "status": "RS_ERROR"
            })
        }
        const ObjectId = mongoose.Types.ObjectId;
        let objectId = new ObjectId(req.body.userId);
        exposurecheckfunction({id:req.body.userId})
        let loginData = await loginLogs.find({user_id:objectId, isOnline:true})
        // console.log(loginData[0].gameToken,req.body.token , "loginDataloginDataloginData12313211132")
        if(loginData[0] && loginData[0].gameToken){
            if(loginData[0].gameToken == req.body.token){
                if(req.body.betType === "Casino"){
                    if(req.body.gameId.trim() == ''){
                        return res.status(200).json({
                            "status": "OP_INVALID_PARAMS"
                        })
                    }
                }
                next()
            }else{
                if(req.ip == "::ffff:35.178.88.91" || req.ip == "35.178.88.91"){
                    return res.status(200).json({
                        "status": "RS_ERROR"
                    })
                }else{
                    return res.status(200).json({
                        "status": "OP_INVALID_SIGNATURE"
                    })
                }
            }
        }else{
            if(req.ip == "::ffff:35.178.88.91" || req.ip == "35.178.88.91"){
                return res.status(200).json({
                    "status": "RS_ERROR"
                })
            }else{
                return res.status(200).json({
                    "status": "OP_INVALID_SIGNATURE"
                })
            }
        }
        // console.log(result, "resultresultresult")
    }else{
        if(req.ip == "::ffff:35.178.88.91" || req.ip == "35.178.88.91"){
            return res.status(200).json({
                "status": "RS_ERROR"
            })
        }else{
            return res.status(200).json({
                "status": "OP_INVALID_SIGNATURE"
            })
        }
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
    let exposureCheck  = user.exposure
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    let balanceSend = user.availableBalance - exposureCheck
    //console.timeEnd('verification');

    if(clientIP == "::ffff:35.178.88.91" || clientIP == "35.178.88.91"){
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
    // console.log('reqddddddddddddddddddddd')
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    try{
        if(!req.body.transactionId || req.body.transactionId.trim() === ''){
            if(clientIP == "::ffff:35.178.88.91" || clientIP == "35.178.88.91"){
                return res.status(200).json({
                    "status": "RS_ERROR"
                })
            }else{
                return res.status(200).json({
                    "status": "OP_TRANSACTION_NOT_FOUND"
                })
            }
        }

        if(!req.body.reqId || req.body.reqId.trim() === ''){
            return res.status(200).json({
                "status": "RS_ERROR"
            })
        }

        if(req.body.debitAmount < 0){
            if(clientIP == "::ffff:35.178.88.91" || clientIP == "35.178.88.91"){
                return res.status(200).json({
                    "status": "RS_ERROR"
                })
            }else{
                return res.status(200).json({
                    "status": "OP_ERROR_NEGATIVE_DEBIT_AMOUNT"
                })
            }
        }

        if(req.body.debitAmount == 0){
            if(clientIP == "::ffff:35.178.88.91" || clientIP == "35.178.88.91"){
                return res.status(200).json({
                    "status": "RS_ERROR"
                })
            }else{
                return res.status(200).json({
                    "status": "OP_ZERO_DEBIT_AMOUNT"
                })
            }
        }
        const check = await userModel.findById(req.body.userId)
        let exposureCheck  = check.exposure
        if(check.availableBalance - req.body.debitAmount - exposureCheck <= 0){
            if(clientIP == "::ffff:35.178.88.91" || clientIP == "35.178.88.91"){
                return res.status(200).json({
                    "status": "RS_ERROR"
                })
            }else{
                return res.status(200).json({
                    "status": "OP_INSUFFICIENT_FUNDS"
                })
            }
        }
        let betTYPE
        if(req.body.sportId){
            betTYPE = 'SPORTBOOK'
        }else{
            betTYPE = 'SPORTBOOK'
        }
        console.log('gotHERE')
        if(req.body.transactionId){
            let check = await betModel.findOne({transactionId:req.body.transactionId})
            console.log(check, "checkcheckcheck", clientIP)
            if(check){
                if(clientIP == "::ffff:35.178.88.91" || clientIP == "35.178.88.91"){
                    return res.status(200).json({
                        "status": "RS_ERROR"
                    })
                }else{
                    return res.status(200).json({
                        "status": "OP_DUPLICATE_TRANSACTION"
                    })
                }
            }
        }
        let user
        if(req.body.gameId){
            let game1 = await gameModel.findOne({game_id:(req.body.gameId)*1})
            // console.log(game1)
            if(!game1){
                    return res.status(200).json({
                        "status": "OP_INVALID_GAME"
                    })
            }
            user = await userModel.findByIdAndUpdate(req.body.userId, {$inc:{availableBalance: -req.body.debitAmount, myPL: -req.body.debitAmount, Bets : 1, uplinePL:req.body.debitAmount, pointsWL:-req.body.debitAmount}})
        }else{
            user = await userModel.findById(req.body.userId)
        }
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
                    "status": "OP_INVALID_GAME"
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
            // downLevelBalance = req.body.debitAmount
            updateParents(user, amount, amount)
            // for(let i = user.parentUsers.length - 1; i >= 1; i--){
            //     let parentUser1 = await userModel.findById(user.parentUsers[i])
            //     let parentUser2 = await userModel.findById(user.parentUsers[i-1])
            //     let parentUser1Amount = new Decimal(parentUser1.myShare).times(amount).dividedBy(100)
            //     let parentUser2Amount = new Decimal(parentUser1.Share).times(amount).dividedBy(100);
            //     parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
            //     parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
            //     await userModel.findByIdAndUpdate(user.parentUsers[i], {
            //         $inc: {
            //             downlineBalance: -req.body.debitAmount,
            //             myPL: parentUser1Amount,
            //             uplinePL: parentUser2Amount,
            //             lifetimePL: parentUser1Amount,
            //             pointsWL: -req.body.debitAmount
            //         }
            //     });
            
            //     if (i === 1) {
            //         await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
            //             $inc: {
            //                 downlineBalance: -req.body.debitAmount,
            //                 myPL: parentUser2Amount,
            //                 lifetimePL: parentUser2Amount,
            //                 pointsWL: -req.body.debitAmount
            //             }
            //         });
            //     }
            //     amount = parentUser2Amount
            // }

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
    //console.timeEnd('verification');

        if(clientIP == "::ffff:35.178.88.91" || clientIP == "35.178.88.91"){
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
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    try{
        if(!req.body.transactionId || req.body.transactionId.trim() === ''){
            if(clientIP == "::ffff:35.178.88.91" || clientIP == "35.178.88.91"){
                return res.status(200).json({
                    "status": "RS_ERROR"
                })
            }else{
                return res.status(200).json({
                    "status": "OP_TRANSACTION_NOT_FOUND"
                })
            }
        }

        if(!req.body.reqId || req.body.reqId.trim() === ''){
            return res.status(200).json({
                "status": "RS_ERROR"
            })
        }
        let check = await userModel.findById(req.body.userId);
        let exposureCheck  = check.exposure
        if(!check){
            if(clientIP == "::ffff:35.178.88.91" || clientIP == "35.178.88.91"){
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
                if(clientIP == "::ffff:35.178.88.91" || clientIP == "35.178.88.91"){
                    return res.status(200).json({
                        "status": "RS_ERROR"
                    })
                }else{
                    return res.status(200).json({
                        "status": "OP_ERROR_TRANSACTION_INVALID"
                    })
                }
            }
        }else{
            if(clientIP == "::ffff:35.178.88.91" || clientIP == "35.178.88.91"){
                return res.status(200).json({
                    "status": "RS_ERROR"
                })
            }else{
                return res.status(200).json({
                    "status": "OP_TRANSACTION_NOT_FOUND"
                })
            }
        }
        let game = {}
        if(req.body.gameId){
            game = await gameModel.findOne({game_id:(req.body.gameId)*1})
            if(!game){
                return res.status(200).json({
                    "status": "OP_INVALID_GAME"
                })
            }
        }else{
            // let game1 = await betModel.findOne({transactionId:req.body.transactionId})
            game.game_name = thatBet.match
        }
        let user;
        let balance;
        if(req.body.creditAmount === 0){
            if(req.body.gameId){
                user = await userModel.findByIdAndUpdate(req.body.userId,{$inc:{Loss:1}})
                let betforStake = await betModel.findOneAndUpdate({transactionId:req.body.transactionId},{status:"LOSS", settleDate:Date.now(), closingBalance:parseFloat(user.availableBalance)})
                balance = user.availableBalance - exposureCheck
            }else{
                let exposure = thatBet.returns
                user = await userModel.findByIdAndUpdate(thatBet.userId, {$inc:{Loss:1, exposure:exposure, availableBalance: exposure, myPL:exposure, uplinePL: -parseFloat(exposure), pointsWL:exposure}})
                let betforStake = await betModel.findOneAndUpdate({transactionId:req.body.transactionId},{status:"LOSS",result:req.body.marketWinner,settleDate:Date.now(), closingBalance:parseFloat(user.availableBalance - exposure)})
                let description = `Bet for ${thatBet.match}/Result = ${req.body.marketWinner}/LOSS`
                let debitAmountForP =  - exposure
                let uplinePl = 0
                for(let i = 1; i < user.parentUsers.length; i++){
                    let parentUser1 = await userModel.findById(user.parentUsers[i])
                    let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                    let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                    parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                    parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                    await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                        $inc: {
                            downlineBalance: -exposure,
                            myPL: parentUser2Amount,
                            pointsWL: -exposure
                        }
                    });
                    await userModel.findByIdAndUpdate(user.parentUsers[i], {
                        $inc : {
                            uplinePL: parseFloat(parentUser2Amount) + parseFloat(uplinePl),
                        }
                    })

                    if(i === user.parentUsers.length-1 ){
                        await userModel.findByIdAndUpdate(user.parentUsers[i], {
                            $inc: {
                                downlineBalance: -exposure,
                                myPL: parentUser1Amount,
                                pointsWL: -exposure
                            }
                        });
                    }
                    uplinePl = parseFloat(uplinePl) + parseFloat(parentUser2Amount)
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
                balance = user.availableBalance - exposureCheck + exposure
            }
        }else{
            if(thatBet.marketId){
                let debitCreditAmount = req.body.creditAmount + thatBet.returns
                // console.log(debitCreditAmount)
                let exposure = Math.abs(thatBet.returns)
                let user = await userModel.findByIdAndUpdate(thatBet.userId,{$inc:{availableBalance: parseFloat(debitCreditAmount), myPL: parseFloat(debitCreditAmount), Won:1, exposure:-parseFloat(exposure), uplinePL:-parseFloat(debitCreditAmount), pointsWL:parseFloat(debitCreditAmount)}})
                let bet = await betModel.findOneAndUpdate({transactionId:req.body.transactionId},{status:"WON", returns:debitCreditAmount, result: req.body.marketWinner,  settleDate:Date.now(), closingBalance:parseFloat(user.availableBalance + debitCreditAmount)});
                let description = `Bet for ${thatBet.match}/Result = ${req.body.marketWinner}/WON`
                
                let debitAmountForP = debitCreditAmount
                let uplinePl = 0
                for(let i = 1; i < user.parentUsers.length; i++){
                    let parentUser1 = await userModel.findById(user.parentUsers[i])
                    let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                    let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                    parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                    parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                    await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                        $inc: {
                            downlineBalance: debitCreditAmount,
                            myPL: -parentUser2Amount,
                            pointsWL: debitCreditAmount
                        }
                    });
                    await userModel.findByIdAndUpdate(user.parentUsers[i], {
                        $inc : {
                            uplinePL: -parseFloat(parentUser2Amount) + parseFloat(uplinePl),
                        }
                    })

                    if(i === user.parentUsers.length-1 ){
                        await userModel.findByIdAndUpdate(user.parentUsers[i], {
                            $inc: {
                                downlineBalance: debitCreditAmount,
                                myPL: -parentUser1Amount,
                                pointsWL: debitCreditAmount
                            }
                        });
                    }
                    uplinePl = parseFloat(uplinePl) - parseFloat(parentUser2Amount)
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
                "stake": thatBet.Stake,
                "transactionId":`${thatBet.transactionId}`,
                "marketId":`${thatBet.marketId}`
              })

              balance = user.availableBalance + debitCreditAmount - exposureCheck

            }else{
                let returnAmount = req.body.creditAmount + thatBet.returns
                user = await userModel.findByIdAndUpdate(req.body.userId,{$inc:{availableBalance: req.body.creditAmount, myPL: req.body.creditAmount, Won:1, exposure:-thatBet.Stake, uplinePL:-req.body.creditAmount, pointsWL:req.body.creditAmount}});
                let bet = await betModel.findOneAndUpdate({transactionId:req.body.transactionId},{status:"WON", returns:returnAmount,settleDate:Date.now(), closingBalance:parseFloat(user.availableBalance + req.body.creditAmount)});
                let description = `Bet for ${game.game_name}/stake = ${bet.Stake}/WON`
                let debitAmountForP = req.body.creditAmount
                // updateParents(user, amount, amount)
                updateParents2(user, debitAmountForP, debitAmountForP)
                // for(let i = user.parentUsers.length - 1; i >= 1; i--){
                //     let parentUser1 = await userModel.findById(user.parentUsers[i])
                //     let parentUser2 = await userModel.findById(user.parentUsers[i - 1])
                //     let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                //     let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                //     parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                //     parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                //     await userModel.findByIdAndUpdate(user.parentUsers[i], {
                //         $inc: {
                //             downlineBalance: req.body.creditAmount,
                //             myPL: -parentUser1Amount,
                //             uplinePL: -parentUser2Amount,
                //             lifetimePL: -parentUser1Amount,
                //             pointsWL: req.body.creditAmount
                //         }
                //     });
                
                //     if (i === 1) {
                //         await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                //             $inc: {
                //                 downlineBalance: req.body.creditAmount,
                //                 myPL: -parentUser2Amount,
                //                 lifetimePL: -parentUser2Amount,
                //                 pointsWL: req.body.creditAmount
                //             }
                //         });
                //     }
                //     debitAmountForP = parentUser2Amount
                // }
                if(!user){
                    if(clientIP == "::ffff:35.178.88.91" || clientIP == "35.178.88.91"){
                        return res.status(200).json({
                            "status": "RS_ERROR"
                        })
                    }else{
                        return res.status(200).json({
                            "status": "RS_ERROR"
                        })
                    }
                }
                balance = user.availableBalance + req.body.creditAmount - exposureCheck
        
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
    //console.timeEnd('verification');

        if(clientIP == "::ffff:35.178.88.91" || clientIP == "35.178.88.91"){
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
    }catch(err){
        console.log(err)
    }

});

exports.rollBack = catchAsync(async(req, res, next) => {
    let clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if(!req.body.transactionId || req.body.transactionId.trim() === ''){
        if(clientIP == "::ffff:35.178.88.91" || clientIP == "35.178.88.91"){
            return res.status(200).json({
                "status": "RS_ERROR"
            })
        }else{
            return res.status(200).json({
                "status": "OP_TRANSACTION_NOT_FOUND"
            })
        }
    }
  
    if(!req.body.reqId || req.body.reqId.trim() === ''){
        return res.status(200).json({
            "status": "RS_ERROR"
        })
    }
    let bet1 =  await betModel.findOne({transactionId:req.body.transactionId})
    if(!bet1){
        if(clientIP == "::ffff:35.178.88.91" || clientIP == "35.178.88.91"){
            return res.status(200).json({
                "status": "RS_ERROR"
            })
        }else{
            return res.status(200).json({
                "status": "OP_TRANSACTION_NOT_FOUND"
            })
        }
    }
    let check = await reqIdModel.findOne({reqId:req.body.transactionId})
    // console.log(check,bet1.status, "bet1.statusbet1.statusbet1.statusbet1.status" )
    if(check && (bet1.status === "OPEN" || bet1.status === "CANCEL")){
        if(clientIP == "::ffff:35.178.88.91" || clientIP == "35.178.88.91"){
            return res.status(200).json({
                "status": "RS_ERROR"
            })
        }else{
            return res.status(200).json({
                "status": "OP_TRANSACTION_NOT_FOUND"
            })
        }
    }else{
        if(!check){
            reqIdModel.create({reqId:req.body.transactionId})
        }
    }
    if(req.body.gameId){
        let game = await gameModel.findOne({game_id:(req.body.gameId)*1})
        if(!game){
            return res.status(200).json({
                "status": "OP_INVALID_GAME"
            })
        }
        if(bet1.status !== "OPEN"){
            let debitCreditAmoun = req.body.rollbackAmount
            let user = await userModel.findByIdAndUpdate(req.body.userId,{$inc:{availableBalance:debitCreditAmoun, myPL: debitCreditAmoun, uplinePL:-debitCreditAmoun, pointsWL:debitCreditAmoun}}); 
            let checkExposure = user.exposure
            balance = user.availableBalance + debitCreditAmoun - checkExposure;
            updateParents2(user, debitCreditAmoun, req.body.rollbackAmount)
            await betModel.findByIdAndUpdate(bet1._id.toString(),{returns:-bet1.exposure, status:"OPEN"})
            let description = `Bet for ${game.game_name}/stake = ${bet1.Stake}/ROLLBACK`
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
                "gameId": req.body.gameId
            }
            accountStatement.create(Acc)
    //console.timeEnd('verification');

            res.status(200).json({
                "status": "OP_SUCCESS",
                "balance": balance
            })

        }else{
            let user = await userModel.findByIdAndUpdate(req.body.userId,{$inc:{availableBalance:req.body.rollbackAmount, myPL: req.body.rollbackAmount, uplinePL:-req.body.rollbackAmount, pointsWL:req.body.rollbackAmount}});
            checkExposure = user.exposure
            await betModel.findOneAndUpdate({transactionId:req.body.transactionId}, {returns:0, status:"CANCEL"})
            updateParents2(user, req.body.rollbackAmount, req.body.rollbackAmount)
            balance = user.availableBalance + req.body.rollbackAmount;
            let description = `Bet for ${game.game_name}/stake = ${bet1.Stake}/CANCEL`
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
                "gameId":req.body.gameId
                
            }
            accountStatement.create(Acc)
    //console.timeEnd('verification');

            res.status(200).json({
                "status": "OP_SUCCESS",
                "balance": balance - checkExposure
            })
        }

    }else{
        let game = {}
        game.game_name = bet1.match
        // balance = user.availableBalance - checkExposure + debitCreditAmoun - bet1.exposure;
        if(bet1.status !== "OPEN"){
            let debitCreditAmoun
            if(bet1.exposure){
                debitCreditAmoun = req.body.rollbackAmount + bet1.exposure
            }else{
                debitCreditAmoun = req.body.rollbackAmount
            }
            let user = await userModel.findByIdAndUpdate(req.body.userId,{$inc:{availableBalance:debitCreditAmoun, myPL: debitCreditAmoun, uplinePL:-debitCreditAmoun, pointsWL:debitCreditAmoun}}); 
            let checkExposure = user.exposure
            updateParents2(user, debitCreditAmoun, debitCreditAmoun)
            await betModel.findByIdAndUpdate(bet1._id.toString(),{returns:-bet1.exposure, status:"OPEN"})
            let description = `Bet for ${game.game_name}/stake = ${bet1.Stake}/ROLLBACK`
            let Acc = {
                "user_id":req.body.userId,
                "description": description,
                "creditDebitamount" : debitCreditAmoun,
                "balance" : user.availableBalance + debitCreditAmoun,
                "date" : Date.now(),
                "userName" : user.userName,
                "role_type" : user.role_type,
                "Remark":"-",
                "stake": bet1.Stake,
                "transactionId":req.body.transactionId,
                "marketId":req.body.marketId

            }
            accountStatement.create(Acc)
    //console.timeEnd('verification');

            res.status(200).json({
                "status": "RS_OK",
                "balance": user.availableBalance + debitCreditAmoun - checkExposure- bet1.exposure
            })

        }else{
            let user = await userModel.findById(req.body.userId)
            let balance = user.availableBalance 
            let checkExposure = user.exposure
            await betModel.findOneAndUpdate({transactionId:req.body.transactionId}, {returns:0, status:"CANCEL"})
    //console.timeEnd('verification');

            res.status(200).json({
                "status": "RS_OK",
                "balance": balance - checkExposure
            })
        }

    }
})