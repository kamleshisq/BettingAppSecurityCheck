const cron = require('node-cron');
const betModel = require('../model/betmodel');
const accModel = require('../model/accountStatementByUserModel');
const userModel = require("../model/userModel");
const Decimal = require('decimal.js');


module.exports = () => { 
    cron.schedule('*/5 * * * * *', async() => { 
        console.log('WORKING 123456879')
        let currentDate = new Date();
        let oneDayAgo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
        let openCasinoBets = await betModel.find({status:'OPEN', selectionName: { $exists: false },  oddvalue:{ $exists: false }, date:{$lt : oneDayAgo}})
        // console.log(openCasinoBets)
        if(openCasinoBets.length > 0){
            for(const bet in openCasinoBets){
                let returnAmount = Math.abs(openCasinoBets[bet].returns)
                await betModel.findByIdAndUpdate(openCasinoBets[bet].id, {status:"CANCEL", return:0 ,remark:'bet cancel due to technical problem'});
                let user = await userModel.findByIdAndUpdate(openCasinoBets[bet].userId, {$inc:{exposure:-returnAmount, availableBalance:returnAmount}})
                let description = `Unsettle Bet for ${openCasinoBets[bet].event}/stake = ${openCasinoBets[bet].Stake}/CANCEL due to technical problem`
                let userAcc = {
                    "user_id":user._id,
                    "description": description,
                    "creditDebitamount" : returnAmount,
                    "balance" : parseFloat(user.availableBalance) + parseFloat(returnAmount),
                    "date" : Date.now(),
                    "userName" : user.userName,
                    "role_type" : user.role_type,
                    "Remark":'bet cancel due to technical problem',
                    "stake": openCasinoBets[bet].Stake,
                    "transactionId":`${openCasinoBets[bet].transactionId}`
                }

                await accModel.create(userAcc);
                
            }
        }
    })
}