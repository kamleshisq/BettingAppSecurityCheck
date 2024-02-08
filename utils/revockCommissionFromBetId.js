let User = require('../model/userModel');
let accountStatementModel = require('../model/accountStatementByUserModel');
let Bet = require('../model/betmodel');
let settlementHistory = require("../model/settelementHistory");
const InprogressModel = require('../model/InprogressModel');
const commissionNewModel = require('../model/commissioNNModel');
let Decimal = require('decimal.js');

async function revockCommissionFromBetId( data ){
    if(data.id){
        let allCommissionFromThatBEt = await commissionNewModel.find({betId:data.id})
        if(allCommissionFromThatBEt.length > 0){
            for(let i = 0; i < allCommissionFromThatBEt.length; i++){
                if(allCommissionFromThatBEt[i].commissionStatus != 'Unclaimed' &&  allCommissionFromThatBEt[i].commissionStatus != 'cancel'){
                    let user = await User.findByIdAndUpdate(allCommissionFromThatBEt[i].userId, {$inc:{availableBalance: -allCommissionFromThatBEt[i].commission}})
                    if(user){
                        let parenet = await User.findByIdAndUpdate(user.parent_id, {$inc:{availableBalance: allCommissionFromThatBEt[i].commission, downlineBalance: -allCommissionFromThatBEt[i].commission}})
                        let desc1 = `Revoke Commisiion for market ${allCommissionFromThatBEt[i].marketName}/${allCommissionFromThatBEt[i].eventName}, ${user.userName}/${parenet.userName}`
                        let desc2 = `Revoke Commisiion of chiled user ${user.userName} for market ${allCommissionFromThatBEt[i].marketName}/${allCommissionFromThatBEt[i].eventName}, ${user.userName}/${parenet.userName}`
                        let childdata = {
                            user_id:user._id,
                            description : desc1,
                            creditDebitamount : -allCommissionFromThatBEt[i].commission,
                            balance : user.availableBalance - allCommissionFromThatBEt[i].commission,
                            date : Date.now(),
                            userName : user.userName,
                            role_type:user.role_type,
                        }
                        let perentData = {
                            user_id:user.parent_id,
                            description : desc2,
                            creditDebitamount : allCommissionFromThatBEt[i].commission,
                            balance : parenet.availableBalance + allCommissionFromThatBEt[i].commission,
                            date : Date.now(),
                            userName : parenet.userName,
                            role_type:parenet.role_type
                        }
                        await accountStatementModel.create(childdata)
                        await accountStatementModel.create(perentData)
                        await commissionNewModel.findByIdAndUpdate(allCommissionFromThatBEt[i].id, {commissionStatus:'cancel'})
                    }
                }else{
                    await commissionNewModel.findByIdAndUpdate(allCommissionFromThatBEt[i].id, {commissionStatus:'cancel'})
                }
            }
            await commissionNewModel.deleteMany({betId:data.id})
        }
    }
}


module.exports = revockCommissionFromBetId