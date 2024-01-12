const Bet = require('../model/betmodel');
const User = require('../model/userModel');
const AccModel = require('../model/accountStatementByUserModel');
const settlementHistoryModel = require('../model/settelementHistory');
const InprogressModel = require('../model/InprogressModel');
const Decimal =  require('decimal.js');
const commissionNewModel = require('../model/commissioNNModel');


async function voidbetOPENFORTIMELYVOIDE(data){
    // console.log(data, "DATADAT")
    try{
        let filterData ={}
        if(data.filterData.from_date && data.filterData.to_date){
            filterData.date = {$gte : new Date(data.filterData.from_date),$lte : new Date(new Date(data.filterData.to_date))}
        }else{
            if(data.filterData.from_date){
                filterData.date = {$gte : data.filterData.from_date}

            }
            if(data.filterData.to_date){
                filterData.date = {$lte : new Date(new Date(data.filterData.to_date))}

            }
        }
        filterData.marketId = data.id
        filterData.status = {$in: ['OPEN', 'MAP']}
        let operatoruserName = data.LOGINDATA.LOGINUSER.userName
        if(data.filterData.userName !== data.LOGINDATA.LOGINUSER.userName){
            filterData.userName = data.filterData.userName
        }else{
            let childrenUsername 
            if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
                childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER.parent_id });
            }else{
                childrenUsername = await User.distinct('userName', { parentUsers: data.LOGINDATA.LOGINUSER._id });
            }
            filterData.userName = {$in:childrenUsername}
        }
        console.log(filterData, "filterDatafilterDatafilterData")
        let bets = await Bet.find(filterData)
                    for(const bet in bets){
                        let exposure = bets[bet].exposure

                        await Bet.findByIdAndUpdate(bets[bet].id, {status:"CANCEL", return:0 ,remark:data.data.remark, calcelUser:operatoruserName});
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


module.exports = voidbetOPENFORTIMELYVOIDE