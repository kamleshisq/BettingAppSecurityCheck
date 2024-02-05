const userModel = require('../model/userModel');
const accountStatementModel = require("../model/accountStatementByUserModel");
const Bet = require('../model/betmodel');
const settlementHistory = require('../model/settelementHistory')
const InprogressModel = require('../model/InprogressModel');
const Decimal = require('decimal.js');
const commissionNewModel = require('../model/commissioNNModel');
const revokeCommission = require('./commissionRevocke');


async function updateParents2(user, amount, downLevelBalance){
    // for(let i = user.parentUsers.length - 1; i >= 1; i--){
    //     let parentUser1 = await userModel.findById(user.parentUsers[i])
    //     let parentUser2 = await userModel.findById(user.parentUsers[i-1])
    //     let parentUser1Amount = new Decimal(parentUser1.myShare).times(amount).dividedBy(100)
    //     let parentUser2Amount = new Decimal(parentUser1.Share).times(amount).dividedBy(100);
    //     parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
    //     parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
    //     await userModel.findByIdAndUpdate(user.parentUsers[i], {
    //         $inc: {
    //             downlineBalance: downLevelBalance,
    //             myPL: -parentUser1Amount,
    //             uplinePL: -parentUser2Amount,
    //             lifetimePL: -parentUser1Amount,
    //             pointsWL: downLevelBalance
    //         }
    //     });
    
    //     if (i === 1) {
    //         await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
    //             $inc: {
    //                 downlineBalance: downLevelBalance,
    //                 myPL: -parentUser2Amount,
    //                 lifetimePL: -parentUser2Amount,
    //                 pointsWL: downLevelBalance
    //             }
    //         });
    //     }
    //     amount = parentUser2Amount
    // }

    let uplinePl
    for(let i = 1; i < user.parentUsers.length; i++){
        if(i === 1){
            uplinePl = 0
        }
        let parentUser1 = await userModel.findById(user.parentUsers[i])
        let parentUser1Amount = new Decimal(parentUser1.myShare).times(amount).dividedBy(100)
        let parentUser2Amount = new Decimal(parentUser1.Share).times(amount).dividedBy(100);
        parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
        parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
            await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                $inc: {
                    downlineBalance: downLevelBalance,
                    myPL: -parentUser2Amount,
                    lifetimePL: -parentUser2Amount,
                    pointsWL: downLevelBalance
                }
            });
            await userModel.findByIdAndUpdate(user.parentUsers[i], {
                $inc : {
                    uplinePL: -parseFloat(parentUser2Amount) + parseFloat(uplinePl),
                }
            })
            if(i === user.parentUsers.length-1 ){
                await userModel.findByIdAndUpdate(user.parentUsers[i], {
                    $inc: {
                        downlineBalance: downLevelBalance,
                        myPL: -parentUser1Amount,
                        lifetimePL: -parentUser1Amount,
                        pointsWL: downLevelBalance
                    }
                });
            }
                            
    if(parentUser1Amount !== 0){
        amount = parentUser1Amount
    } 
    uplinePl = parseFloat(uplinePl) - parseFloat(parentUser2Amount)

                            // console.log(user.parentUsers, "user.parentUsersuser.parentUsersuser.parentUsersuser.parentUsersuser.parentUsersuser.parentUsers")
                            
    }
}



module.exports = updateParents2