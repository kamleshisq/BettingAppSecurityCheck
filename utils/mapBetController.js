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

async function mapBet(data){
    console.log(data, "datadatadata1234564879")
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

      

      try{ 
        for(const bet in bets){ 
            // console.log(bet, "betbetbet")
            if((bets[bet].selectionName.toLowerCase().includes(data.result.toLowerCase()) && bets[bet].bettype2 == 'BACK') || (!bets[bet].selectionName.toLowerCase().includes(data.result.toLowerCase()) && bets[bet].bettype2 == 'LAY')){
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

                let bet1 = await betModel.findByIdAndUpdate(bets[bet]._id,{status:"WON", returns:debitCreditAmount, result: data.result})
                let user = await userModel.findByIdAndUpdate(bets[bet].userId,{$inc:{availableBalance: debitCreditAmount, myPL: debitCreditAmount, Won:1, exposure:-exposure, uplinePL:-debitCreditAmount, pointsWL:debitCreditAmount}})
                let description = `Bet for ${bets[bet].match}/stake = ${bets[bet].Stake}/WON`

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
                  })
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
                "balance" : user.availableBalance + debitCreditAmount,
                "date" : Date.now(),
                "userName" : user.userName,
                "role_type" : user.role_type,
                "Remark":"-",
                "stake": bets[bet].Stake,
                "transactionId":`${bets[bet].transactionId}`
              })


              let commissionMarket = await commissionMarketModel.find()
              let usercommissiondata;
              if(commissionMarket.some(item => item.marketId == bets[bet].marketId)){ 
                try{
                    let commission = await commissionModel.find({userId:user.id})
                    console.log(commission, "commissioncommissioncommissioncommission")
                    let commissionPer = 0
                    if (bets[bet].marketName.toLowerCase().startsWith('match') && commission[0].matchOdd.status){
                        commissionPer = commission[0].matchOdd.percentage
                    }
                    console.log(commissionPer, "commissionPercommissionPercommissionPer")
                    let commissionCoin = ((commissionPer * bets[bet].Stake)/100).toFixed(4)
                    if(commissionPer > 0){
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
                            loginUserId:user._id,
                            parentIdArray:user.parentUsers,
                            date:Date.now()
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
                            if (bets[bet].marketName.toLowerCase().startsWith('match') && commissionChild[0].matchOdd.status){
                                commissionPer = commissionChild[0].matchOdd.percentage
                            }
                            let commissionCoin = ((commissionPer * bets[bet].Stake)/100).toFixed(4)
                            if(commissionPer > 0){
                                let commissiondata = {
                                    userName : childUser.userName,
                                    userId : childUser.id,
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
                                    loginUserId:usercommissiondata.userId,
                                    parentIdArray:childUser.parentUsers,
                                    uniqueId:usercommissiondata._id,
                                    date:Date.now()
                                }
                                let commissionData = await newCommissionModel.create(commissiondata)
                            }
                        }
                    }catch(err){
                        console.log(err)
                    }

              }

            }else if ((bets[bet].secId === "odd_Even_No" && data.result === "LAY") || (bets[bet].secId === "odd_Even_Yes" && data.result === "BACK")){
                let debitCreditAmount 
                let exposure = bets[bet].exposure
                if(bets[bet].bettype2 == "BACK"){
                    debitCreditAmount = (bets[bet].Stake * bets[bet].oddValue)/100
                }else{
                    debitCreditAmount = bets[bet].Stake
                }
                let thatbet = await betModel.findByIdAndUpdate(bets[bet]._id,{status:"WON", returns:debitCreditAmount, result:data.result})
                let user = await userModel.findByIdAndUpdate(bets[bet].userId,{$inc:{availableBalance: debitCreditAmount, myPL: debitCreditAmount, Won:1, exposure:-parseFloat(exposure), uplinePL:-debitCreditAmount, pointsWL:debitCreditAmount}})
                let description = `Bet for ${bets[bet].match}/stake = ${bets[bet].Stake}/WON`

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
                  "stake": bets[bet].Stake,
                  "transactionId":`${bets[bet].transactionId}`
                })
            }else if (((bets[bet].selectionName.split('@')[1] <=  data.result) && bets[bet].bettype2 == 'BACK') || ((bets[bet].selectionName.split('@')[1] >= data.result) && bets[bet].bettype2 == "LAY")){
                let creditDebitamount 
                        let exposure = bets[bet].exposure
                        if(bets[bet].bettype2 == "BACK"){
                            creditDebitamount = (bets[bet].Stake * bets[bet].oddValue)/100
                        }else{
                            creditDebitamount = bets[bet].Stake
                        }
                        let thatbet = await betModel.findByIdAndUpdate(bets[bet]._id,{status:"WON", returns:creditDebitamount, result:data.result})
                        let user = await userModel.findByIdAndUpdate(bets[bet].userId,{$inc:{availableBalance: creditDebitamount, myPL: creditDebitamount, Won:1, exposure:-parseFloat(exposure), uplinePL:-creditDebitamount, pointsWL:creditDebitamount}})
                        let description = `Bet for ${bets[bet].match}/stake = ${bets[bet].Stake}/WON`

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
                          "stake": bets[bet].Stake,
                          "transactionId":`${bets[bet].transactionId}`
                        })
            }else{
                let thatbet = await betModel.findByIdAndUpdate(bets[bet]._id,{status:"LOSS", result:data.result})
                let user 
                let exposure = bets[bet].exposure
                user = await userModel.findByIdAndUpdate(bets[bet].userId, {$inc:{Loss:1, exposure:-exposure, availableBalance: -exposure, myPL:-exposure, uplinePL:exposure, pointsWL:-exposure}})
                let description = `Bet for ${bets[bet].match}/stake = ${bets[bet].Stake}/LOSS`

                let debitAmountForP = exposure
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
                    "stake": bets[bet].Stake,
                    "transactionId":`${bets[bet].transactionId}`
                })

                //EntryWise Loosing Commiission
                //COMMISSSION 
          if((bets[bet].marketName.toLowerCase().startsWith('book') || bets[bet].marketName.toLowerCase().startsWith('toss'))){
              let commissionMarket = await commissionMarketModel.find()
              let usercommissiondata;
              if(commissionMarket.some(item => item.marketId == bets[bet].marketId)){
                  try{
                      let commission = await commissionModel.find({userId:user.id})
                      let commissionPer = 0
                      if ((bets[bet].marketName.toLowerCase().startsWith('book') || bets[bet].marketName.toLowerCase().startsWith('toss')) && commission[0].Bookmaker.type == "ENTRY_LOSS_" && commission[0].Bookmaker.status){
                          commissionPer = commission[0].Bookmaker.percentage
                      }
                      let commissionCoin = ((commissionPer * bets[bet].Stake)/100).toFixed(4)
                      if(commissionPer > 0){
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
                              if ((bets[bet].marketName.toLowerCase().startsWith('book') || bets[bet].marketName.toLowerCase().startsWith('toss')) && commissionChild[0].Bookmaker.type == "ENTRY_LOSS_" && commissionChild[0].Bookmaker.status){
                              commissionPer = commissionChild[0].Bookmaker.percentage
                              }
                              let commissionCoin = ((commissionPer * bets[bet].Stake)/100).toFixed(4)
                              if(commissionPer > 0){
                                  let commissiondata = {
                                      userName : childUser.userName,
                                      userId : childUser.id,
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
                                      loginUserId:usercommissiondata.userId,
                                      parentIdArray:childUser.parentUsers,
                                      uniqueId:usercommissiondata._id
                                  }
                                  let commissionData = await newCommissionModel.create(commissiondata)
                              }
                          }
                      }catch(err){
                          console.log(err)
                      }
              } 
          }



            }


            console.log("GOT GERE ")
            try{
                let checkDelete = await InprogressModel.findOneAndUpdate({marketId : bets[bet].marketId, progressType:'SettleMent'}, {$inc:{settledBet:1}})
                if((checkDelete.settledBet + 1) == checkDelete.length){
                await InprogressModel.findOneAndDelete({marketId : bets[bet].marketId, progressType:'SettleMent'})
                await runnerDataModel.findOneAndDelete({marketId:bets[bet].marketId})
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