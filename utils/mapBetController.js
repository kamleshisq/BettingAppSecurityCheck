const userModel = require('../model/userModel');
const accModel = require('../model/accountStatementByUserModel');
const betModel = require('../model/betmodel');
const commissionModel = require('../model/CommissionModel');
const commissionMarketModel = require('../model/CommissionMarketsModel');
const settlementHistory = require('../model/settelementHistory');
const InprogressModel = require('../model/InprogressModel');
const newCommissionModel = require('../model/commissioNNModel');
const Decimal = require('decimal.js');
const runnerDataModel = require("../model/runnersData");
const commitssionData = require('./createNetLoosingCommission');
const uuid = require('uuid');
const { use } = require('../app');

async function mapBet(data){
    // console.log(data, "datadatadata1234564879")
    let childrenUsername = []
    let operatorId;
    if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
        childrenUsername = await userModel.distinct('userName', {parentUsers:data.LOGINDATA.LOGINUSER.parent_id});
        operatorId = data.LOGINDATA.LOGINUSER.parent_id
      }else{
        childrenUsername = await userModel.distinct('userName', {parentUsers:data.LOGINDATA.LOGINUSER._id});
        operatorId = data.LOGINDATA.LOGINUSER._id
      }

      let bets = await betModel.aggregate([
        {
            $match:{
                marketId:`${data.id}`,
                status:"MAP",
                userName:{$in:childrenUsername}
            }
        },
      ])

