const User = require('../model/userModel');
const accountStatementModel = require("../model/accountStatementByUserModel");
const Bet = require('../model/betmodel');
const settlementHistory = require('../model/settelementHistory')
const InprogressModel = require('../model/InprogressModel');
const Decimal = require('decimal.js');
const commissionNewModel = require('../model/commissioNNModel');
const revokeCommission = require('./commissionRevocke');
const revockCommissionFromBetId = require('./revockCommissionFromBetId');

async function voidBET(data){
//  console.log(data, 444)  
    let allBetWithMarketId = await Bet.find({marketId:data.id})
    await commissionNewModel.updateMany({marketId:data.id,commissionStatus : 'Unclaimed'}, {commissionStatus : 'cancel'})
    let inprogressData = await InprogressModel.findOne({marketId:data.id, progressType:'VoideBet'})
    if(inprogressData === null){
        try{

            let inprogressData = {
              eventId : allBetWithMarketId[0].eventId,
              marketId: allBetWithMarketId[0].marketId,
              length: allBetWithMarketId.length,
              marketName: allBetWithMarketId[0].marketName,
              progressType:'VoideBet'
            }
            InProgress = await InprogressModel.create(inprogressData)
        }catch(err){
            console.log(err)
        }
    }
    // console.log(inprogressData, "<<<===== inprogressData")
    // console.log(allBetWithMarketId)
    let operatorId;
    let operatoruserName;
    if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
        operatorId = data.LOGINDATA.LOGINUSER.parent_id
        let parentUser = await User.findById(operatorId)
        operatoruserName = parentUser.userName
    }else{
        operatorId = data.LOGINDATA.LOGINUSER._id
        operatoruserName = data.LOGINDATA.LOGINUSER.userName
    }
    let dataForHistory = {
        marketID:`${data.id}`,
        userId:`${operatorId}`,
        eventName: `${allBetWithMarketId[0].match}`,
        date:Date.now(),
        result:"Cancel Bet",
        marketName : `${allBetWithMarketId[0].marketName}`,
        remark:data.data.remark
      }
      await settlementHistory.create(dataForHistory)
    // console.log(dataForHistory, 121212)
    try{
        for(const bets in allBetWithMarketId){
            console.log('WORKING wwwwwwwww')
            if(allBetWithMarketId[bets].status === 'WON'){
                let debitCreditAmount = allBetWithMarketId[bets].returns
                let user = await User.findByIdAndUpdate(allBetWithMarketId[bets].userId, {$inc:{availableBalance: -debitCreditAmount, myPL: -debitCreditAmount, uplinePL: debitCreditAmount, pointsWL:-debitCreditAmount}})
                let description = `Settled Bet for ${allBetWithMarketId[bets].match}/stake = ${allBetWithMarketId[bets].Stake}/CANCEL`
                await Bet.findByIdAndUpdate(allBetWithMarketId[bets].id, {status:"CANCEL",settleDate:Date.now(), returns:0, remark:data.data.remark, calcelUser:operatoruserName})
                let userAcc = {
                    "user_id":user._id,
                    "description": description,
                    "creditDebitamount" : -debitCreditAmount,
                    "balance" : user.availableBalance - debitCreditAmount,
                    "date" : Date.now(),
                    "userName" : user.userName,
                    "role_type" : user.role_type,
                    "Remark":"-",
                    "stake": allBetWithMarketId[bets].Stake,
                    "transactionId":`${allBetWithMarketId[bets].transactionId}`
                }

                let debitAmountForP = debitCreditAmount
                let uplinePl = 0
                for(let i = 1; i < user.parentUsers.length; i++){
                    let parentUser1 = await User.findById(user.parentUsers[i])
                    let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                    let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                    parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                    parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                    await User.findByIdAndUpdate(user.parentUsers[i - 1], {
                        $inc: {
                            downlineBalance: -debitCreditAmount,
                            myPL: parentUser2Amount,
                            pointsWL: -debitCreditAmount
                        }
                    });
                    await User.findByIdAndUpdate(user.parentUsers[i], {
                        $inc : {
                            uplinePL: parseFloat(parentUser2Amount) + parseFloat(uplinePl),
                        }
                    })

                    if(i === user.parentUsers.length-1 ){
                        await User.findByIdAndUpdate(user.parentUsers[i], {
                            $inc: {
                                downlineBalance: -debitCreditAmount,
                                myPL: parentUser1Amount,
                                pointsWL: -debitCreditAmount
                            }
                        });
                    }
                    uplinePl = parseFloat(uplinePl) + parseFloat(parentUser2Amount)
                }
                    await accountStatementModel.create(userAcc);                
            }else{
                let debitCreditAmount = -(allBetWithMarketId[bets].returns)
                let user = await User.findByIdAndUpdate(allBetWithMarketId[bets].userId, {$inc:{availableBalance: debitCreditAmount, myPL: debitCreditAmount, uplinePL: -debitCreditAmount, pointsWL:debitCreditAmount}})
                let description = `Settled Bet for ${allBetWithMarketId[bets].match}/stake = ${allBetWithMarketId[bets].Stake}/CANCEL`
                await Bet.findByIdAndUpdate(allBetWithMarketId[bets].id, {status:"CANCEL", settleDate:Date.now(),returns:0, remark:data.data.remark, calcelUser:operatoruserName})
                let userAcc = {
                    "user_id":user._id,
                    "description": description,
                    "creditDebitamount" : debitCreditAmount,
                    "balance" : user.availableBalance + debitCreditAmount,
                    "date" : Date.now(),
                    "userName" : user.userName,
                    "role_type" : user.role_type,
                    "Remark":"-",
                    "stake": allBetWithMarketId[bets].Stake,
                    "transactionId":`${allBetWithMarketId[bets].transactionId}`
                }

                let debitAmountForP = debitCreditAmount
                let uplinePl = 0
                for(let i = 1; i < user.parentUsers.length; i++){
                    let parentUser1 = await User.findById(user.parentUsers[i])
                    let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                    let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                    parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                    parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                    await User.findByIdAndUpdate(user.parentUsers[i - 1], {
                        $inc: {
                            downlineBalance: debitCreditAmount,
                            myPL: -parentUser2Amount,
                            pointsWL: debitCreditAmount
                        }
                    });
                    await User.findByIdAndUpdate(user.parentUsers[i], {
                        $inc : {
                            uplinePL: -parseFloat(parentUser2Amount) + parseFloat(uplinePl),
                        }
                    })

                    if(i === user.parentUsers.length-1 ){
                        await User.findByIdAndUpdate(user.parentUsers[i], {
                            $inc: {
                                downlineBalance: debitCreditAmount,
                                myPL: -parentUser1Amount,
                                pointsWL: debitCreditAmount
                            }
                        });
                    }
                    uplinePl = parseFloat(uplinePl) - parseFloat(parentUser2Amount)
                }
                    await accountStatementModel.create(userAcc);
            }
            let checkDelete = await InprogressModel.findOneAndUpdate({marketId : allBetWithMarketId[bets].marketId, progressType:'VoideBet'}, {$inc:{settledBet:1}})
            // console.log(checkDelete, '<======== checkDelete')
            if((checkDelete.settledBet + 1) == checkDelete.length){
                await InprogressModel.findOneAndDelete({marketId : allBetWithMarketId[bets].marketId, progressType:'VoideBet'})
            }

            await revockCommissionFromBetId(allBetWithMarketId[bets])
        }
        return 'Process Start'
    }catch(err){
        console.log(err)
        return 'Please try again leter'
    }

//  return "WORKING"
}


module.exports = voidBET