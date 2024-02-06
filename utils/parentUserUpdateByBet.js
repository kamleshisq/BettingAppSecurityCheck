const userModel = require('../model/userModel');
const accountStatementModel = require("../model/accountStatementByUserModel");
const Bet = require('../model/betmodel');
const settlementHistory = require('../model/settelementHistory')
const InprogressModel = require('../model/InprogressModel');
const Decimal = require('decimal.js');
const commissionNewModel = require('../model/commissioNNModel');
const revokeCommission = require('./commissionRevocke');


async function updateParents(user, amount, downLevelBalance){
    // for(let i = user.parentUsers.length - 1; i >= 1; i--){
    //     let parentUser1 = await userModel.findById(user.parentUsers[i])
    //     let parentUser2 = await userModel.findById(user.parentUsers[i-1])
    //     let parentUser1Amount = new Decimal(parentUser1.myShare).times(amount).dividedBy(100)
    //     let parentUser2Amount = new Decimal(parentUser1.Share).times(amount).dividedBy(100);
    //     parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
    //     parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
    //     await userModel.findByIdAndUpdate(user.parentUsers[i], {
    //         $inc: {
    //             downlineBalance: -downLevelBalance,
    //             myPL: parentUser1Amount,
    //             uplinePL: parentUser2Amount,
    //             lifetimePL: parentUser1Amount,
    //             pointsWL: -downLevelBalance
    //         }
    //     });
    
    //     if (i === 1) {
    //         await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
    //             $inc: {
    //                 downlineBalance: -downLevelBalance,
    //                 myPL: parentUser2Amount,
    //                 lifetimePL: parentUser2Amount,
    //                 pointsWL: -downLevelBalance
    //             }
    //         });
    //     }
    //     amount = parentUser2Amount
    // }


    let uplinePl = 0
    for(let i = 1; i < user.parentUsers.length; i++){
        let parentUser1 = await userModel.findById(user.parentUsers[i])
        let parentUser1Amount = new Decimal(parentUser1.myShare).times(amount).dividedBy(100)
        let parentUser2Amount = new Decimal(parentUser1.Share).times(amount).dividedBy(100);
        parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
        parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
        await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
            $inc: {
                downlineBalance: -downLevelBalance,
                myPL: parentUser2Amount,
                pointsWL: -downLevelBalance
            }
        });
        await userModel.findByIdAndUpdate(user.parentUsers[i], {
            $inc : {
                uplinePL: parseFloat(parentUser2Amount) + parseFloat(uplinePl),
            }
        })

        if(i === user.parentUsers.length-1 ){
            await userModel.findByIdAndUpdate(user.parentUsers[i], {
                $inc: {
                    downlineBalance: -downLevelBalance,
                    myPL: parentUser1Amount,
                    pointsWL: -downLevelBalance
                }
            });
        }
        uplinePl = parseFloat(uplinePl) + parseFloat(parentUser2Amount)
    }
                
}



module.exports = updateParents