// FOR DUMMY TABLE
    let InProgress = await InprogressModel.findOne({marketId : bets[0].marketId, progressType:'SettleMent'})
    if(InProgress === null){
        try{

            let inprogressData = {
              eventId : bets[0].eventId,
              marketId: bets[0].marketId,
              length: bets.length,
              marketName: bets[0].marketName,
              progressType:'SettleMent'
            }
            InProgress = await InprogressModel.create(inprogressData)
        }catch(err){
            console.log(err)
        }
    }


    //FOR SATTLEMENT HISTORY



    let dataForHistory = {
        marketID:`${data.id}`,
        userId:`${operatorId}`,
        eventName: `${bets[0].match}`,
        date:Date.now(),
        result:data.result,
        marketName : `${bets[0].marketName}`
      }
      await settlementHistory.create(dataForHistory)
      function generateUniqueIdByMARKETID() {
        const timestamp = new Date().getTime();
        const uniqueId = data.id + '-' + timestamp + '-' + uuid.v4();
        return uniqueId
      }
      let uniqueMarketId = generateUniqueIdByMARKETID()

      try{ 
        for(const bet in bets){ 
            function generateUniqueId() {
                const timestamp = bets[bet].marketId;
                const randomString = bets[bet].userName;
                return `${timestamp}-${randomString}`;
              }
            let uniqueId = generateUniqueId()
            // console.log(bets[bet].id,bets[bet]._id , "ABDCDCDC")
            // FOR ENTRY WISE COMMISSION
            bets[bet].id = bets[bet]._id.toString();
            // console.log(bets[bet].id,bets[bet]._id , "ABDCDCDC")

            













            // console.log(bet, "betbetbet")
            // console.log(bets[bet].selectionName.split('@')[1], data.result, bets[bet].bettype2, (bets[bet].selectionName.split('@')[1] <=  data.result) && bets[bet].bettype2 == 'BACK', ((bets[bet].selectionName.split('@')[1] >= data.result) && bets[bet].bettype2 == "LAY"), "hjgjhgjhgjghghghghghghghghghghghgh")

            // console.log((bets[bet].selectionName.toLowerCase() === data.result.toLowerCase() && bets[bet].bettype2 == 'BACK'), (bets[bet].selectionName.toLowerCase() !== data.result.toLowerCase() && bets[bet].bettype2 == 'LAY'))
            console.log( bets[bet].selectionName.split('@')[1] ,data.result, bets[bet].bettype2, parseInt(bets[bet].selectionName.split('@')[1], 10) <=  parseInt(data.result, 10) , bets[bet].bettype2 == 'BACK')
            if((bets[bet].selectionName.toLowerCase() === data.result.toLowerCase() && bets[bet].bettype2 == 'BACK'&& bets[bet].secId !== "odd_Even_Yes") || (bets[bet].selectionName.toLowerCase() !== data.result.toLowerCase() && bets[bet].bettype2 == 'LAY' && bets[bet].secId !== "odd_Even_No")){
                // console.log("matchoddsLike")
                let debitCreditAmount;
                let exposure = bets[bet].exposure
                if(bets[bet].bettype2 == 'BACK'){
                    if(bets[bet].marketName.toLowerCase().startsWith('match') || bets[bet].marketName.toLowerCase().startsWith('winne')){
                      debitCreditAmount = parseFloat((bets[bet].Stake * bets[bet].oddValue).toFixed(2)) - bets[bet].Stake
                    }else{
                      debitCreditAmount = parseFloat(bets[bet].Stake * bets[bet].oddValue/100).toFixed(2)
                    }
                  }else{
                    if(bets[bet].marketName.toLowerCase().startsWith('match')){
                      debitCreditAmount = parseFloat(bets[bet].Stake).toFixed(2)
                    }else{
                      debitCreditAmount = parseFloat(bets[bet].Stake).toFixed(2)
                    }
                  }

                  let user = await userModel.findByIdAndUpdate(bets[bet].userId,{$inc:{availableBalance: parseFloat(debitCreditAmount), myPL: parseFloat(debitCreditAmount), Won:1,  uplinePL:-parseFloat(debitCreditAmount), pointsWL:parseFloat(debitCreditAmount)}})
                  let bet1 = await betModel.findByIdAndUpdate(bets[bet]._id,{status:"WON", returns:debitCreditAmount, result: data.result, settleDate: Date.now(), closingBalance:parseFloat(user.availableBalance) + parseFloat(debitCreditAmount)})
                let description = `Bet for ${bets[bet].match}/Result = ${data.result}/WON`

                let debitAmountForP = debitCreditAmount
                let uplinePl = 0
                for(let i = 1; i < user.parentUsers.length; i++){
                    let parentUser1 = await userModel.findById(user.parentUsers[i])
                    let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                    let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                    parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                    parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                    await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                        $inc: {
                            downlineBalance: debitCreditAmount,
                            myPL: -parentUser2Amount,
                            pointsWL: debitCreditAmount
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
                                downlineBalance: debitCreditAmount,
                                myPL: -parentUser1Amount,
                                pointsWL: debitCreditAmount
                            }
                        });
                    }
                    uplinePl = parseFloat(uplinePl) - parseFloat(parentUser2Amount)
                }


              await accModel.create({
                "user_id":user._id,
                "description": description,
                "creditDebitamount" : parseFloat(debitCreditAmount),
                "balance" : parseFloat(user.availableBalance) + parseFloat(debitCreditAmount),
                "date" : Date.now(),
                "userName" : user.userName,
                "role_type" : user.role_type,
                "Remark":"-",
                "stake": bets[bet].Stake,
                "transactionId":`${bets[bet].transactionId}`,
                "marketId":`${bets[bet].marketId}`,
                "event":`${bets[bet].match}`,
                "marketType":`${bets[bet].marketName}`,
                "uniqueTransectionIDbyMARKETID":uniqueMarketId
              })


              let commissionMarket = await commissionMarketModel.find()
              let usercommissiondata;
              
              if(commissionMarket.some(item => item.marketId == bets[bet].marketId)){ 
                try{
                    let commission = await commissionModel.find({userId:user.id})
                    // console.log(commission, "commissioncommissioncommissioncommission")
                    if(commission.length > 0){
                    let commissionPer = 0
                    if (bets[bet].marketName.toLowerCase().startsWith('match') && commission[0].matchOdd.status){
                        commissionPer = commission[0].matchOdd.percentage
                    }
                    // console.log(commissionPer, "commissionPercommissionPercommissionPer")
                    let commissionCoin = ((commissionPer * Math.abs(debitCreditAmount))/100).toFixed(4)
                    if(commissionPer > 0 && bets[bet].commionstatus){
                        let commissiondata = {
                            userName : user.userName,
                            userId : user.id,
                            eventId : bets[bet].eventId,
                            sportId : bets[bet].gameId,
                            seriesName : bets[bet].event,
                            marketId : bets[bet].marketId,
                            eventDate : new Date(bets[bet].eventDate),
                            eventName : bets[bet].match,
                            commission : commissionCoin,
                            upline : 100,
                            commissionType: 'Win Commission',
                            commissionPercentage:commissionPer,
                            marketName:bets[bet].marketName,
                            loginUserId:user.id,
                            parentIdArray:user.parentUsers,
                            date:Date.now(),
                            betId:bets[bet].id,
                            uniqueId
                        }
                        usercommissiondata = await newCommissionModel.create(commissiondata)
                        // uniqueID = usercommissiondata._id
                    }}
                    }catch(err){
                        console.log(err)
                    }

                    try{
                        for(let i = user.parentUsers.length - 1; i >= 1; i--){
                            let childUser = await userModel.findById(user.parentUsers[i])
                            let parentUser = await userModel.findById(user.parentUsers[i - 1])
                            let commissionChild = await commissionModel.find({userId:user.parentUsers[i]})
                            if(commissionChild.length > 0){
                            let commissionPer = 0
                            if (bets[bet].marketName.toLowerCase().startsWith('match') && commissionChild[0].matchOdd.status){
                                commissionPer = commissionChild[0].matchOdd.percentage
                            }
                            let commissionCoin = ((commissionPer * Math.abs(debitCreditAmount))/100).toFixed(4)
                            if(commissionPer > 0 && bets[bet].commionstatus){
                                let commissiondata = {
                                    userName : childUser.userName,
                                    userId : user.parentUsers[i],
                                    eventId : bets[bet].eventId,
                                    sportId : bets[bet].gameId,
                                    seriesName : bets[bet].event,
                                    marketId : bets[bet].marketId,
                                    eventDate : new Date(bets[bet].eventDate),
                                    eventName : bets[bet].match,
                                    commission : commissionCoin,
                                    upline : 100,
                                    commissionType: 'Win Commission',
                                    commissionPercentage:commissionPer,
                                    marketName:bets[bet].marketName,
                                    loginUserId:user.id,
                                    parentIdArray:childUser.parentUsers,
                                    uniqueId,
                                    date:Date.now(),
                                    betId:bets[bet].id
                                }
                                let commissionData = await newCommissionModel.create(commissiondata)
                            }}
                        }
                    }catch(err){
                        console.log(err)
                    }

              }

            }else if ((bets[bet].secId === "odd_Even_No" && data.result === "LAY") || (bets[bet].secId === "odd_Even_Yes" && data.result === "BACK")){
                let debitCreditAmount 
                console.log('HEREEEEE')
                let exposure = bets[bet].exposure
                if(bets[bet].bettype2 == "BACK"){
                    debitCreditAmount = (bets[bet].Stake * bets[bet].oddValue)/100
                }else{
                    debitCreditAmount = bets[bet].Stake
                }
                let user = await userModel.findByIdAndUpdate(bets[bet].userId,{$inc:{availableBalance: parseFloat(debitCreditAmount), myPL: parseFloat(debitCreditAmount), Won:1,  uplinePL:-parseFloat(debitCreditAmount), pointsWL:parseFloat(debitCreditAmount)}})
                let thatbet = await betModel.findByIdAndUpdate(bets[bet]._id,{status:"WON", returns:debitCreditAmount, result:data.result, settleDate:Date.now(), closingBalance: parseFloat(user.availableBalance) + parseFloat(debitCreditAmount)})
                let description = `Bet for ${bets[bet].match}/Result = ${data.result}/WON`

                let debitAmountForP = parseFloat(debitCreditAmount)
                let uplinePl = 0
                for(let i = 1; i < user.parentUsers.length; i++){
                    let parentUser1 = await userModel.findById(user.parentUsers[i])
                    let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                    let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                    parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                    parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                    await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                        $inc: {
                            downlineBalance: debitCreditAmount,
                            myPL: -parentUser2Amount,
                            pointsWL: debitCreditAmount
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
                                downlineBalance: debitCreditAmount,
                                myPL: -parentUser1Amount,
                                pointsWL: debitCreditAmount
                            }
                        });
                    }
                    uplinePl = parseFloat(uplinePl) - parseFloat(parentUser2Amount)
                }

                
                await accModel.create({
                  "user_id":user._id,
                  "description": description,
                  "creditDebitamount" : debitCreditAmount,
                  "balance" : parseFloat(user.availableBalance) + parseFloat(debitCreditAmount),
                  "date" : Date.now(),
                  "userName" : user.userName,
                  "role_type" : user.role_type,
                  "Remark":"-",
                  "stake": bets[bet].Stake,
                  "transactionId":`${bets[bet].transactionId}`,
                  "marketId":`${bets[bet].marketId}`,
                  "event":`${bets[bet].match}`,
                  "marketType":`${bets[bet].marketName}`,
                  "uniqueTransectionIDbyMARKETID":uniqueMarketId
                })
            }else if (((parseInt(bets[bet].selectionName.split('@')[1],10) <=  parseInt(data.result, 10)) && bets[bet].bettype2 == 'BACK') || ((parseInt(bets[bet].selectionName.split('@')[1],10) > parseInt(data.result, 10)) && bets[bet].bettype2 == "LAY")){
                console.log('FANCY') 
                let creditDebitamount 
                        let exposure = bets[bet].exposure
                        if(bets[bet].bettype2 == "BACK"){
                            creditDebitamount = (bets[bet].Stake * bets[bet].oddValue)/100
                        }else{
                            creditDebitamount = bets[bet].Stake
                        }
                        let user = await userModel.findByIdAndUpdate(bets[bet].userId,{$inc:{availableBalance: parseFloat(creditDebitamount), myPL: parseFloat(creditDebitamount), Won:1,  uplinePL:-parseFloat(creditDebitamount), pointsWL:parseFloat(creditDebitamount)}})
                        let thatbet = await betModel.findByIdAndUpdate(bets[bet]._id,{status:"WON", returns:creditDebitamount, result:data.result, closingBalance:parseFloat(user.availableBalance) + parseFloat(creditDebitamount), settleDate:Date.now()})
                        let description = `Bet for ${bets[bet].match}/Result = ${data.result}/WON`

                        let debitAmountForP = parseFloat(creditDebitamount)
                        let uplinePl = 0
                for(let i = 1; i < user.parentUsers.length; i++){
                    let parentUser1 = await userModel.findById(user.parentUsers[i])
                    let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                    let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                    parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                    parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                    await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                        $inc: {
                            downlineBalance: debitAmountForP,
                            myPL: -parentUser2Amount,
                            pointsWL: debitAmountForP
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
                                downlineBalance: debitAmountForP,
                                myPL: -parentUser1Amount,
                                pointsWL: debitAmountForP
                            }
                        });
                    }
                    uplinePl = parseFloat(uplinePl) - parseFloat(parentUser2Amount)
                }
                        
                        await accModel.create({
                          "user_id":user._id,
                          "description": description,
                          "creditDebitamount" : creditDebitamount,
                          "balance" : parseFloat(user.availableBalance) + parseFloat(creditDebitamount),
                          "date" : Date.now(),
                          "userName" : user.userName,
                          "role_type" : user.role_type,
                          "Remark":"-",
                          "stake": bets[bet].Stake,
                          "transactionId":`${bets[bet].transactionId}`,
                          "marketId":`${bets[bet].marketId}`,
                          "event":`${bets[bet].match}`,
                          "marketType":`${bets[bet].marketName}`,
                          "uniqueTransectionIDbyMARKETID":uniqueMarketId
                        })
            }else{
                console.log('LOOSE')
                let user 
                let exposure = bets[bet].exposure
                user = await userModel.findByIdAndUpdate(bets[bet].userId, {$inc:{Loss:1,  availableBalance: -parseFloat(exposure), myPL:-parseFloat(exposure), uplinePL:parseFloat(exposure), pointsWL:-parseFloat(exposure)}})
                let description = `Bet for ${bets[bet].match}/Result = ${data.result}/LOSS`
                let thatbet = await betModel.findByIdAndUpdate(bets[bet]._id,{status:"LOSS", result:data.result, settleDate:Date.now(),closingBalance:parseFloat(user.availableBalance) - parseFloat(exposure)})

                let debitAmountForP = exposure
                let uplinePl = 0
                for(let i = 1; i < user.parentUsers.length; i++){
                    let parentUser1 = await userModel.findById(user.parentUsers[i])
                    let parentUser1Amount = new Decimal(parentUser1.myShare).times(debitAmountForP).dividedBy(100)
                    let parentUser2Amount = new Decimal(parentUser1.Share).times(debitAmountForP).dividedBy(100);
                    parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
                    parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
                    await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                        $inc: {
                            downlineBalance: -exposure,
                            myPL: parentUser2Amount,
                            pointsWL: -exposure
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
                                downlineBalance: -exposure,
                                myPL: parentUser1Amount,
                                pointsWL: -exposure
                            }
                        });
                    }
                    uplinePl = parseFloat(uplinePl) + parseFloat(parentUser2Amount)
                }
                
                await accModel.create({
                    "user_id":user._id,
                    "description": description,
                    "creditDebitamount" : -exposure,
                    "balance" : parseFloat(user.availableBalance) - parseFloat(exposure),
                    "date" : Date.now(),
                    "userName" : user.userName,
                    "role_type" : user.role_type,
                    "Remark":"-",
                    "stake": bets[bet].Stake,
                    "transactionId":`${bets[bet].transactionId}`,
                    "marketId":`${bets[bet].marketId}`,
                    "event":`${bets[bet].match}`,
                    "marketType":`${bets[bet].marketName}`,
                    "uniqueTransectionIDbyMARKETID":uniqueMarketId
                })

                //EntryWise Loosing Commiission
                //COMMISSSION 
          if((bets[bet].marketName.toLowerCase().startsWith('book') || bets[bet].marketName.toLowerCase().startsWith('toss'))){
              let commissionMarket = await commissionMarketModel.find()
              let usercommissiondata;
              if(commissionMarket.some(item => item.marketId == bets[bet].marketId)){
                  try{
                      let commission = await commissionModel.find({userId:user.id})
                      if(commission.length > 0){
                      let commissionPer = 0
                    //   console.log(commission[0])
                    //   console.log(((bets[bet].marketName.toLowerCase().startsWith('book') || bets[bet].marketName.toLowerCase().startsWith('toss')) && commission[0].Bookmaker.type == "ENTRY_LOSS_" && commission[0].Bookmaker.status),bets[bet].marketName.toLowerCase().startsWith('book'),  commission[0].Bookmaker.type == "ENTRY_LOSS_")
                      if ((bets[bet].marketName.toLowerCase().startsWith('book') || bets[bet].marketName.toLowerCase().startsWith('toss')) && commission[0].Bookmaker.type == "ENTRY_LOSS_" && commission[0].Bookmaker.status){
                          commissionPer = commission[0].Bookmaker.percentage
                      }
                      let commissionCoin = ((commissionPer * Math.abs(exposure))/100).toFixed(4)
                    //   console.log(commissionCoin, commissionPer)
                      if(commissionPer > 0 && bets[bet].commionstatus){
                          let commissiondata = {
                              userName : user.userName,
                              userId : user.id,
                              eventId : bets[bet].eventId,
                              sportId : bets[bet].gameId,
                              seriesName : bets[bet].event,
                              marketId : bets[bet].marketId,
                              eventDate : new Date(bets[bet].eventDate),
                              eventName : bets[bet].match,
                              commission : commissionCoin,
                              upline : 100,
                              commissionType: 'Entry Loss Wise Commission',
                              commissionPercentage:commissionPer,
                              date:Date.now(),
                              marketName:bets[bet].marketName,
                              loginUserId:user.id,
                              parentIdArray:user.parentUsers,
                              betId:bets[bet].id,
                              uniqueId
                          }
                          usercommissiondata = await newCommissionModel.create(commissiondata)
                        //   uniqueID = usercommissiondata._id
                      }}
                      }catch(err){
                          console.log(err)
                      } 
                      try{
                          for(let i = user.parentUsers.length - 1; i >= 1; i--){
                              let childUser = await userModel.findById(user.parentUsers[i])
                              let parentUser = await userModel.findById(user.parentUsers[i - 1])
                              let commissionChild = await commissionModel.find({userId:user.parentUsers[i]})
                              console.log(commissionChild)
                              if(commissionChild.length > 0){
                              let commissionPer = 0
                              console.log(((bets[bet].marketName.toLowerCase().startsWith('book') || bets[bet].marketName.toLowerCase().startsWith('toss')) && commissionChild[0].Bookmaker.type == "ENTRY_LOSS_" && commissionChild[0].Bookmaker.status), commissionChild[0].Bookmaker.type == "ENTRY_LOSS_")
                              if ((bets[bet].marketName.toLowerCase().startsWith('book') || bets[bet].marketName.toLowerCase().startsWith('toss')) && commissionChild[0].Bookmaker.type == "ENTRY_LOSS_" && commissionChild[0].Bookmaker.status){
                              commissionPer = commissionChild[0].Bookmaker.percentage
                              }
                              let commissionCoin = ((commissionPer * Math.abs(exposure))/100).toFixed(4)
                              console.log(commissionCoin,commissionPer )
                              if(commissionPer > 0  && bets[bet].commionstatus){
                                  let commissiondata = {
                                      userName : childUser.userName,
                                      userId : user.parentUsers[i],
                                      eventId : bets[bet].eventId,
                                      sportId : bets[bet].gameId,
                                      seriesName : bets[bet].event,
                                      marketId : bets[bet].marketId,
                                      eventDate : new Date(bets[bet].eventDate),
                                      eventName : bets[bet].match,
                                      commission : commissionCoin,
                                      upline : 100,
                                      commissionType: 'Entry Loss Wise Commission',
                                      commissionPercentage:commissionPer,
                                      date:Date.now(),
                                      marketName:bets[bet].marketName,
                                      loginUserId:user.id,
                                      parentIdArray:childUser.parentUsers,
                                      uniqueId,
                                      betId:bets[bet].id
                                  }
                                  let commissionData = await newCommissionModel.create(commissiondata)
                              }}
                          }
                      }catch(err){
                          console.log(err)
                      }
              } 
          }



            }



            try{
                // console.log("COMMISSION MARKET")
                let usercommissiondata;
                let commissionMarket = await commissionMarketModel.find()
                if(commissionMarket.some(item => item.marketId == data.id)){
                    let thatBet = await betModel.findById(bets[bet]._id)
                    let commission = await commissionModel.find({userId:bets[bet].userId})
                    let user = await userModel.findById(bets[bet].userId)
                    if(commission.length > 0){
                    // console.log(commission, 456)
                    let commissionPer = 0
                    // console.log(((bets[bet].marketName.toLowerCase().startsWith('book')|| bets[bet].marketName.toLowerCase().startsWith('toss')) && commission[0].Bookmaker.type == "ENTRY" && commission[0].Bookmaker.status), bets[bet].marketName.toLowerCase().startsWith('book'), commission[0].Bookmaker.type == "ENTRY")
                    if ((bets[bet].marketName.toLowerCase().startsWith('book')|| bets[bet].marketName.toLowerCase().startsWith('toss')) && commission[0].Bookmaker.type == "ENTRY" && commission[0].Bookmaker.status){
                      commissionPer = commission[0].Bookmaker.percentage
                    //   console.log(commissionPer, "commissionPer")
                    }else if (commission[0].fency.type == "ENTRY" && !(bets[bet].marketName.toLowerCase().startsWith('book')|| bets[bet].marketName.toLowerCase().startsWith('toss') || bets[bet].marketName.toLowerCase().startsWith('match')) && commission[0].fency.status){
                      commissionPer = commission[0].fency.percentage
                    }
                    let commissionCoin = ((commissionPer * Math.abs(thatBet.returns))/100).toFixed(4)
                    // console.log(commissionCoin, commissionPer, "commissionPercommissionPercommissionPercommissionPer")
                    if(bets[bet].commionstatus){
                        // console.log('WORKING')
                        if(commissionPer > 0){
                            let commissiondata = {
                                userName : user.userName,
                                userId : user.id,
                                eventId : bets[bet].eventId,
                                sportId : bets[bet].gameId,
                                seriesName : bets[bet].event,
                                marketId : bets[bet].marketId,
                                eventDate : new Date(bets[bet].date),
                                eventName : bets[bet].match,
                                commission : commissionCoin,
                                upline : 100,
                                commissionType: 'Entry Wise Commission',
                                commissionPercentage:commissionPer,
                                date:Date.now(),
                                marketName:bets[bet].marketName,
                                loginUserId:user.id,
                                parentIdArray:user.parentUsers,
                                betId:bets[bet].id,
                                uniqueId
                                
                            }
                            usercommissiondata = await newCommissionModel.create(commissiondata)
                            // uniqueID = usercommissiondata._id
                        }}
                    }
                
                    try{
                        for(let i = user.parentUsers.length - 1; i >= 1; i--){
                            let childUser = await userModel.findById(user.parentUsers[i])
                            let parentUser = await userModel.findById(user.parentUsers[i - 1])
                            let commissionChild = await commissionModel.find({userId:user.parentUsers[i]})
                            if(commissionChild.length > 0){
                            let commissionPer = 0
                            if ((bets[bet].marketName.toLowerCase().startsWith('book')|| bets[bet].marketName.toLowerCase().startsWith('toss')) && commissionChild[0].Bookmaker.type == "ENTRY" && commissionChild[0].Bookmaker.status){
                              commissionPer = commissionChild[0].Bookmaker.percentage
                            }else if (commissionChild[0].fency.type == "ENTRY" && !(bets[bet].marketName.toLowerCase().startsWith('book')|| bets[bet].marketName.toLowerCase().startsWith('toss') || bets[bet].marketName.toLowerCase().startsWith('match')) && commissionChild[0].fency.status){
                              commissionPer = commissionChild[0].fency.percentage
            
                            }
                            
                            let commissionCoin = ((commissionPer * Math.abs(thatBet.returns))/100).toFixed(4)
                            // console.log(commissionCoin, commissionPer, "commissionPercommissionPercommissionPercommissionPer")
                            if(commissionPer > 0  && bets[bet].commionstatus){
                                let commissiondata = {
                                    userName : childUser.userName,
                                    userId : user.parentUsers[i],
                                    eventId : bets[bet].eventId,
                                    sportId : bets[bet].gameId,
                                    seriesName : bets[bet].event,
                                    marketId : bets[bet].marketId,
                                    eventDate : new Date(bets[bet].date),
                                    eventName : bets[bet].match,
                                    commission : commissionCoin,
                                    upline : 100,
                                    commissionType: 'Entry Wise Commission',
                                    commissionPercentage:commissionPer,
                                    date:Date.now(),
                                    marketName:bets[bet].marketName,
                                    loginUserId:user.id,
                                    parentIdArray:childUser.parentUsers,
                                    uniqueId,
                                    betId:bets[bet].id
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


            // console.log("GOT GERE ")
            try{
                let checkDelete = await InprogressModel.findOneAndUpdate({marketId : bets[bet].marketId, progressType:'SettleMent'}, {$inc:{settledBet:1}})
                // console.log(checkDelete.settledBet, checkDelete.length, (checkDelete.settledBet + 1) == checkDelete.length)
                if((checkDelete.settledBet + 1) == checkDelete.length){
                await InprogressModel.findOneAndDelete({marketId : bets[bet].marketId, progressType:'SettleMent'})
                // await runnerDataModel.findOneAndDelete({marketId:bets[bet].marketId})
                }
            }catch(err){
                console.log(err)
            }
        }

        let data12 = {
            marketId : bets[0].marketId,
            match : bets[0].match
        }
        commitssionData(data12)

      }catch(err){
        console.log(err)
        return 'Please try again leter'
      }
}

module.exports = mapBet