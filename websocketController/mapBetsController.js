const userModel = require("../model/userModel");
const accModel = require("../model/accountStatementByUserModel");
const betModel = require("../model/betmodel");
const commissionRepportModel = require("../model/commissionReport");
const commissionModel = require("../model/CommissionModel");
const commissionMarketModel = require("../model/CommissionMarketsModel");
const netCommission = require("../model/netCommissionModel");
const settlementHistory = require("../model/settelementHistory");
const InprogressModel = require('../model/InprogressModel');
const newCommissionModel = require('../model/commissioNNModel');
const Decimal = require('decimal.js');
const runnerDataModel = require("../model/runnersData");

exports.mapbet = async(data) => {
    console.log(data, "DATADATA")
  //FOR CHILD OF LOGIN USER
      let childrenUsername = []
      let operatorId;
      if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
        let children = await userModel.find({parentUsers:data.LOGINDATA.LOGINUSER.parent_id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
        operatorId = data.LOGINDATA.LOGINUSER.parent_id

      }else{
        let children = await userModel.find({parentUsers:data.LOGINDATA.LOGINUSER._id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
        operatorId = data.LOGINDATA.LOGINUSER._id

      }
     
//FOR OPEN BETS 
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

    console.log(bets[0],'==>bet[0]')


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

    
  //FUNCTION FOR PROCESS BET
    
  async function processBets() {
//   console.log("WORKING +==>>", data)
  const betPromises = bets.map(async (bet) => {
    // console.log(bet, data.result, "DATADATA123456")
    if(!(bet.marketName.toLowerCase().startsWith('book') || bet.marketName.toLowerCase().startsWith('winn') || bet.marketName.toLowerCase().startsWith('match'))){ 
        if(bet.marketId.slice(-2).startsWith('OE')){

        }else{
            if(((bet.selectionName.split('@')[1] <=  data.result) && bet.bettype2 == 'BACK') || ((bet.selectionName.split('@')[1] >= data.result) && bet.bettype2 == "LAY")){
                let creditDebitamount 
                        let exposure = bet.exposure
                        if(bet.bettype2 == "BACK"){
                            creditDebitamount = (bet.Stake * bet.oddValue)/100
                        }else{
                            creditDebitamount = bet.Stake
                        }
                        let bet = await betModel.findByIdAndUpdate(bet._id,{status:"WON", returns:creditDebitamount, result:marketresult.result})
                        let user = await userModel.findByIdAndUpdate(bet.userId,{$inc:{availableBalance: creditDebitamount, myPL: creditDebitamount, Won:1, exposure:-parseFloat(exposure), uplinePL:-creditDebitamount, pointsWL:creditDebitamount}})
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
            }
        }

    }else{
      if(bet.selectionName.toLowerCase().includes(data.result.toLowerCase()) && bet.bettype2 == 'BACK' || !bet.selectionName.toLowerCase().includes(data.result.toLowerCase()) && bet.bettype2 == 'LAY'){
        let debitCreditAmount;
        let exposure = bet.exposure
        if(bet.bettype2 == 'BACK'){
          if(bet.marketName.toLowerCase().startsWith('match') || bet.marketName.toLowerCase().startsWith('winne')){
            debitCreditAmount = parseFloat((bet.Stake * bet.oddValue).toFixed(2)) - bet.Stake
          }else{
            debitCreditAmount = parseFloat(bet.Stake * bet.oddValue/100).toFixed(2)
          }
          // exposure = parseFloat(entry.Stake)
        }else{
          if(bet.marketName.toLowerCase().startsWith('match')){
            debitCreditAmount = parseFloat(bet.Stake).toFixed(2)
            // exposure = (parseFloat(bet.Stake * bet.oddValue) - parseFloat(bet.Stake)).toFixed(2)
          }else{
            debitCreditAmount = parseFloat(bet.Stake).toFixed(2)
            // exposure = (parseFloat(bet.Stake * bet.oddValue) / 100 ).toFixed(2)
          }
        }
          let bet1 = await betModel.findByIdAndUpdate(bet._id,{status:"WON", returns:debitCreditAmount, result: data.result})
          let user = await userModel.findByIdAndUpdate(bet.userId,{$inc:{availableBalance: debitCreditAmount, myPL: debitCreditAmount, Won:1, exposure:-exposure, uplinePL:-debitCreditAmount, pointsWL:debitCreditAmount}})
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

          //og()
          await accModel.create({
            "user_id":user._id,
            "description": description,
            "creditDebitamount" : parseFloat(debitCreditAmount),
            "balance" : user.availableBalance + debitCreditAmount,
            "date" : Date.now(),
            "userName" : user.userName,
            "role_type" : user.role_type,
            "Remark":"-",
            "stake": bet.Stake,
            "transactionId":`${bet.transactionId}`
          })

          let commissionMarket = await commissionMarketModel.find()
          let usercommissiondata;
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
      }else{
        await betModel.findByIdAndUpdate(bet._id,{status:"LOSS", result: data.result})
        let user 
        let exposure = bet.exposure
        user = await userModel.findByIdAndUpdate(bet.userId, {$inc:{Loss:1, exposure:-exposure, availableBalance: -exposure, myPL:-exposure, uplinePL:exposure, pointsWL:-exposure}})
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



          //COMMISSSION 
          
          let commissionMarket = await commissionMarketModel.find()
          let usercommissiondata;
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


          // console.log(bet.marketId)
        //   console.log(commissionMarket, "CommissionMarket")
        //   if(commissionMarket.some(item => item.marketId == bet.marketId)){
        //     console.log('work111111111111111111111111111111111111111111111111')
        //     try{
        //         let commission = await commissionModel.find({userId:user.id})
        //         let commissionPer = 0
        //         // if (bet.marketName == "Match Odds" && commission[0].matchOdd.status){
        //         //     commissionPer = commission[0].matchOdd.percentage
        //         //   }
        //           if ((bet.marketName.startsWith('Bookmake') || bet.marketName.startsWith('BOOKMAKE') || bet.marketName.startsWith('TOSS')) && commission[0].Bookmaker.type == "NET_LOSS" && commission[0].Bookmaker.status){
        //             commissionPer = commission[0].Bookmaker.percentage
        //           }
        //           let commissionCoin = ((commissionPer * bet.Stake)/100).toFixed(4)
        //           console.log(commissionCoin , "commisiion")
        //           console.log(commissionPer, "Percentage")
        //           if(commissionPer > 0){
        //             let user1 = await userModel.findById(user.id)
        //             // console.log(user1)
        //             // console.log(user1)
        //             let commissionReportData = {
        //                 userId:user.id,
        //                 market:bet.marketName,
        //                 // commType:'Entry Wise loss Commission',
        //                 percentage:commissionPer,
        //                 commPoints:bet.Stake,
        //                 event:bet.event,
        //                 match:bet.match,
        //                 Sport:bet.gameId
        //             }
        //             let commisssioReport = await netCommission.create(commissionReportData)
        //         }
        //         }catch(err){
        //             console.log(err)
        //         } 
        //         try{
        //             for(let i = user.parentUsers.length - 1; i >= 1; i--){
        //                 let childUser = await userModel.findById(user.parentUsers[i])
        //                 let parentUser = await userModel.findById(user.parentUsers[i - 1])
        //                 let commissionChild = await commissionModel.find({userId:childUser.id})
        //                 let commissionPer = 0
        //                 if ((bet.marketName.startsWith('Bookmake') || bet.marketName.startsWith('BOOKMAKE') || bet.marketName.startsWith('TOSS')) && commissionChild[0].Bookmaker.type == "NET_LOSS" && commissionChild[0].Bookmaker.status){
        //                   commissionPer = commissionChild[0].Bookmaker.percentage
        //                 }
        //                 let commissionCoin = ((commissionPer * bet.Stake)/100).toFixed(4)
        //                 // console.log(commissionCoin , "commisiion")
        //                 if(commissionPer > 0){
        //                     let user1 = await userModel.findById(childUser.id)
        //                     // console.log(user1.userName)
        //                     let commissionReportData = {
        //                         userId:childUser.id,
        //                         market:bet.marketName,
        //                         // commType:'Net loss Commission',
        //                         percentage:commissionPer,
        //                         commPoints:bet.Stake,
        //                         event:bet.event,
        //                         match:bet.match,
        //                         Sport:bet.gameId
        //                     }
        //                     let commisssioReport = await netCommission.create(commissionReportData)
        //                 }
        //             }
        //         }catch(err){
        //             console.log(err)
        //         }
        // }
        
      }
    }

    let checkDelete = await InprogressModel.findOneAndUpdate({marketId : bet.marketId, progressType:'SettleMent'}, {$inc:{settledBet:1}})
    if((checkDelete.settledBet + 1) == checkDelete.length){
      await InprogressModel.findOneAndDelete({marketId : bet.marketId, progressType:'SettleMent'})
      await runnerDataModel.findOneAndDelete({marketId:bet.marketId})
    }
  });
  
  await Promise.all(betPromises);
  // NET LOSING COMMISSION
  
   console.log('net losing commission start ....')
   let commissionMarket = await commissionMarketModel.find()
   let usercommissiondata3
    if(commissionMarket.some(item => (item.marketId == bets[0].marketId))){
        console.log('in commission market')
      let filterUser = await commissionModel.find({"Bookmaker.type":'NET_LOSS'})
      let newfilterUser = filterUser.map(ele => {
          return ele.userId
      })
    
    console.log(newfilterUser,'newfilterUser')
      let netLossingCommission = await betModel.aggregate([
        {
          $match:{
              marketName : new RegExp('book','i'),
              match: `${bets[0].match}`,
              userId:{$in:newfilterUser},
              marketId:`${bets[0].marketId}`,
              status:{$in:['WON','LOSS']},
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
      ]);
     
   
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
            marketName : new RegExp('book','i'),
            match: `${bets[0].match}`,
            userId:{$in:newfilterUser},
            marketId:`${bets[0].marketId}`,
            status:{$in:['WON','LOSS']},
            commissionStatus:false
        },{commissionStatus:true})
        console.log('net losing commission ended')
    }
}
processBets()
}