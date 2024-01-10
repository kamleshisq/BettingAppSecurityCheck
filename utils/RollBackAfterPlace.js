let User = require('../model/userModel');
let accountStatementModel = require('../model/accountStatementByUserModel');
let Bet = require('../model/betmodel');
let settlementHistory = require("../model/settelementHistory");
const InprogressModel = require('../model/InprogressModel');
let Decimal = require('decimal.js');
const commissionNewModel = require('../model/commissioNNModel');
const revokeCommission = require('./commissionRevocke');


async function rollBack(data){
    // console.log(data, "rollBack Data")
   
        let allBetWithMarketId = await Bet.find({marketId:data.id})
        revokeCommission(data)
        // await commissionNewModel.updateMany({marketId:data.id, commissionType: 'Win Commission', commissionStatus : 'Unclaimed'}, {commissionStatus : 'Unclaimed'})
        await commissionNewModel.deleteMany({marketId:data.id, commissionType: 'Win Commission', commissionStatus : 'Unclaimed'})
        let InProgress = await InprogressModel.findOne({marketId : allBetWithMarketId[0].marketId, progressType:'RollBack'})
        if(InProgress === null){
            try{
    
                let inprogressData = {
                  eventId : allBetWithMarketId[0].eventId,
                  marketId: allBetWithMarketId[0].marketId,
                  length: allBetWithMarketId.length,
                  marketName: allBetWithMarketId[0].marketName,
                  progressType:'RollBack'
                }
                InProgress = await InprogressModel.create(inprogressData)
            }catch(err){
                console.log(err)
            }
        }
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
            result:"ROLLBACK BET",
            marketName : `${allBetWithMarketId[0].marketName}`,
            remark:data.data.remark
          }
          await settlementHistory.create(dataForHistory)
        // console.log(dataForHistory)
        try{
            for(const bets in allBetWithMarketId){
                if(allBetWithMarketId[bets].status === 'WON'){
                    let VoidAmount  = allBetWithMarketId[bets].returns
                    let exposure = allBetWithMarketId[bets].exposure
                    
                    await Bet.findByIdAndUpdate(allBetWithMarketId[bets].id, {status:"OPEN", returns:-exposure, remark:data.data.remark, calcelUser:operatoruserName})
                    let user = await User.findByIdAndUpdate(allBetWithMarketId[bets].userId, {$inc:{availableBalance: -VoidAmount, myPL: -VoidAmount, pointsWL: -VoidAmount, uplinePL: VoidAmount, exposure: exposure}})
                    let description = `Settle Bet for ${allBetWithMarketId[bets].match}/stake = ${allBetWithMarketId[bets].Stake}/OPEN`
                    let userAcc = {
                        "user_id":user._id,
                        "description": description,
                        "creditDebitamount" : -VoidAmount,
                        "balance" : user.availableBalance - VoidAmount,
                        "date" : Date.now(),
                        "userName" : user.userName,
                        "role_type" : user.role_type,
                        "Remark":"-",
                        "stake": allBetWithMarketId[bets].Stake,
                        "transactionId":`${allBetWithMarketId[bets].transactionId}`,
                        "type":'ROLLBACK'
                    }

                    let debitAmountForP = VoidAmount
                    for(let i = user.parentUsers.length - 1; i >= 1; i--){
                        let parentUser1 = await User.findById(user.parentUsers[i])
                        let parentUser2 = await User.findById(user.parentUsers[i - 1])
                        let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                        let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                        parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                        parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                        await User.findByIdAndUpdate(user.parentUsers[i], {
                          $inc: {
                              downlineBalance:  -VoidAmount,
                              myPL: parentUser1Amount,
                              uplinePL: parentUser2Amount,
                              lifetimePL: parentUser1Amount,
                              pointsWL:  -VoidAmount
                          }
                      });
                  
                      if (i === 1) {
                          await User.findByIdAndUpdate(user.parentUsers[i - 1], {
                              $inc: {
                                  downlineBalance: -VoidAmount,
                                  myPL: parentUser2Amount,
                                  lifetimePL: parentUser2Amount,
                                  pointsWL: -VoidAmount
                              }
                          });
                      }
                        debitAmountForP = parentUser2Amount
                    }
        
                    await accountStatementModel.create(userAcc);
                }else{
                    let VoidAmount = Math.abs(allBetWithMarketId[bets].returns)
                    let exposure = allBetWithMarketId[bets].exposure
                    await Bet.findByIdAndUpdate(allBetWithMarketId[bets].id, {status:"OPEN", remark:data.data.remark, calcelUser:operatoruserName})
                    let user = await User.findByIdAndUpdate(allBetWithMarketId[bets].userId, {$inc:{availableBalance: VoidAmount, myPL: VoidAmount, pointsWL: VoidAmount, uplinePL: -VoidAmount, exposure: exposure}})

                    let description = `Settle Bet for ${allBetWithMarketId[bets].match}/stake = ${allBetWithMarketId[bets].Stake}/OPEN`
                    let userAcc = {
                        "user_id":user._id,
                        "description": description,
                        "creditDebitamount" : VoidAmount,
                        "balance" : user.availableBalance + VoidAmount,
                        "date" : Date.now(),
                        "userName" : user.userName,
                        "role_type" : user.role_type,
                        "Remark":"-",
                        "stake": allBetWithMarketId[bets].Stake,
                        "transactionId":`${allBetWithMarketId[bets].transactionId}`,
                        "type":'ROLLBACK'
                    }

                    let debitAmountForP = VoidAmount
                    for(let i = user.parentUsers.length - 1; i >= 1; i--){
                        let parentUser1 = await User.findById(user.parentUsers[i])
                        let parentUser2 = await User.findById(user.parentUsers[i - 1])
                        let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                        let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                        parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                        parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                        await User.findByIdAndUpdate(user.parentUsers[i], {
                          $inc: {
                              downlineBalance:  VoidAmount,
                              myPL: -parentUser1Amount,
                              uplinePL: -parentUser2Amount,
                              lifetimePL: -parentUser1Amount,
                              pointsWL:  VoidAmount
                          }
                      });
                  
                      if (i === 1) {
                          await User.findByIdAndUpdate(user.parentUsers[i - 1], {
                              $inc: {
                                  downlineBalance: VoidAmount,
                                  myPL: -parentUser2Amount,
                                  lifetimePL: -parentUser2Amount,
                                  pointsWL: VoidAmount
                              }
                          });
                      }
                        debitAmountForP = parentUser2Amount
                    }
        
                    await accountStatementModel.create(userAcc);
                }

                let checkDelete = await InprogressModel.findOneAndUpdate({marketId : allBetWithMarketId[bets].marketId, progressType:'RollBack'}, {$inc:{settledBet:1}})
                // console.log(checkDelete, '<======== checkDelete')
                if((checkDelete.settledBet + 1) == checkDelete.length){
                    await InprogressModel.findOneAndDelete({marketId : allBetWithMarketId[bets].marketId, progressType:'RollBack'})
                }
            }

            return 'Process Start For rollBack'
        }catch(err){
            console.log(err)
            return 'Please try again leter'
        }

}


module.exports = rollBack