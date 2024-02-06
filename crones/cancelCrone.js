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
        console.log(openCasinoBets)
        if(openCasinoBets.length > 0){
            for(const bet in openCasinoBets){
                let returnAmount = Math.abs(openCasinoBets[bet].returns)
                await betModel.findByIdAndUpdate(openCasinoBets[bet].id, {status:"CANCEL", returns:0 ,remark:'bet cancel due to technical problem'});
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

                let debitAmountForP = returnAmount
                    for(let i = user.parentUsers.length - 1; i >= 1; i--){
                        let parentUser1 = await User.findById(user.parentUsers[i])
                        let parentUser2 = await User.findById(user.parentUsers[i - 1])
                        let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                        let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                        parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                        parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                        await User.findByIdAndUpdate(user.parentUsers[i], {
                        $inc: {
                            downlineBalance:  returnAmount,
                            myPL: -parentUser1Amount,
                            uplinePL: -parentUser2Amount,
                            lifetimePL: -parentUser1Amount,
                            pointsWL:  returnAmount
                        }
                    });
                
                    if (i === 1) {
                        await User.findByIdAndUpdate(user.parentUsers[i - 1], {
                            $inc: {
                                downlineBalance: returnAmount,
                                myPL: -parentUser2Amount,
                                lifetimePL: -parentUser2Amount,
                                pointsWL: returnAmount
                            }
                        });
                    }
                        debitAmountForP = parentUser2Amount
                    }

                await accModel.create(userAcc);

            }
        }
    })
}