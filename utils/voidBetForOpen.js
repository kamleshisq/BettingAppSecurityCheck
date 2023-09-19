const Bet = require('../model/betmodel');
const User = require('../model/userModel');
const AccModel = require('../model/accountStatementByUserModel');
const settlementHistoryModel = require('../model/settelementHistory');







async function voidbetBeforePlace(data){

    console.log(data , '+==> voidbetBeforePlace')

    // let bets = await Bet.find({marketId:data.id, status : {$in: ['OPEN', 'MAP']}})
    //             for(const bet in bets){
    //                 // console.log(bets[bet].id, 12)
    //                 await Bet.findByIdAndUpdate(bets[bet].id, {status:"CANCEL", remark:data.data.remark, calcelUser:data.LOGINDATA.LOGINUSER.userName});
    //                 let user = await User.findByIdAndUpdate(bets[bet].userId, {$inc:{balance: bets[bet].Stake, availableBalance: bets[bet].Stake, myPL: bets[bet].Stake, exposure:-bets[bet].Stake}})
    //                 let description = `Bet for ${bets[bet].match}/stake = ${bets[bet].Stake}/CANCEL`
    //                 let description2 = `Bet for ${bets[bet].match}/stake = ${bets[bet].Stake}/user = ${user.userName}/CANCEL `
    //                 let userAcc = {
    //                     "user_id":user._id,
    //                     "description": description,
    //                     "creditDebitamount" : bets[bet].Stake,
    //                     "balance" : user.availableBalance + bets[bet].Stake,
    //                     "date" : Date.now(),
    //                     "userName" : user.userName,
    //                     "role_type" : user.role_type,
    //                     "Remark":"-",
    //                     "stake": bets[bet].Stake,
    //                     "transactionId":`${bets[bet].transactionId}`
    //                 }
    //                 let parentAcc
    //                 if(user.parentUsers.length < 2){
    //                     await User.updateMany({ _id: { $in: user.parentUsers } }, {$inc:{balance: bets[bet].Stake, downlineBalance: bets[bet].Stake}})
    //                     let parent = await User.findByIdAndUpdate(user.parentUsers[0], {$inc:{availableBalance:-bets[bet].Stake}})
    //                     parentAcc = {
    //                         "user_id":parent._id,
    //                         "description": description2,
    //                         "creditDebitamount" : -bets[bet].Stake,
    //                         "balance" : parent.availableBalance - (bets[bet].Stake * 1),
    //                         "date" : Date.now(),
    //                         "userName" : parent.userName,
    //                         "role_type" : parent.role_type,
    //                         "Remark":"-",
    //                         "stake": bets[bet].Stake,
    //                         "transactionId":`${bets[bet].transactionId}Parent`
    //                     }
                        
    //                 }else{
    //                     await User.updateMany({ _id: { $in: user.parentUsers.slice(1) } }, {$inc:{balance: bets[bet].Stake, downlineBalance: bets[bet].Stake}})
    //                     let parent = await User.findByIdAndUpdate(user.parentUsers[1], {$inc:{availableBalance:-bets[bet].Stake}})
    //                     parentAcc = {
    //                         "user_id":parent._id,
    //                         "description": description2,
    //                         "creditDebitamount" : -bets[bet].Stake,
    //                         "balance" : parent.availableBalance - (bets[bet].Stake * 1),
    //                         "date" : Date.now(),
    //                         "userName" : parent.userName,
    //                         "role_type" : parent.role_type,
    //                         "Remark":"-",
    //                         "stake": bets[bet].Stake,
    //                         "transactionId":`${bets[bet].transactionId}Parent`
    //                     }
    //                 }
    //                 await AccModel.create(userAcc);
    //                 await AccModel.create(parentAcc);  // socket.emit('voidBet', {bet, status:"success"})
    //             }
    //             socket.emit('VoidBetIn', {betdata:bets[0], count:bets.length ,status:"success"})
}

module.exports = voidbetBeforePlace