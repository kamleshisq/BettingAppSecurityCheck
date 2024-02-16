const Bet = require('../model/betmodel');
const User = require('../model/userModel');
const accountStatementModel = require('../model/accountStatementByUserModel');
const settlementHistoryModel = require('../model/settelementHistory');
const InprogressModel = require('../model/InprogressModel');
const Decimal =  require('decimal.js');
const commissionNewModel = require('../model/commissioNNModel');
const marketnotificationId = require('../model/timelyVoideNotification');
const revockCommissionFromBetId = require('./revockCommissionFromBetId');
const uuid = require('uuid');


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
        console.log(data.filterData, "filterDATA")
        if(data.filterData.status === 'Settle'){
            filterData.status = {$ne:'OPEN'}
        }
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

        
        // console.log(filterData, "filterDatafilterDatafilterData")
        let bets = await Bet.find(filterData)
        console.log(bets)
        let checkNotification = await marketnotificationId.findOne({marketId : bets[0].marketId})
        if(checkNotification){
            await marketnotificationId.findOneAndUpdate({marketId : bets[0].marketId}, {message : data.FormData1.Remark} )
        }else{
            let timelyNotification = {
                message : data.FormData1.Remark,
                userName : operatoruserName,
                marketId : bets[0].marketId
            }
            await marketnotificationId.create(timelyNotification)
        }

        function generateUniqueIdByMARKETID() {
            const timestamp = new Date().getTime();
            const uniqueId = bets[0].marketId + '-' + timestamp + '-' + uuid.v4();
            return uniqueId
          }
          let uniqueMarketId = generateUniqueIdByMARKETID()

                    for(const bet in bets){
                        if(bets[bet].status == "OPEN"){
                            await Bet.findByIdAndUpdate(bets[bet].id, {status:"CANCEL", returns:0 ,remark:data.FormData1.Remark, calcelUser:operatoruserName});
                        }else if( bets[bet].status == "WON"){
                            let debitCreditAmount = bets[bet].returns
                            let user = await User.findByIdAndUpdate(bets[bet].userId, {$inc:{availableBalance: -debitCreditAmount, myPL: -debitCreditAmount, uplinePL: debitCreditAmount, pointsWL:-debitCreditAmount}})
                            let description = `Settled Bet for ${bets[bet].match}/stake = ${bets[bet].Stake}/CANCEL`
                            await Bet.findByIdAndUpdate(bets[bet].id, {status:"CANCEL",settleDate:Date.now(), returns:0, remark:data.FormData1.Remark, calcelUser:operatoruserName})
                            let userAcc = {
                                "user_id":user._id,
                                "description": description,
                                "creditDebitamount" : -debitCreditAmount,
                                "balance" : user.availableBalance - debitCreditAmount,
                                "date" : Date.now(),
                                "userName" : user.userName,
                                "role_type" : user.role_type,
                                "Remark":"-",
                                "stake": bets[bet].Stake,
                                "transactionId":`${bets[bet].transactionId}`,
                                "cacelMarketId":bets[bet].marketId,
                                "marketType":`${bets[bet].marketName}`,
                                "event":`${bets[bet].match}`,
                                "uniqueTransectionIDbyMARKETID":uniqueMarketId
                            }
                            let debitAmountForP = debitCreditAmount
                            let uplinePl = 0
                            for(let i = 1; i < user.parentUsers.length; i++){
                                let parentUser1 = await User.findById(user.parentUsers[i])
                                let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                                let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                                parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                                parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                                await User.findByIdAndUpdate(user.parentUsers[i - 1], {
                                    $inc: {
                                        downlineBalance: -debitCreditAmount,
                                        myPL: parentUser2Amount,
                                        pointsWL: -debitCreditAmount
                                    }
                                });
                                await User.findByIdAndUpdate(user.parentUsers[i], {
                                    $inc : {
                                        uplinePL: parseFloat(parentUser2Amount) + parseFloat(uplinePl),
                                    }
                                })

                                if(i === user.parentUsers.length-1 ){
                                    await User.findByIdAndUpdate(user.parentUsers[i], {
                                        $inc: {
                                            downlineBalance: -debitCreditAmount,
                                            myPL: parentUser1Amount,
                                            pointsWL: -debitCreditAmount
                                        }
                                    });
                                }
                                uplinePl = parseFloat(uplinePl) + parseFloat(parentUser2Amount)
                            }
                                await accountStatementModel.create(userAcc);  
                        }else if ( bets[bet].status == "LOSS"){
                            let debitCreditAmount = -(bets[bet].returns)
                            let user = await User.findByIdAndUpdate(bets[bet].userId, {$inc:{availableBalance: debitCreditAmount, myPL: debitCreditAmount, uplinePL: -debitCreditAmount, pointsWL:debitCreditAmount}})
                            let description = `Settled Bet for ${bets[bet].match}/stake = ${bets[bet].Stake}/CANCEL`
                            await Bet.findByIdAndUpdate(bets[bet].id, {status:"CANCEL", settleDate:Date.now(),returns:0, remark:data.FormData1.Remark, calcelUser:operatoruserName})
                            let userAcc = {
                                "user_id":user._id,
                                "description": description,
                                "creditDebitamount" : debitCreditAmount,
                                "balance" : user.availableBalance + debitCreditAmount,
                                "date" : Date.now(),
                                "userName" : user.userName,
                                "role_type" : user.role_type,
                                "Remark":"-",
                                "stake": bets[bet].Stake,
                                "transactionId":`${bets[bet].transactionId}`,
                                "cacelMarketId":bets[bet].marketId,
                                "marketType":`${bets[bet].marketName}`,
                                "event":`${bets[bet].match}`,
                                "uniqueTransectionIDbyMARKETID":uniqueMarketId
                            }
                            let debitAmountForP = debitCreditAmount
                            let uplinePl = 0
                            for(let i = 1; i < user.parentUsers.length; i++){
                                let parentUser1 = await User.findById(user.parentUsers[i])
                                let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                                let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                                parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                                parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                                await User.findByIdAndUpdate(user.parentUsers[i - 1], {
                                    $inc: {
                                        downlineBalance: debitCreditAmount,
                                        myPL: -parentUser2Amount,
                                        pointsWL: debitCreditAmount
                                    }
                                });
                                await User.findByIdAndUpdate(user.parentUsers[i], {
                                    $inc : {
                                        uplinePL: -parseFloat(parentUser2Amount) + parseFloat(uplinePl),
                                    }
                                })
            
                                if(i === user.parentUsers.length-1 ){
                                    await User.findByIdAndUpdate(user.parentUsers[i], {
                                        $inc: {
                                            downlineBalance: debitCreditAmount,
                                            myPL: -parentUser1Amount,
                                            pointsWL: debitCreditAmount
                                        }
                                    });
                                }
                                uplinePl = parseFloat(uplinePl) - parseFloat(parentUser2Amount)
                            }
                                await accountStatementModel.create(userAcc);
                        }
                        await revockCommissionFromBetId(bets[bet])
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