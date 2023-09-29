const Bet = require('../model/betmodel');
const User = require('../model/userModel');
const AccModel = require('../model/accountStatementByUserModel');
const settlementHistoryModel = require('../model/settelementHistory');
const InprogressModel = require('../model/InprogressModel');
const Decimal =  require('decimal.js')







async function voidbetBeforePlace(data){

    // console.log(data , '+==> voidbetBeforePlace')
    try{

        let bets = await Bet.find({marketId:data.id, status : {$in: ['OPEN', 'MAP']}})
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

        // console.log(inprogressData , '<<+++=== inprogressData')
        let dataForHistory = {
            marketID:`${data.id}`,
            userId:`${data.LOGINDATA.LOGINUSER._id}`,
            eventName: `${bets[0].match}`,
            date:Date.now(),
            result:"Cancel Bet",
            marketName : `${bets[0].marketName}`,
            remark:data.data.remark
          }
          await settlementHistoryModel.create(dataForHistory)
                    for(const bet in bets){
                        // console.log(bets[bet].id, 12)
                        await Bet.findByIdAndUpdate(bets[bet].id, {status:"CANCEL", return:0 ,remark:data.data.remark, calcelUser:data.LOGINDATA.LOGINUSER.userName});
                        let user = await User.findByIdAndUpdate(bets[bet].userId, {$inc:{availableBalance: bets[bet].Stake, myPL: bets[bet].Stake, exposure:-bets[bet].Stake, pointsWL: bets[bet].Stake, uplinePL: -bets[bet].Stake}})
                        let description = `Bet for ${bets[bet].match}/stake = ${bets[bet].Stake}/CANCEL`
                        // let description2 = `Bet for ${bets[bet].match}/stake = ${bets[bet].Stake}/user = ${user.userName}/CANCEL `
                        let userAcc = {
                            "user_id":user._id,
                            "description": description,
                            "creditDebitamount" : bets[bet].Stake,
                            "balance" : user.availableBalance + bets[bet].Stake,
                            "date" : Date.now(),
                            "userName" : user.userName,
                            "role_type" : user.role_type,
                            "Remark":"-",
                            "stake": bets[bet].Stake,
                            "transactionId":`${bets[bet].transactionId}`
                        }
    
                        let debitAmountForP = -bets[bet].Stake
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
                              downlineBalance:  bets[bet].Stake,
                              myPL: parentUser1Amount,
                              uplinePL: parentUser2Amount,
                              lifetimePL: parentUser1Amount,
                              pointsWL:  bets[bet].Stake
                          }
                      });
                  
                      if (i === 1) {
                          await User.findByIdAndUpdate(user.parentUsers[i - 1], {
                              $inc: {
                                  downlineBalance: bets[bet].Stake,
                                  myPL: parentUser2Amount,
                                  lifetimePL: parentUser2Amount,
                                  pointsWL: bets[bet].Stake
                              }
                          });
                      }
                        debitAmountForP = parentUser2Amount
                    }
                        
                        await AccModel.create(userAcc);

                        let checkDelete = await InprogressModel.findOneAndUpdate({marketId : bets[bet].marketId, progressType:'VoideBet'}, {$inc:{settledBet:1}})
                        console.log(checkDelete, '<======== checkDelete')
                        if((checkDelete.settledBet + 1) == checkDelete.length){
                            // await InprogressModel.findOneAndDelete({marketId : bets[bet].marketId, progressType:'VoideBet'})
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