const Bet = require('../model/betmodel');
const User = require('../model/userModel');
const AccModel = require('../model/accountStatementByUserModel');
const settlementHistoryModel = require('../model/settelementHistory');
const InprogressModel = require('../model/InprogressModel');
const Decimal =  require('decimal.js');
const commissionNewModel = require('../model/commissioNNModel');







async function voidbetBeforePlace(data){

    // console.log(data , '+==> voidbetBeforePlace')
    try{

        let bets = await Bet.find({marketId:data.id, status : {$in: ['OPEN', 'MAP']}})
        await commissionNewModel.updateMany({marketId:data.id,commissionStatus : 'Unclaimed'}, {commissionStatus : 'cancel'})
        let inprogressData = await InprogressModel.findOne({marketId:data.id, progressType:'VoideBet'})
        if(inprogressData === null){
            try{
    
                let inprogressData = {
                  eventId : bets[0].eventId,
                  marketId: bets[0].marketId,
                  length: bets.length,
                  marketName: bets[0].marketName,
                  progressType:'VoideBet'
                }
                InProgress = await InprogressModel.create(inprogressData)
            }catch(err){
                console.log(err)
            }
        }
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
        // console.log(inprogressData , '<<+++=== inprogressData')
        let dataForHistory = {
            marketID:`${data.id}`,
            userId:`${operatorId}`,
            eventName: `${bets[0].match}`,
            date:Date.now(),
            result:"Cancel Bet",
            marketName : `${bets[0].marketName}`,
            remark:data.data.remark
          }
          await settlementHistoryModel.create(dataForHistory)
                    for(const bet in bets){
                        let exposure = bets[bet].exposure

                        await Bet.findByIdAndUpdate(bets[bet].id, {status:"CANCEL", returns:0 ,remark:data.data.remark, calcelUser:operatoruserName});
                        let user = await User.findByIdAndUpdate(bets[bet].userId, {$inc:{exposure:-exposure}})
                        let description = `Unsettle Bet for ${bets[bet].match}/stake = ${bets[bet].Stake}/CANCEL`
                        // let description2 = `Bet for ${bets[bet].match}/stake = ${creditDebitamount}/user = ${user.userName}/CANCEL `
                        let userAcc = {
                            "user_id":user._id,
                            "description": description,
                            "creditDebitamount" : 0,
                            "balance" : user.availableBalance + 0,
                            "date" : Date.now(),
                            "userName" : user.userName,
                            "role_type" : user.role_type,
                            "Remark":data.data.remark,
                            "stake": bets[bet].Stake,
                            "transactionId":`${bets[bet].transactionId}`
                        }
                        // await AccModel.create(userAcc);

                        let checkDelete = await InprogressModel.findOneAndUpdate({marketId : bets[bet].marketId, progressType:'VoideBet'}, {$inc:{settledBet:1}})
                        // console.log(checkDelete, '<======== checkDelete')
                        if((checkDelete.settledBet + 1) == checkDelete.length){
                            await InprogressModel.findOneAndDelete({marketId : bets[bet].marketId, progressType:'VoideBet'})
                        }
                    }
                    // socket.emit('VoidBetIn', {betdata:bets[0], count:bets.length ,status:"success"})
                    let resultData = {
                        betdata:bets[0], count:bets.length - 1 ,status:"success"
                    }
                    return resultData
    }catch(err){
        console.log(err)
        let resultData = {
            status:"error"
        }
        return resultData
    }

}

module.exports = voidbetBeforePlace