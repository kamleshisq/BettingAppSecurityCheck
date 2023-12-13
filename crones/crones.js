const cron = require('node-cron');
const betModel = require('../model/betmodel');
const accModel = require('../model/accountStatementByUserModel');
const userModel = require("../model/userModel");
const commissionRepportModel = require("../model/commissionReport");
const netCommission = require("../model/netCommissionModel");
const commissionModel = require("../model/CommissionModel");
const commissionMarketModel = require("../model/CommissionMarketsModel");
const newCommissionModel = require('../model/commissioNNModel');
const Decimal = require('decimal.js');
const runnerDataModel = require('../model/runnersData');
const autoSettleCheck = require('../model/sattlementModel');
const commitssionData = require('../utils/createNetLoosingCommission');

module.exports = () => {
    cron.schedule('*/5 * * * *', async() => {
        console.log("Working")
        let check = await autoSettleCheck.findOne({userName: 'admin'})
        if(check && check.status){
        let marketIds = await betModel.distinct('marketId', {status: 'OPEN'})

        const fullUrl = 'https://admin-api.dreamexch9.com/api/dream/markets/result';
        let result;
        await fetch(fullUrl, {
            method:'POST',
            headers: { 
                'Content-Type': 'application/json',
                'accept': 'application/json'
                },
            body:JSON.stringify(marketIds)
        }).then(res =>res.json())
        .then(data => {
            result = data
        })
        console.log(result.data)
        if(result.data.length != 0){
            marketIds.forEach(async(marketIds) => {
                let marketresult = result.data.find(item => item.mid === marketIds)
                if(marketresult === undefined){
                    return
                }
                let betsWithMarketId = await betModel.find({status:"OPEN", marketId : marketresult.mid});
                betsWithMarketId.forEach(async(entry) => { 
                    if((entry.selectionName ==  marketresult.result && entry.bettype2 == 'BACK') || (entry.selectionName != marketresult.result && entry.bettype2 == "LAY")){
                        let bet
                        let user
                        let debitCreditAmount 
                        let exposure = entry.exposure
                        if(entry.bettype2 == 'BACK'){
                            if(entry.marketName.toLowerCase().startsWith('match') || entry.marketName.toLowerCase().startsWith('winne')){
                                debitCreditAmount = parseFloat(entry.Stake * entry.oddValue).toFixed(2) - parseFloat(entry.Stake)
                            }else{
                                debitCreditAmount = (parseFloat(entry.Stake * entry.oddValue/100).toFixed(2))
                            }
                        }else{
                            debitCreditAmount = (parseFloat(entry.Stake))
                        }
                        bet = await betModel.findByIdAndUpdate(entry._id,{status:"WON", returns:debitCreditAmount, result:marketresult.result})
                        user = await userModel.findByIdAndUpdate(entry.userId,{$inc:{availableBalance: debitCreditAmount, myPL: debitCreditAmount, Won:1, exposure:-parseFloat(entry.Stake), uplinePL:-debitCreditAmount, pointsWL:debitCreditAmount}})
                        let description = `Bet for ${bet.match}/stake = ${bet.Stake}/WON`
                        let debitAmountForP = debitCreditAmount
                        for(let i = user.parentUsers.length - 1; i >= 1; i--){
                            let parentUser1 = await userModel.findById(user.parentUsers[i])
                            let parentUser2 = await userModel.findById(user.parentUsers[i - 1])
                            let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                            let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                            parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                            parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                            await userModel.findByIdAndUpdate(user.parentUsers[i], {
                                $inc: {
                                    downlineBalance: debitCreditAmount,
                                    myPL: -parentUser1Amount,
                                    uplinePL: -parentUser2Amount,
                                    lifetimePL: -parentUser1Amount,
                                    pointsWL: debitCreditAmount
                                }
                            });
                        
                            if (i === 1) {
                                await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                                    $inc: {
                                        downlineBalance: debitCreditAmount,
                                        myPL: -parentUser2Amount,
                                        lifetimePL: -parentUser2Amount,
                                        pointsWL: debitCreditAmount
                                    }
                                });
                            }
                            debitAmountForP = parentUser2Amount
                        }

                        await accModel.create({
                            "user_id":user._id,
                            "description": description,
                            "creditDebitamount" : parseFloat(debitCreditAmount),
                            "balance" : user.availableBalance + parseFloat(debitCreditAmount),
                            "date" : Date.now(),
                            "userName" : user.userName,
                            "role_type" : user.role_type,
                            "Remark":"-",
                            "stake": bet.Stake,
                            "transactionId":`${bet.transactionId}`
                          })

                        let usercommissiondata;
                        let commissionMarket = await commissionMarketModel.find()
                        if(commissionMarket.some(item => item.marketId == bet.marketId)){
                        try{
                            let commission = await commissionModel.find({userId:user.id})
                            if(commission && commission.length > 0){
                                let commissionPer = 0
                                if (bet.marketName.toLowerCase().startsWith('match') && commission[0].matchOdd.status){
                                    commissionPer = commission[0].matchOdd.percentage
                                }
                                let commissionCoin = ((commissionPer * bet.Stake)/100).toFixed(4)
                                if(commissionPer > 0){
                                    let commissiondata = {
                                        userName : user.userName,
                                        userId : user.id,
                                        eventId : bet.eventId,
                                        sportId : bet.gameId,
                                        seriesName : bet.event,
                                        marketId : bet.marketId,
                                        eventDate : new Date(bet.eventDate),
                                        eventName : bet.match,
                                        commission : commissionCoin,
                                        upline : 100,
                                        commissionType: 'Win Commission',
                                        commissionPercentage:commissionPer,
                                        marketName:bet.marketName,
                                        loginUserId:user._id,
                                        parentIdArray:user.parentUsers,
                                        date:Date.now()
                                    }
                                    usercommissiondata = await newCommissionModel.create(commissiondata)
                                }
                            }
                            }catch(err){
                                console.log(err)
                            }

                            try{
                                for(let i = user.parentUsers.length - 1; i >= 1; i--){
                                    let childUser = await userModel.findById(user.parentUsers[i])
                                    let parentUser = await userModel.findById(user.parentUsers[i - 1])
                                    let commissionChild = await commissionModel.find({userId:childUser.id})
                                    if(commissionChild && commissionChild.length > 0){
                                        let commissionPer = 0
                                        if (bet.marketName.toLowerCase().startsWith('match') && commissionChild[0].matchOdd.status){
                                            commissionPer = commissionChild[0].matchOdd.percentage
                                        }
                                        let commissionCoin = ((commissionPer * bet.Stake)/100).toFixed(4)
                                        if(commissionPer > 0){
                                            let commissiondata = {
                                                userName : childUser.userName,
                                                userId : childUser.id,
                                                eventId : bet.eventId,
                                                sportId : bet.gameId,
                                                seriesName : bet.event,
                                                marketId : bet.marketId,
                                                eventDate : new Date(bet.eventDate),
                                                eventName : bet.match,
                                                commission : commissionCoin,
                                                upline : 100,
                                                commissionType: 'Win Commission',
                                                commissionPercentage:commissionPer,
                                                marketName:bet.marketName,
                                                uniqueId:usercommissiondata._id,
                                                loginUserId:usercommissiondata.userId,
                                                parentIdArray:childUser.parentUsers,
                                                date:Date.now()
                                            }
                                            let commissionData = await newCommissionModel.create(commissiondata)
                                        }
                                    }
                                }
                            }catch(err){
                                console.log(err)
                            }
                        }
                    }else if((entry.secId === "odd_Even_No" && marketresult.result === "lay") || (entry.secId === "odd_Even_Yes" && marketresult.result === "back")) {
                        let debitCreditAmount 
                        let exposure = entry.exposure
                        if(entry.bettype2 == "BACK"){
                            debitCreditAmount = (entry.Stake * entry.oddValue)/100
                        }else{
                            debitCreditAmount = entry.Stake
                        }
                        let bet = await betModel.findByIdAndUpdate(entry._id,{status:"WON", returns:parseFloat(debitCreditAmount), result:marketresult.result})
                        let user = await userModel.findByIdAndUpdate(entry.userId,{$inc:{availableBalance: parseFloat(debitCreditAmount), myPL: parseFloat(debitCreditAmount), Won:1, exposure:-parseFloat(exposure), uplinePL:-parseFloat(debitCreditAmount), pointsWL:parseFloat(debitCreditAmount)}})
                        let description = `Bet for ${bet.match}/stake = ${bet.Stake}/WON`

                        let debitAmountForP = parse(debitCreditAmount)
                        for(let i = user.parentUsers.length - 1; i >= 1; i--){
                            let parentUser1 = await userModel.findById(user.parentUsers[i])
                            let parentUser2 = await userModel.findById(user.parentUsers[i - 1])
                            let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                            let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                            parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                            parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                            await userModel.findByIdAndUpdate(user.parentUsers[i], {
                                $inc: {
                                    downlineBalance: debitCreditAmount,
                                    myPL: -parentUser1Amount,
                                    uplinePL: -parentUser2Amount,
                                    lifetimePL: -parentUser1Amount,
                                    pointsWL: debitCreditAmount
                                }
                            });
                        
                            if (i === 1) {
                                await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                                    $inc: {
                                        downlineBalance: debitCreditAmount,
                                        myPL: -parentUser2Amount,
                                        lifetimePL: -parentUser2Amount,
                                        pointsWL: debitCreditAmount
                                    }
                                });
                            }
                            debitAmountForP = parentUser2Amount
                        }


                        await accModel.create({
                            "user_id":user._id,
                            "description": description,
                            "creditDebitamount" : debitCreditAmount,
                            "balance" : user.availableBalance + debitCreditAmount,
                            "date" : Date.now(),
                            "userName" : user.userName,
                            "role_type" : user.role_type,
                            "Remark":"-",
                            "stake": bet.Stake,
                            "transactionId":`${bet.transactionId}`
                        })
                    }else if (((entry.selectionName.split('@')[1] <=  marketresult.result) && entry.bettype2 == 'BACK') || ((entry.selectionName.split('@')[1] >= marketresult.result) && entry.bettype2 == "LAY")){
                        let creditDebitamount 
                        let exposure = entry.exposure
                        if(entry.bettype2 == "BACK"){
                            creditDebitamount = (entry.Stake * entry.oddValue)/100
                        }else{
                            creditDebitamount = entry.Stake
                        }
                        let bet = await betModel.findByIdAndUpdate(entry._id,{status:"WON", returns: parseFloat(creditDebitamount), result:marketresult.result})
                        let user = await userModel.findByIdAndUpdate(entry.userId,{$inc:{availableBalance:  parseFloat(creditDebitamount), myPL:  parseFloat(creditDebitamount), Won:1, exposure:-parseFloat(exposure), uplinePL:- parseFloat(creditDebitamount), pointsWL: parseFloat(creditDebitamount)}})

                        let debitAmountForP = parseFloat(creditDebitamount)
                        for(let i = user.parentUsers.length - 1; i >= 1; i--){
                            let parentUser1 = await userModel.findById(user.parentUsers[i])
                            let parentUser2 = await userModel.findById(user.parentUsers[i - 1])
                            let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                            let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                            parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                            parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                            await userModel.findByIdAndUpdate(user.parentUsers[i], {
                                $inc: {
                                    downlineBalance: creditDebitamount,
                                    myPL: -parentUser1Amount,
                                    uplinePL: -parentUser2Amount,
                                    lifetimePL: -parentUser1Amount,
                                    pointsWL: creditDebitamount
                                }
                            });
                        
                            if (i === 1) {
                                await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                                    $inc: {
                                        downlineBalance: creditDebitamount,
                                        myPL: -parentUser2Amount,
                                        lifetimePL: -parentUser2Amount,
                                        pointsWL: creditDebitamount
                                    }
                                });
                            }
                            debitAmountForP = parentUser2Amount
                        }
                        await accModel.create({
                            "user_id":user._id,
                            "description": description,
                            "creditDebitamount" : creditDebitamount,
                            "balance" : user.availableBalance + creditDebitamount,
                            "date" : Date.now(),
                            "userName" : user.userName,
                            "role_type" : user.role_type,
                            "Remark":"-",
                            "stake": bet.Stake,
                            "transactionId":`${bet.transactionId}`
                          })
                    }else{
                        let bet = await betModel.findByIdAndUpdate(entry._id,{status:"LOSS", result:marketresult.result})
                        let user 
                        let exposure = entry.exposure
                        user = await userModel.findByIdAndUpdate(entry.userId, {$inc:{Loss:1, exposure:-exposure, availableBalance: -exposure, myPL:-exposure, uplinePL:exposure, pointsWL:-exposure}})
                        let description = `Bet for ${bet.match}/stake = ${bet.Stake}/LOSS`
                        let debitAmountForP = -exposure
                        for(let i = user.parentUsers.length - 1; i >= 1; i--){
                            let parentUser1 = await userModel.findById(user.parentUsers[i])
                            let parentUser2 = await userModel.findById(user.parentUsers[i - 1])
                            let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                            let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                            parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                            parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                            await userModel.findByIdAndUpdate(user.parentUsers[i], {
                                $inc: {
                                    downlineBalance: -exposure,
                                    myPL: parentUser1Amount,
                                    uplinePL: parentUser2Amount,
                                    lifetimePL: parentUser1Amount,
                                    pointsWL: -exposure
                                }
                            });
                        
                            if (i === 1) {
                                await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                                    $inc: {
                                        downlineBalance: -exposure,
                                        myPL: parentUser2Amount,
                                        lifetimePL: parentUser2Amount,
                                        pointsWL: -exposure
                                    }
                                });
                            }
                            debitAmountForP = parentUser2Amount
                        }
                        await accModel.create({
                            "user_id":user._id,
                            "description": description,
                            "creditDebitamount" : -exposure,
                            "balance" : user.availableBalance - exposure,
                            "date" : Date.now(),
                            "userName" : user.userName,
                            "role_type" : user.role_type,
                            "Remark":"-",
                            "stake": bet.Stake,
                            "transactionId":`${bet.transactionId}`
                          })

                          let commissionMarket = await commissionMarketModel.find()
                        let usercommissiondata2
                        if(commissionMarket.some(item => item.marketId == bet.marketId)){
                            try{
                                let commission = await commissionModel.find({userId:user.id})
                                if(commission.length > 0){
                                    let commissionPer = 0
                                    if ((bet.marketName.toLowerCase().startsWith('book') || bet.marketName.toLowerCase().startsWith('toss')) && commission[0].Bookmaker.type == "ENTRY_LOSS_" && commission[0].Bookmaker.status){
                                        commissionPer = commission[0].Bookmaker.percentage
                                    }
                                    let commissionCoin = ((commissionPer * bet.Stake)/100).toFixed(4)
                                    if(commissionPer > 0){
                                        let commissiondata = {
                                            userName : user.userName,
                                            userId : user.id,
                                            eventId : bet.eventId,
                                            sportId : bet.gameId,
                                            seriesName : bet.event,
                                            marketId : bet.marketId,
                                            eventDate : new Date(bet.eventDate),
                                            eventName : bet.match,
                                            commission : commissionCoin,
                                            upline : 100,
                                            commissionType: 'Entry Loss Wise Commission',
                                            commissionPercentage:commissionPer,
                                            date:Date.now(),
                                            marketName:bet.marketName,
                                            loginUserId:user._id,
                                            parentIdArray:user.parentUsers,
                                            date:Date.now()
                                        }
                                        usercommissiondata2 = await newCommissionModel.create(commissiondata)
                                    }
                                }
                                }catch(err){
                                    console.log(err)
                                } 
                                try{
                                    for(let i = user.parentUsers.length - 1; i >= 1; i--){
                                        let childUser = await userModel.findById(user.parentUsers[i])
                                        let parentUser = await userModel.findById(user.parentUsers[i - 1])
                                        let commissionChild = await commissionModel.find({userId:childUser.id})
                                        if(commissionChild.length > 0){

                                            let commissionPer = 0
                                            if ((bet.marketName.toLowerCase().startsWith('book') || bet.marketName.toLowerCase().startsWith('toss')) && commissionChild[0].Bookmaker.type == "ENTRY_LOSS_" && commissionChild[0].Bookmaker.status){
                                            commissionPer = commissionChild[0].Bookmaker.percentage
                                            }
                                            let commissionCoin = ((commissionPer * bet.Stake)/100).toFixed(4)
                                            if(commissionPer > 0){
                                                let commissiondata = {
                                                    userName : childUser.userName,
                                                    userId : childUser.id,
                                                    eventId : bet.eventId,
                                                    sportId : bet.gameId,
                                                    seriesName : bet.event,
                                                    marketId : bet.marketId,
                                                    eventDate : new Date(bet.eventDate),
                                                    eventName : bet.match,
                                                    commission : commissionCoin,
                                                    upline : 100,
                                                    commissionType: 'Entry Loss Wise Commission',
                                                    commissionPercentage:commissionPer,
                                                    date:Date.now(),
                                                    marketName:bet.marketName,
                                                    uniqueId:usercommissiondata2._id,
                                                    loginUserId:usercommissiondata2.userId,
                                                    parentIdArray:childUser.parentUsers,
                                                    date:Date.now()
                                                }
                                                let commissionData = await newCommissionModel.create(commissiondata)
                                            }
                                        }
                                    }
                                }catch(err){
                                    console.log(err)
                                }
                        }
                    }



                    //for entry wise commission 


                    try{
                        // console.log("COMMISSION MARKET")
                        let usercommissiondata;
                        let commissionMarket = await commissionMarketModel.find()
                        if(commissionMarket.some(item => item.marketId == betsWithMarketId.marketId)){
                            let commission = await commissionModel.find({userId:user.id})
                            let user = await userModel.findById(betsWithMarketId.userId)
                            if(commission.length > 0){
                            // console.log(commission, 456)
                            let commissionPer = 0
                            if ((betsWithMarketId.marketName.toLowerCase().startsWith('book')|| betsWithMarketId.marketName.toLowerCase().startsWith('toss')) && commission[0].Bookmaker.type == "ENTRY" && commission[0].Bookmaker.status){
                              commissionPer = commission[0].Bookmaker.percentage
                            }else if (commission[0].fency.type == "ENTRY" && !(betsWithMarketId.marketName.toLowerCase().startsWith('book')|| betsWithMarketId.marketName.toLowerCase().startsWith('toss') || betsWithMarketId.marketName.toLowerCase().startsWith('match')) && commission[0].fency.status){
                              commissionPer = commission[0].fency.percentage
                            }
                            let commissionCoin = ((commissionPer * betsWithMarketId.Stake)/100).toFixed(4)
                            // console.log(commissionCoin, commissionPer, "commissionPercommissionPercommissionPercommissionPer")
                            if(commissionPer > 0){
                                let commissiondata = {
                                    userName : user.userName,
                                    userId : user.id,
                                    eventId : betsWithMarketId.eventId,
                                    sportId : betsWithMarketId.gameId,
                                    seriesName : betsWithMarketId.event,
                                    marketId : betsWithMarketId.marketId,
                                    eventDate : new Date(betsWithMarketId.date),
                                    eventName : betsWithMarketId.match,
                                    commission : commissionCoin,
                                    upline : 100,
                                    commissionType: 'Entry Wise Commission',
                                    commissionPercentage:commissionPer,
                                    date:Date.now(),
                                    marketName:betsWithMarketId.marketName,
                                    loginUserId:user.id,
                                    parentIdArray:user.parentUsers
                                    
                                }
                                usercommissiondata = await newCommissionModel.create(commissiondata)
                            }}
                        
                            try{
                                for(let i = user.parentUsers.length - 1; i >= 1; i--){
                                    let childUser = await userModel.findById(user.parentUsers[i])
                                    let parentUser = await userModel.findById(user.parentUsers[i - 1])
                                    let commissionChild = await commissionModel.find({userId:childUser.id})
                                    if(commissionChild.length > 0){
                                    let commissionPer = 0
                                    if ((betsWithMarketId.marketName.toLowerCase().startsWith('book')|| betsWithMarketId.marketName.toLowerCase().startsWith('toss')) && commissionChild[0].Bookmaker.type == "ENTRY" && commissionChild[0].Bookmaker.status){
                                      commissionPer = commissionChild[0].Bookmaker.percentage
                                    }else if (commissionChild[0].fency.type == "ENTRY" && !(betsWithMarketId.marketName.toLowerCase().startsWith('book')|| betsWithMarketId.marketName.toLowerCase().startsWith('toss') || betsWithMarketId.marketName.toLowerCase().startsWith('match')) && commissionChild[0].fency.status){
                                      commissionPer = commissionChild[0].fency.percentage
                    
                                    }
                                    
                                    let commissionCoin = ((commissionPer * betsWithMarketId.Stake)/100).toFixed(4)
                                    // console.log(commissionCoin, commissionPer, "commissionPercommissionPercommissionPercommissionPer")
                                    if(commissionPer > 0){
                                        let commissiondata = {
                                            userName : childUser.userName,
                                            userId : childUser.id,
                                            eventId : betsWithMarketId.eventId,
                                            sportId : betsWithMarketId.gameId,
                                            seriesName : betsWithMarketId.event,
                                            marketId : betsWithMarketId.marketId,
                                            eventDate : new Date(betsWithMarketId.date),
                                            eventName : betsWithMarketId.match,
                                            commission : commissionCoin,
                                            upline : 100,
                                            commissionType: 'Entry Wise Commission',
                                            commissionPercentage:commissionPer,
                                            date:Date.now(),
                                            marketName:betsWithMarketId.marketName,
                                            loginUserId:user.id,
                                            parentIdArray:childUser.parentUsers,
                                            uniqueId:usercommissiondata._id
                                        }
                                        let commissionData = await newCommissionModel.create(commissiondata)
                                    }}
                                }
                            }catch(err){
                                console.log(err)
                            }
                        }
                    }catch(err){
                        console.log(err)
                    }
                })
                let data12 = {
                    marketId : betsWithMarketId.marketId,
                    match : betsWithMarketId.match
                }
                commitssionData(data12)
            })
        }
        }
    })
}