const User = require('../model/userModel');
const accountStatementModel = require("../model/accountStatementByUserModel");
const Bet = require('../model/betmodel');
const settlementHistory = require('../model/settelementHistory')
const InprogressModel = require('../model/InprogressModel');
const Decimal = require('decimal.js');
const commissionNewModel = require('../model/commissioNNModel');
const revokeCommission = require('./commissionRevocke');

async function voidBET(data){
//  console.log(data, 444)  
revokeCommission(data)
//  let loginUser = await User.findOne({userName:data.LOGINDATA.LOGINUSER.userName}).select('+password'); 
//  if(!loginUser || !(await loginUser.correctPassword(data.data.password, loginUser.password))){
//     return 'please provide a valid password'
// }else{
//     let allBetWithMarketId = await Bet.find({marketId:data.id})
//     await commissionNewModel.updateMany({marketId:data.id,commissionStatus : 'Unclaimed'}, {commissionStatus : 'cancel'})
//     let inprogressData = await InprogressModel.findOne({marketId:data.id, progressType:'VoideBet'})
//     if(inprogressData === null){
//         try{

//             let inprogressData = {
//               eventId : allBetWithMarketId[0].eventId,
//               marketId: allBetWithMarketId[0].marketId,
//               length: allBetWithMarketId.length,
//               marketName: allBetWithMarketId[0].marketName,
//               progressType:'VoideBet'
//             }
//             InProgress = await InprogressModel.create(inprogressData)
//         }catch(err){
//             console.log(err)
//         }
//     }
//     // console.log(inprogressData, "<<<===== inprogressData")
//     // console.log(allBetWithMarketId)
//     let operatorId;
//     let operatoruserName;
//     if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
//         operatorId = data.LOGINDATA.LOGINUSER.parent_id
//         let parentUser = await User.findById(operatorId)
//         operatoruserName = parentUser.userName
//     }else{
//         operatorId = data.LOGINDATA.LOGINUSER._id
//         operatoruserName = data.LOGINDATA.LOGINUSER.userName
//     }
//     let dataForHistory = {
//         marketID:`${data.id}`,
//         userId:`${operatorId}`,
//         eventName: `${allBetWithMarketId[0].match}`,
//         date:Date.now(),
//         result:"Cancel Bet",
//         marketName : `${allBetWithMarketId[0].marketName}`,
//         remark:data.data.remark
//       }
//       await settlementHistory.create(dataForHistory)
//     // console.log(dataForHistory, 121212)
//     try{
//         for(const bets in allBetWithMarketId){
//             if(allBetWithMarketId[bets].status === 'WON'){
//                 let debitCreditAmount = allBetWithMarketId[bets].returns
//                 let user = await User.findByIdAndUpdate(allBetWithMarketId[bets].userId, {$inc:{availableBalance: -debitCreditAmount, myPL: -debitCreditAmount, uplinePL: debitCreditAmount, pointsWL:-debitCreditAmount}})
//                 let description = `Settled Bet for ${allBetWithMarketId[bets].match}/stake = ${allBetWithMarketId[bets].Stake}/CANCEL`
//                 await Bet.findByIdAndUpdate(allBetWithMarketId[bets].id, {status:"CANCEL", returns:0, remark:data.data.remark, calcelUser:operatoruserName})
//                 let userAcc = {
//                     "user_id":user._id,
//                     "description": description,
//                     "creditDebitamount" : -debitCreditAmount,
//                     "balance" : user.availableBalance - debitCreditAmount,
//                     "date" : Date.now(),
//                     "userName" : user.userName,
//                     "role_type" : user.role_type,
//                     "Remark":"-",
//                     "stake": allBetWithMarketId[bets].Stake,
//                     "transactionId":`${allBetWithMarketId[bets].transactionId}`
//                 }

//                 let debitAmountForP = debitCreditAmount
//                     for(let i = user.parentUsers.length - 1; i >= 1; i--){
//                         let parentUser1 = await User.findById(user.parentUsers[i])
//                         let parentUser2 = await User.findById(user.parentUsers[i - 1])
//                         let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
//                         let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
//                         // parentUser1Amount = Math.round(parentUser1Amount * 10000) / 10000;
//                         // parentUser2Amount = Math.round(parentUser2Amount * 10000) / 10000;
//                         parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
//                         parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
//                         // await User.findByIdAndUpdate(user.parentUsers[i],{$inc:{downlineBalance:parseFloat(bet.Stake * bet.oddValue), myPL:-(parentUser1Amount), uplinePL: -(parentUser2Amount), lifetimePL:-(parentUser1Amount), pointsWL:parseFloat(bet.Stake * bet.oddValue)}})
//                         // if(i === 1){
//                         //     await User.findByIdAndUpdate(user.parentUsers[i - 1],{$inc:{downlineBalance:parseFloat(bet.Stake * bet.oddValue), myPL:-(parentUser2Amount), lifetimePL:-(parentUser2Amount), pointsWL:parseFloat(bet.Stake * bet.oddValue)}})
//                         // }
//                         await User.findByIdAndUpdate(user.parentUsers[i], {
//                         $inc: {
//                             downlineBalance:  -debitCreditAmount,
//                             myPL: parentUser1Amount,
//                             uplinePL: parentUser2Amount,
//                             lifetimePL: parentUser1Amount,
//                             pointsWL:  -debitCreditAmount
//                         }
//                     });
                
//                     if (i === 1) {
//                         await User.findByIdAndUpdate(user.parentUsers[i - 1], {
//                             $inc: {
//                                 downlineBalance: -debitCreditAmount,
//                                 myPL: parentUser2Amount,
//                                 lifetimePL: parentUser2Amount,
//                                 pointsWL: -debitCreditAmount
//                             }
//                         });
//                     }
//                         debitAmountForP = parentUser2Amount
//                     }
//                     await accountStatementModel.create(userAcc);                
//             }else{
//                 let debitCreditAmount = -(allBetWithMarketId[bets].returns)
//                 let user = await User.findByIdAndUpdate(allBetWithMarketId[bets].userId, {$inc:{availableBalance: debitCreditAmount, myPL: debitCreditAmount, uplinePL: -debitCreditAmount, pointsWL:debitCreditAmount}})
//                 let description = `Settled Bet for ${allBetWithMarketId[bets].match}/stake = ${allBetWithMarketId[bets].Stake}/CANCEL`
//                 await Bet.findByIdAndUpdate(allBetWithMarketId[bets].id, {status:"CANCEL", returns:0, remark:data.data.remark, calcelUser:operatoruserName})
//                 let userAcc = {
//                     "user_id":user._id,
//                     "description": description,
//                     "creditDebitamount" : debitCreditAmount,
//                     "balance" : user.availableBalance + debitCreditAmount,
//                     "date" : Date.now(),
//                     "userName" : user.userName,
//                     "role_type" : user.role_type,
//                     "Remark":"-",
//                     "stake": allBetWithMarketId[bets].Stake,
//                     "transactionId":`${allBetWithMarketId[bets].transactionId}`
//                 }

//                 let debitAmountForP = debitCreditAmount
//                     for(let i = user.parentUsers.length - 1; i >= 1; i--){
//                         let parentUser1 = await User.findById(user.parentUsers[i])
//                         let parentUser2 = await User.findById(user.parentUsers[i - 1])
//                         let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
//                         let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
//                         parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
//                         parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
//                         await User.findByIdAndUpdate(user.parentUsers[i], {
//                         $inc: {
//                             downlineBalance:  debitCreditAmount,
//                             myPL: -parentUser1Amount,
//                             uplinePL: -parentUser2Amount,
//                             lifetimePL: -parentUser1Amount,
//                             pointsWL:  debitCreditAmount
//                         }
//                     });
                
//                     if (i === 1) {
//                         await User.findByIdAndUpdate(user.parentUsers[i - 1], {
//                             $inc: {
//                                 downlineBalance: debitCreditAmount,
//                                 myPL: -parentUser2Amount,
//                                 lifetimePL: -parentUser2Amount,
//                                 pointsWL: debitCreditAmount
//                             }
//                         });
//                     }
//                         debitAmountForP = parentUser2Amount
//                     }
//                     await accountStatementModel.create(userAcc);
//             }
//             let checkDelete = await InprogressModel.findOneAndUpdate({marketId : allBetWithMarketId[bets].marketId, progressType:'VoideBet'}, {$inc:{settledBet:1}})
//             console.log(checkDelete, '<======== checkDelete')
//             if((checkDelete.settledBet + 1) == checkDelete.length){
//                 await InprogressModel.findOneAndDelete({marketId : allBetWithMarketId[bets].marketId, progressType:'VoideBet'})
//             }
//         }
//         return 'Process Start'
//     }catch(err){
//         console.log(err)
//         return 'Please try again leter'
//     }
// }
//  return "WORKING"
}


module.exports = voidBET