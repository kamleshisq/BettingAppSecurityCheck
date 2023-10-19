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

module.exports = () => {
    cron.schedule('*/5 * * * *', async() => {
      console.log("Working")


//FOR FIND OPEN BET THAT ARE ALLOWED TO SETTLE AUTOMETIC


        const openBets = await betModel.aggregate([
            {
                $match: {
                    status: 'OPEN'
                }
            },
            {
                $addFields: {
                  userIdObjectId: { $toObjectId: '$userId' } 
                }
            },
            {
                $lookup: {
                  from: 'users',
                  localField: 'userIdObjectId',
                  foreignField: '_id',
                  as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $lookup: {
                  from: 'statementmodels',
                  let: { parentUserIds: '$user.parentUsers' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $in: ['$userId', '$$parentUserIds'] 
                        }
                      }
                    }
                  ],
                  as: 'settlement'
                }
            },
            {
              $match: {
                  $expr: {
                      $eq: [
                          { $size: "$settlement" },
                          {
                              $size: {
                                  $filter: {
                                      input: "$settlement",
                                      as: "settlementStatus",
                                      cond: { $eq: ["$$settlementStatus.status", true] } 
                                  }
                              }
                          }
                      ]
                  }
              }
          }
        ])

// COMMEN MARKET ID FOR CALL API
        const marketIds = [...new Set(openBets.map(item => item.marketId))];

//CALL API FOR RESULTS
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

//IF RESULT IS NOT EMPTY THAN PROCEED 
        if(result.data.length != 0){
            marketIds.forEach(async(marketIds) => {
//FIND THE RESULT OF THAT PERTICULAR MARKET ID 
                let marketresult = result.data.find(item => item.mid === marketIds)
                if(marketresult === undefined){
                    return
                }

//FIND ALL BETS TAHT ARE BELOPNG TO THAT PERTICULAR MARKETS
                let betsWithMarketId = await betModel.find({status:"OPEN", marketId : marketresult.mid});
                betsWithMarketId.forEach(async(entry) => { 

//IF BET IS FOR MATCH ODDS OR BOOKMAKER
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
                            // exposure = parseFloat(entry.Stake)
                            bet = await betModel.findByIdAndUpdate(entry._id,{status:"WON", returns:debitCreditAmount, result:marketresult.result})
                            user = await userModel.findByIdAndUpdate(entry.userId,{$inc:{availableBalance: debitCreditAmount, myPL: debitCreditAmount, Won:1, exposure:-parseFloat(entry.Stake), uplinePL:-debitCreditAmount, pointsWL:debitCreditAmount}})
                        }else{
                            bet = await betModel.findByIdAndUpdate(entry._id,{status:"WON", returns:parseFloat(entry.Stake), result:marketresult.result})
                            if(entry.marketName.toLowerCase().startsWith('match')){
                                debitCreditAmount = (parseFloat(entry.Stake)) 
                                // exposure = (parseFloat(entry.Stake * entry.oddValue) - parseFloat(entry.Stake)).toFixed(2)
                            }else{
                                debitCreditAmount = parseFloat(entry.Stake) 
                                // exposure = (parseFloat(entry.Stake * entry.oddValue) / 100 ).toFixed(2)
                            }
                            user = await userModel.findByIdAndUpdate(entry.userId,{$inc:{availableBalance: debitCreditAmount, myPL: debitCreditAmount, Won:1, exposure:-exposure, uplinePL:-debitCreditAmount, pointsWL:debitCreditAmount}})
                        }
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




//FOR MATCH ODDS COMMISSION
                        let usercommissiondata;
                        let commissionMarket = await commissionMarketModel.find()
                        if(commissionMarket.some(item => item.marketId == bet.marketId)){
                        try{
                            let commission = await commissionModel.find({userId:user.id})
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
                                    parentIdArray:user.parentUsers
                                }
                                usercommissiondata = await newCommissionModel.create(commissiondata)
                            }
                            }catch(err){
                                console.log(err)
                            }

                            try{
                                for(let i = user.parentUsers.length - 1; i >= 1; i--){
                                    let childUser = await userModel.findById(user.parentUsers[i])
                                    let parentUser = await userModel.findById(user.parentUsers[i - 1])
                                    let commissionChild = await commissionModel.find({userId:childUser.id})
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
                                        }
                                        let commissionData = await newCommissionModel.create(commissiondata)
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
                        let bet = await betModel.findByIdAndUpdate(entry._id,{status:"WON", returns:debitCreditAmount, result:marketresult.result})
                        let user = await userModel.findByIdAndUpdate(entry.userId,{$inc:{availableBalance: debitCreditAmount, myPL: debitCreditAmount, Won:1, exposure:-parseFloat(exposure), uplinePL:-debitCreditAmount, pointsWL:debitCreditAmount}})
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
                        // console.log((entry.selectionName.split('@')[1]))
                        // console.log((marketresult.result))
                        // console.log((entry.bettype2 == 'BACK'))
                        // console.log((entry.selectionName.split('@')[1] <=  marketresult.result && entry.bettype2 == 'BACK'))
                        let creditDebitamount 
                        let exposure = entry.exposure
                        if(entry.bettype2 == "BACK"){
                            creditDebitamount = (entry.Stake * entry.oddValue)/100
                        }else{
                            creditDebitamount = entry.Stake
                        }
                        let bet = await betModel.findByIdAndUpdate(entry._id,{status:"WON", returns:creditDebitamount, result:marketresult.result})
                        let user = await userModel.findByIdAndUpdate(entry.userId,{$inc:{availableBalance: creditDebitamount, myPL: creditDebitamount, Won:1, exposure:-parseFloat(exposure), uplinePL:-creditDebitamount, pointsWL:creditDebitamount}})
                        let description = `Bet for ${bet.match}/stake = ${bet.Stake}/WON`

                        let debitAmountForP = creditDebitamount
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
                            "creditDebitamount" : exposure,
                            "balance" : user.availableBalance + exposure,
                            "date" : Date.now(),
                            "userName" : user.userName,
                            "role_type" : user.role_type,
                            "Remark":"-",
                            "stake": bet.Stake,
                            "transactionId":`${bet.transactionId}`
                          })
                        // if(entry.bettype2 == 'BACK'){
                        //     if(entry.marketName.toLowerCase().startsWith('match')){
                        //         exposure = parseFloat(entry.Stake)
                        //     }else{
                        //         exposure = parseFloat(entry.Stake)
                        //     }
                        //     user = await userModel.findByIdAndUpdate(entry.userId,{$inc:{Loss:1, exposure:-exposure, result:marketresult.result}})
                        // }else{


                        //     if(entry.marketName.toLowerCase().startsWith('match')){
                        //         exposure = (parseFloat(entry.Stake * entry.oddValue) - parseFloat(entry.Stake)).toFixed(2)
                        //     }else{
                        //         exposure = parseFloat(entry.Stake * entry.oddValue/100).toFixed(2)
                        //     }
                        //     // exposure = (parseFloat(entry.Stake * entry.oddValue) - parseFloat(entry.Stake)).toFixed(2)
                        //     user = await userModel.findByIdAndUpdate(entry.userId,{$inc:{Loss:1, exposure:-exposure, result:marketresult.result}})
                        // }



//COMMISSION FOR ENTRY WISE LOOSING BETS
                        let commissionMarket = await commissionMarketModel.find()
                        let usercommissiondata2
                        if(commissionMarket.some(item => item.marketId == bet.marketId)){
                            try{
                                let commission = await commissionModel.find({userId:user.id})
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
                                        parentIdArray:user.parentUsers
                                    }
                                    usercommissiondata2 = await newCommissionModel.create(commissiondata)
                                }
                                }catch(err){
                                    console.log(err)
                                } 
                                try{
                                    for(let i = user.parentUsers.length - 1; i >= 1; i--){
                                        let childUser = await userModel.findById(user.parentUsers[i])
                                        let parentUser = await userModel.findById(user.parentUsers[i - 1])
                                        let commissionChild = await commissionModel.find({userId:childUser.id})
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
                                            }
                                            let commissionData = await newCommissionModel.create(commissiondata)
                                        }
                                    }
                                }catch(err){
                                    console.log(err)
                                }
                        }

                    }
                })
                //for runnerDataDELETE
                await runnerDataModel.findOneAndDelete({marketId:marketresult.mid})

                //NET LOSING COMMISSION

                console.log('net losing commission start ....')
                let commissionMarket = await commissionMarketModel.find()
                let usercommissiondata3
                if(commissionMarket.some(item => (item.marketId == marketresult.mid))){
                    let filterUser = await commissionModel.find({"Bookmaker.type":'NET_LOSS'})
                    let newfilterUser = filterUser.map(ele => {
                        return ele.userId
                    })

                    console.log(newfilterUser,"==>newfilterUser")

                    let netLossingCommission = await betModel.aggregate([
                        {
                            $match:{
                                marketName : { $regex: /^book/i},
                                status:{$in:['WON','LOSS']},
                                marketId:marketresult.mid,
                                userId:{$in:newfilterUser},
                                commissionStatus:false
                            }
                        },
                        {
                            $group:{
                                _id:'$userName',
                                returns:{$sum:{$cond:[{$in:['$status',['LOSS']]},'$returns',{"$subtract": [ "$returns", "$Stake" ]}]}},
                                userId:{$first:'$userId'},
                                eventId:{$first:'$eventId'},
                                gameId:{$first:'$gameId'},
                                event:{$first:'$event'},
                                marketId:{$first:'$marketId'},
                                match:{$first:'$match'},
                                eventDate:{$first:'$eventDate'},
                                marketName:{$first:'$marketName'}


                            }
                        }
                    ])

                    console.log(netLossingCommission,'netlossingcommission test')
                    
                    for(let i = 0;i<netLossingCommission.length;i++) {
                        let user = await userModel.findById(netLossingCommission[i].userId)
                        try{
                                let commission = await commissionModel.find({userId:netLossingCommission[i].userId})
                                let commissionPer = 0
                                if (commission[0].Bookmaker.type == "NET_LOSS" && commission[0].Bookmaker.status){
                                    commissionPer = commission[0].Bookmaker.percentage
                                }
                                let commissionCoin = ((commissionPer * netLossingCommission[i].returns)/100).toFixed(4)
                                if(commissionPer > 0 && commissionCoin < 0){
                                    let commissiondata = {
                                        userName : user.userName,
                                        userId : user._id,
                                        eventId : netLossingCommission[i].eventId,
                                        sportId : netLossingCommission[i].gameId,
                                        seriesName : netLossingCommission[i].event,
                                        marketId : netLossingCommission[i].marketId,
                                        eventDate : new Date(netLossingCommission[i].eventDate),
                                        eventName : netLossingCommission[i].match,
                                        commission : commissionCoin * -1,
                                        upline : 100,
                                        commissionType: 'Net Losing Commission',
                                        commissionPercentage:commissionPer,
                                        date:Date.now(),
                                        marketName:netLossingCommission[i].marketName,
                                        loginUserId:user._id,
                                        parentIdArray:user.parentUsers
                                    }
                                    usercommissiondata3 = await newCommissionModel.create(commissiondata)
                                }
                        }catch(err){
                            console.log(err)
                        }

                        try{
                            for(let j = user.parentUsers.length - 1; j >= 1; j--){
                                let childUser = await userModel.findById(user.parentUsers[j])
                                let parentUser = await userModel.findById(user.parentUsers[j - 1])
                                let commissionChild = await commissionModel.find({userId:childUser.id})
                                let commissionPer = 0
                                if (commissionChild[0].Bookmaker.type == "NET_LOSS" && commissionChild[0].Bookmaker.status){
                                    commissionPer = commissionChild[0].Bookmaker.percentage
                                }
                                let commissionCoin = ((commissionPer * netLossingCommission[i].returns)/100).toFixed(4)
                                if(commissionPer > 0 && commissionCoin < 0){
                                    let commissiondata = {
                                        userName : childUser.userName,
                                        userId : childUser.id,
                                        eventId : netLossingCommission[i].eventId,
                                        sportId : netLossingCommission[i].gameId,
                                        seriesName : netLossingCommission[i].event,
                                        marketId : netLossingCommission[i].marketId,
                                        eventDate : new Date(netLossingCommission[i].eventDate),
                                        eventName : netLossingCommission[i].match,
                                        commission : commissionCoin * -1,
                                        upline : 100,
                                        commissionType: 'Net Losing Commission',
                                        commissionPercentage:commissionPer,
                                        date:Date.now(),
                                        marketName:netLossingCommission[i].marketName,
                                        uniqueId:usercommissiondata3._id,
                                        loginUserId:usercommissiondata3.userId,
                                        parentIdArray:childUser.parentUsers,
                                    }
                                    let commissionData = await newCommissionModel.create(commissiondata)
                                }
                            }
                        }catch(err){
                            console.log(err)
                        }
                    }
                    await betModel.updateMany({
                        marketName : { $regex: /^book/i},
                        status:{$in:['WON','LOSS']},
                        marketId:marketresult.mid,
                        userId:{$in:newfilterUser},
                        commissionStatus:false
                    },{commissionStatus:true})
                }

            });

            
      

            
        }
    })


}