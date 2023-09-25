let User = require('../model/userModel');
let accountStatementModel = require('../model/accountStatementByUserModel');
let Bet = require('../model/betmodel');
let settlementHistory = require("../model/settelementHistory");
let Decimal = require('decimal.js')


async function rollBack(data){
    // console.log(data, "rollBack Data")
    let loginUser = await User.findOne({userName:data.LOGINDATA.LOGINUSER.userName}).select('+password');
    if(!loginUser || !(await loginUser.correctPassword(data.data.password, loginUser.password))){
        return 'please provide a valid password'
    }else{ 
        let allBetWithMarketId = await Bet.find({marketId:data.id})
        console.log(allBetWithMarketId)
        let dataForHistory = {
            marketID:`${data.id}`,
            userId:`${data.LOGINDATA.LOGINUSER._id}`,
            eventName: `${allBetWithMarketId[0].match}`,
            date:Date.now(),
            result:"ROLLBACK BET",
            marketName : `${allBetWithMarketId[0].marketName}`,
            remark:data.data.remark
          }
          await settlementHistory.create(dataForHistory)
        // console.log(dataForHistory)
        try{
            for(const bets in allBetWithMarketId){
                if(allBetWithMarketId[bets].status === 'WON'){
                    let VoidAmount = allBetWithMarketId[bets].returns.toFixed(2)
                    // console.log(VoidAmount, "VOidBetAMOUNT")
                    await Bet.findByIdAndUpdate(allBetWithMarketId[bets].id, {status:"OPEN", returns:-allBetWithMarketId[bets].Stake.toFixed(2), remark:data.data.remark, calcelUser:data.LOGINDATA.LOGINUSER.userName})
                    let user = await User.findByIdAndUpdate(allBetWithMarketId[bets].userId, {$inc:{availableBalance: -VoidAmount, myPL: -VoidAmount, exposure: allBetWithMarketId[bets].Stake.toFixed(2)}})
                    let description = `Bet for ${allBetWithMarketId[bets].match}/stake = ${allBetWithMarketId[bets].Stake}/OPEN`
                    // let description2 = `Bet for ${allBetWithMarketId[bets].match}/stake = ${allBetWithMarketId[bets].Stake}/user = ${user.userName}/CANCEL `
                    let userAcc = {
                        "user_id":user._id,
                        "description": description,
                        "creditDebitamount" : -VoidAmount,
                        "balance" : user.availableBalance - VoidAmount,
                        "date" : Date.now(),
                        "userName" : user.userName,
                        "role_type" : user.role_type,
                        "Remark":"-",
                        "stake": allBetWithMarketId[bets].Stake,
                        "transactionId":`${allBetWithMarketId[bets].transactionId}`
                    }
                    let debitAmountForP = VoidAmount
                    for(let i = user.parentUsers.length - 1; i >= 1; i--){
                        let parentUser1 = await User.findById(user.parentUsers[i])
                        let parentUser2 = await User.findById(user.parentUsers[i - 1])
                        let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                        let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                        // parentUser1Amount = Math.round(parentUser1Amount * 10000) / 10000;
                        // parentUser2Amount = Math.round(parentUser2Amount * 10000) / 10000;
                        parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                        parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                        // await User.findByIdAndUpdate(user.parentUsers[i],{$inc:{downlineBalance:parseFloat(bet.Stake * bet.oddValue), myPL:-(parentUser1Amount), uplinePL: -(parentUser2Amount), lifetimePL:-(parentUser1Amount), pointsWL:parseFloat(bet.Stake * bet.oddValue)}})
                        // if(i === 1){
                        //     await User.findByIdAndUpdate(user.parentUsers[i - 1],{$inc:{downlineBalance:parseFloat(bet.Stake * bet.oddValue), myPL:-(parentUser2Amount), lifetimePL:-(parentUser2Amount), pointsWL:parseFloat(bet.Stake * bet.oddValue)}})
                        // }
                        await User.findByIdAndUpdate(user.parentUsers[i], {
                          $inc: {
                              downlineBalance:  -VoidAmount,
                              myPL: parentUser1Amount,
                              uplinePL: parentUser2Amount,
                              lifetimePL: parentUser1Amount,
                              pointsWL:  -VoidAmount
                          }
                      });
                  
                      if (i === 1) {
                          await User.findByIdAndUpdate(user.parentUsers[i - 1], {
                              $inc: {
                                  downlineBalance: -VoidAmount,
                                  myPL: parentUser2Amount,
                                  lifetimePL: parentUser2Amount,
                                  pointsWL: -VoidAmount
                              }
                          });
                      }
                        debitAmountForP = parentUser2Amount
                    }
        
                    await accountStatementModel.create(userAcc);
                }else{
                    let VoidAmount = allBetWithMarketId[bets].Stake.toFixed(2)
                    await Bet.findByIdAndUpdate(allBetWithMarketId[bets].id, {status:"OPEN", remark:data.data.remark, calcelUser:data.LOGINDATA.LOGINUSER.userName})
                    let user = await User.findByIdAndUpdate(allBetWithMarketId[bets].userId, {$inc:{exposure:VoidAmount}})
                    // let description = `Bet for ${allBetWithMarketId[bets].match}/stake = ${allBetWithMarketId[bets].Stake}/OPEN`
                    // let userAcc = {
                    //     "user_id":user._id,
                    //     "description": description,
                    //     "creditDebitamount" : VoidAmount,
                    //     "balance" : user.availableBalance + VoidAmount,
                    //     "date" : Date.now(),
                    //     "userName" : user.userName,
                    //     "role_type" : user.role_type,
                    //     "Remark":"-",
                    //     "stake": allBetWithMarketId[bets].Stake,
                    //     "transactionId":`${allBetWithMarketId[bets].transactionId}`
                    // }
    
                    // let debitAmountForP = VoidAmount
    
                    // for(let i = user.parentUsers.length - 1; i >= 1; i--){
                    //     let parentUser1 = await User.findById(user.parentUsers[i])
                    //     let parentUser2 = await User.findById(user.parentUsers[i - 1])
                    //     let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                    //     let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                    //     // parentUser1Amount = Math.round(parentUser1Amount * 10000) / 10000;
                    //     // parentUser2Amount = Math.round(parentUser2Amount * 10000) / 10000;
                    //     parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                    //     parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                    //     // await User.findByIdAndUpdate(user.parentUsers[i],{$inc:{downlineBalance:parseFloat(bet.Stake * bet.oddValue), myPL:-(parentUser1Amount), uplinePL: -(parentUser2Amount), lifetimePL:-(parentUser1Amount), pointsWL:parseFloat(bet.Stake * bet.oddValue)}})
                    //     // if(i === 1){
                    //     //     await User.findByIdAndUpdate(user.parentUsers[i - 1],{$inc:{downlineBalance:parseFloat(bet.Stake * bet.oddValue), myPL:-(parentUser2Amount), lifetimePL:-(parentUser2Amount), pointsWL:parseFloat(bet.Stake * bet.oddValue)}})
                    //     // }
                    //     await User.findByIdAndUpdate(user.parentUsers[i], {
                    //       $inc: {
                    //           downlineBalance:  VoidAmount,
                    //           myPL: -parentUser1Amount,
                    //           uplinePL: -parentUser2Amount,
                    //           lifetimePL: -parentUser1Amount,
                    //           pointsWL:  VoidAmount
                    //       }
                    //   });
                  
                    //   if (i === 1) {
                    //       await User.findByIdAndUpdate(user.parentUsers[i - 1], {
                    //           $inc: {
                    //               downlineBalance: -VoidAmount,
                    //               myPL: parentUser2Amount,
                    //               lifetimePL: parentUser2Amount,
                    //               pointsWL: -VoidAmount
                    //           }
                    //       });
                    //   }
                    //     debitAmountForP = parentUser2Amount
                    // }
                    // await accountStatementModel.create(userAcc);
                }
            }

            return 'Process Start For rollBack'
        }catch(err){
            console.log(err)
            return 'Please try again leter'
        }
    } 
}


module.exports = rollBack