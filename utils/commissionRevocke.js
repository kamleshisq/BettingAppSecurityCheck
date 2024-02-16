let User = require('../model/userModel');
let accountStatementModel = require('../model/accountStatementByUserModel');
let Bet = require('../model/betmodel');
let settlementHistory = require("../model/settelementHistory");
const InprogressModel = require('../model/InprogressModel');
const commissionNewModel = require('../model/commissioNNModel');
let Decimal = require('decimal.js');


async function revokeCommission(data){
    // console.log(data)
    let claimedCommission = await commissionNewModel.find({commissionStatus:'Claimed', marketId:data.id})
    console.log(claimedCommission, "claimedCommissionclaimedCommissionclaimedCommission")
    if(claimedCommission.length > 0){
        for(const i in claimedCommission){
            if(claimedCommission[i].commissionStatus === 'Claimed'){
                let user = await User.findByIdAndUpdate(claimedCommission[i].userId, {$inc:{availableBalance: -claimedCommission[i].commission, myPL: -claimedCommission[i].commission, uplinePL: claimedCommission[i].commission, pointsWL:-claimedCommission[i].commission}})
                if(user){
                    let parenet = await User.findByIdAndUpdate(user.parent_id, {$inc:{availableBalance: claimedCommission[i].commission, downlineBalance: -claimedCommission[i].commission, myPL:claimedCommission[i].commission}})
                    let desc1 = `Revoke Commisiion for market ${claimedCommission[i].marketName}/${claimedCommission[i].eventName}, ${user.userName}/${parenet.userName}`
                    let desc2 = `Revoke Commisiion of chiled user ${user.userName} for market ${claimedCommission[i].marketName}/${claimedCommission[i].eventName}, ${user.userName}/${parenet.userName}`
                    let childdata = {
                        user_id:user._id,
                        description : desc1,
                        creditDebitamount : -claimedCommission[i].commission,
                        balance : user.availableBalance - claimedCommission[i].commission,
                        date : Date.now(),
                        userName : user.userName,
                        role_type:user.role_type,
                    }
                    let perentData = {
                        user_id:user.parent_id,
                        description : desc2,
                        creditDebitamount : claimedCommission[i].commission,
                        balance : parenet.availableBalance + claimedCommission[i].commission,
                        date : Date.now(),
                        userName : parenet.userName,
                        role_type:parenet.role_type
                    }
                    await accountStatementModel.create(childdata)
                    await accountStatementModel.create(perentData)
                }
                await commissionNewModel.findByIdAndUpdate(claimedCommission[i]._id, {commissionStatus:'cancel'})
                
            }
        }
    }

    await commissionNewModel.deleteMany({marketId:data.id})
}

module.exports = revokeCommission