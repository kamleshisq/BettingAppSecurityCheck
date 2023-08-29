const userModel = require('../model/userModel');
const betmodel = require('../model/betmodel');
const accountStatementByUserModel = require("../model/accountStatementByUserModel");
const betLimitModel = require('../model/betLimitModel');
const cricketAndOtherSport = require('../utils/getSportAndCricketList');
const commissionRepportModel = require("../model/commissionReport");
const commissionModel = require("../model/CommissionModel");
const commissionMarketModel = require("../model/CommissionMarketsModel");
const Decimal = require('decimal.js');

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    function generateString(length) {
        let result = "";
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(parseFloat(Math.random() * charactersLength));
        }

        return result;
    }

async function placeBet(data){
    let check = await userModel.findById(data.LOGINDATA.LOGINUSER._id)
    if(check.availableBalance < data.data.stake){
        return "You do not have sufficient balance for bet"
    }else if(check.exposureLimit === check.exposure){
        return "Please try again later, Your exposure Limit is full"
    }
    let betLimit
    if(data.data.spoetId){
        betLimit = await betLimitModel.findOne({type:"Sport"})
    }
    // console.log(betLimit, 45654654654)
    if(betLimit.min_stake > parseFloat(data.data.stake) ){
        return `Invalide stake, Please play with atleast minimum stake (${betLimit.min_stake})`
    }else if(betLimit.max_stake < parseFloat(data.data.stake)){
        return `Invalide stake, Please play with atmost maximum stake (${betLimit.max_stake})`
    }else if(betLimit.max_odd < parseFloat(data.data.odds)){
        return `Invalide odds valur, Please play with atmost maximum odds (${betLimit.max_odd})`
    }

    let uniqueToken = generateString(5)
    const sportData = await cricketAndOtherSport()
    let gameList
    let bettype
    // console.log(data.data)
    if(data.data.spoetId == 4){
        gameList = sportData[0].gameList[0].eventList
        bettype = 'Cricket'
    }else if(data.data.spoetId == 1){
        // console.log(sportData[1].gameList)
        let footballdata = sportData[1].gameList.find(item => item.sport_name === "Football")
        gameList = footballdata.eventList
        bettype = "Football"
    }else if (data.data.spoetId == 2){
        let tennisData = sportData[1].gameList.find(item => item.sport_name === "Tennis")
        gameList = tennisData.eventList
        bettype = "Tennis"
    }
    let liveBetGame = gameList.find(item => item.eventData.eventId == data.data.eventId);
    let marketDetails
    let marketList = liveBetGame.marketList
    for (let key in marketList) {
        if (data.data.secId === "odd_Even_Yes" || data.data.secId === "odd_Even_No"){
            const oddEvenData = marketList.odd_even;
            marketDetails = oddEvenData.find(item => item.marketId === data.data.market)
            if(!marketDetails){
                let oddEvenData = marketList.session
                marketDetails = oddEvenData.find(item => item.marketId === data.data.market)
            }
            break;
        }else if(marketList.hasOwnProperty(key)) {
            const marketData = marketList[key];
            console.log(marketData, "marketdata1212121")
            if(marketData != null){
                // console.log(marketData)
                if(Array.isArray(marketData)){
                    console.log(marketData)
                    let book = marketData.find(item => item.marketId == data.data.market)
                    console.log(book, "book")
                    marketDetails = book
                }else{
                    if (marketData.marketId === data.data.market) {
                        marketDetails =  marketData;
                        break;
                      }
                }
            }
      }}
let betPlaceData = {}
console.log(marketDetails)
if(!marketDetails.runners){
    betPlaceData = {
        userId : data.LOGINDATA.LOGINUSER._id,
        userName : data.LOGINDATA.LOGINUSER.userName,
        transactionId : `${data.LOGINDATA.LOGINUSER.userName}${uniqueToken}`,
        date : Date.now(),
        oddValue : parseFloat(data.data.odds),
        Stake : parseFloat(data.data.stake),
        status : "OPEN",
        returns : -parseFloat(data.data.stake),
        role_type : data.LOGINDATA.LOGINUSER.role_type,
        match : data.data.title,
        betType : bettype,
        event : liveBetGame.eventData.league,
        gameId : liveBetGame.eventData.sportId,
        eventId: liveBetGame.eventData.eventId,
        eventDate : liveBetGame.eventData.time,
        marketName : marketDetails.title,
        selectionName : marketDetails.title,
        marketId : data.data.market,
        secId : data.data.secId
    }
}else{
    let runnersData = JSON.parse(marketDetails.runners)
    let betOn = runnersData.find(item => item.secId == data.data.secId)
    // console.log(betOn)
    // return 123
    //og(betOn, 456)
        betPlaceData = {
            userId : data.LOGINDATA.LOGINUSER._id,
            userName : data.LOGINDATA.LOGINUSER.userName,
            transactionId : `${data.LOGINDATA.LOGINUSER.userName}${uniqueToken}`,
            date : Date.now(),
            oddValue : parseFloat(data.data.odds),
            Stake : parseFloat(data.data.stake),
            status : "OPEN",
            returns : -parseFloat(data.data.stake),
            role_type : data.LOGINDATA.LOGINUSER.role_type,
            match : data.data.title,
            betType : bettype,
            event : liveBetGame.eventData.league,
            gameId : liveBetGame.eventData.sportId,
            eventId: liveBetGame.eventData.eventId,
            eventDate : liveBetGame.eventData.time,
            marketName : marketDetails.title,
            selectionName : betOn.runner,
            marketId : data.data.market,
            secId : data.data.secId
        }
}
    let description = `Bet for ${data.data.title}/stake = ${data.data.stake}`
    let description2 = `Bet for ${data.data.title}/stake = ${data.data.stake}/user = ${data.LOGINDATA.LOGINUSER.userName} `

    let Acc = {
        "user_id":data.LOGINDATA.LOGINUSER._id,
        "description": description,
        "creditDebitamount" : -parseFloat(data.data.stake),
        "balance" : check.availableBalance - parseFloat(data.data.stake),
        "date" : Date.now(),
        "userName" : data.LOGINDATA.LOGINUSER.userName,
        "role_type" : data.LOGINDATA.LOGINUSER.role_type,
        "Remark":"-",
        "stake": parseFloat(data.data.stake),
        "transactionId":`${data.LOGINDATA.LOGINUSER.userName}${uniqueToken}`
    }
    await betmodel.create(betPlaceData)
    await accountStatementByUserModel.create(Acc)
    // let parentUser
    let user = await userModel.findByIdAndUpdate(data.LOGINDATA.LOGINUSER._id, {$inc:{availableBalance: - parseFloat(data.data.stake), myPL: - parseFloat(data.data.stake), Bets : 1, exposure: parseFloat(data.data.stake), uplinePL:parseFloat(data.data.stake), pointsWL:-parseFloat(data.data.stake)}})
    if(!user){
        return "There is no user with that id"
    }
    
                    



    // if(user.parentUsers.length < 2){
    //     // await userModel.updateMany({ _id: { $in: user.parentUsers } }, {$inc:{balance: -data.data.stake, downlineBalance: -data.data.stake}})
    //     // parentUser = await userModel.findByIdAndUpdate(user.parentUsers[0], {$inc:{availableBalance:data.data.stake}})
    //     parentUser = await userModel.findByIdAndUpdate(user.parentUsers[0],{$inc:{availableBalance:parseFloat(data.data.stake), downlineBalance: -parseFloat(data.data.stake), myPL: parseFloat(data.data.stake)}})
    // }else{
    //     await userModel.updateMany({ _id: { $in: user.parentUsers.slice(2) } }, {$inc:{balance: -parseFloat(data.data.stake), downlineBalance: -parseFloat(data.data.stake)}})
    //     parentUser = await userModel.findByIdAndUpdate(user.parentUsers[1], {$inc:{availableBalance:parseFloat(data.data.stake), downlineBalance: -parseFloat(data.data.stake), myPL: parseFloat(data.data.stake)}})
    // }

    let amount = parseFloat(data.data.stake);
    try{
        for(let i = user.parentUsers.length - 1; i >= 1; i--){
            // console.log("WORKING")
            let parentUser1 = await userModel.findById(user.parentUsers[i])
            let parentUser2 = await userModel.findById(user.parentUsers[i-1])
            let parentUser1Amount = new Decimal(parentUser1.myShare).times(amount).dividedBy(100)
            let parentUser2Amount = new Decimal(parentUser1.Share).times(amount).dividedBy(100);
            // parentUser1Amount = Math.round(parentUser1Amount * 10000) / 10000;
            // parentUser2Amount = Math.round(parentUser2Amount * 10000) / 10000;
            parentUser1Amount = parentUser1Amount.toDecimalPlaces(4);
            parentUser2Amount =  parentUser2Amount.toDecimalPlaces(4);
            console.log(parentUser1Amount, parentUser2Amount)
            // await userModel.findByIdAndUpdate(user.parentUsers[i], {$inc:{downlineBalance:-parseFloat(data.data.stake), myPL : parentUser1Amount, uplinePL: parentUser2Amount, lifetimePL : parentUser1Amount, pointsWL:-parseFloat(data.data.stake)}})
            // if(i === 1){
            //     await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {$inc:{downlineBalance:-parseFloat(data.data.stake), myPL : parentUser2Amount, lifetimePL : parentUser2Amount, pointsWL:-parseFloat(data.data.stake)}})
            // }
            await userModel.findByIdAndUpdate(user.parentUsers[i], {
                $inc: {
                    downlineBalance: -(data.data.stake),
                    myPL: parentUser1Amount,
                    uplinePL: parentUser2Amount,
                    lifetimePL: parentUser1Amount,
                    pointsWL: -(data.data.stake)
                }
            });
        
            if (i === 1) {
                await userModel.findByIdAndUpdate(user.parentUsers[i - 1], {
                    $inc: {
                        downlineBalance: -(data.data.stake),
                        myPL: parentUser2Amount,
                        lifetimePL: parentUser2Amount,
                        pointsWL: -(data.data.stake)
                    }
                });
            }
            amount = parentUser2Amount
        }
    }catch(err){
        console.log(err)
        return err
    }
    // console.log(user)
    let commissionMarket = await commissionMarketModel.find()
    if(commissionMarket.some(item => item.marketId == data.data.market)){
        let commission = await commissionModel.find({userId:user.id})
        // console.log(commission, 456)
        let commissionPer = 0
        if ((marketDetails.title.startsWith('Bookmake') || marketDetails.title.startsWith('TOSS')) && commission[0].Bookmaker.type == "ENTRY" && commission[0].Bookmaker.status){
          commissionPer = commission[0].Bookmaker.percentage
        }else if (commission[0].fency.type == "ENTRY" && !(marketDetails.title.startsWith('Bookmake') || marketDetails.title.startsWith('TOSS') || marketDetails.title.startsWith('Match')) && commission[0].fency.status){
          commissionPer = commission[0].fency.percentage
        }
        let commissionCoin = ((commissionPer * data.data.stake)/100).toFixed(4)
        console.log(commissionCoin)
        if(commissionPer > 0){
            let user1 = await userModel.findByIdAndUpdate(user.id, {$inc:{commission:commissionCoin}})
            // console.log(user)
            // console.log(user1)
            let commissionReportData = {
                userId:user.id,
                market:marketDetails.title,
                commType:'Entry Wise Commission',
                percentage:commissionPer,
                commPoints:commissionCoin,
                event:liveBetGame.eventData.league,
                match:data.data.title,
                Sport:liveBetGame.eventData.sportId
            }
            let commisssioReport = await commissionRepportModel.create(commissionReportData)
        }
    
        try{
            for(let i = user.parentUsers.length - 1; i >= 1; i--){
                let childUser = await userModel.findById(user.parentUsers[i])
                let parentUser = await userModel.findById(user.parentUsers[i - 1])
                let commissionChild = await commissionModel.find({userId:childUser.id})
                let commissionPer = 0
                if ((marketDetails.title.startsWith('Bookmake') || marketDetails.title.startsWith('TOSS')) && commissionChild[0].Bookmaker.type == "ENTRY" && commissionChild[0].Bookmaker.status){
                  commissionPer = commissionChild[0].Bookmaker.percentage
                }else if (commissionChild[0].fency.type == "ENTRY" && !(marketDetails.title.startsWith('Bookmake') || marketDetails.title.startsWith('TOSS') || marketDetails.title.startsWith('Match')) && commissionChild[0].fency.status){
                  commissionPer = commissionChild[0].fency.percentage
                }
                let commissionCoin = ((commissionPer * data.data.stake)/100).toFixed(4)
                console.log(commissionCoin)
                if(commissionPer > 0){
                    let user1 = await userModel.findByIdAndUpdate(childUser.id, {$inc:{commission:commissionCoin}})
                    console.log(user1.userName)
                    let commissionReportData = {
                        userId:childUser.id,
                        market:marketDetails.title,
                        commType:'Entry Wise Commission',
                        percentage:commissionPer,
                        commPoints:commissionCoin,
                        event:liveBetGame.eventData.league,
                        match:data.data.title,
                        Sport:liveBetGame.eventData.sportId
                    }
                    let commisssioReport = await commissionRepportModel.create(commissionReportData)
                }
            }
        }catch(err){
            console.log(err)
        }
    }
    // let Acc2 = {
    //     "user_id":parentUser._id,
    //     "description": description2,
    //     "creditDebitamount" : parseFloat(data.data.stake),
    //     "balance" : parentUser.availableBalance + parseFloat(data.data.stake),
    //     "date" : Date.now(),
    //     "userName" : parentUser.userName,
    //     "role_type" : parentUser.role_type,
    //     "Remark":"-",
    //     "stake": parseFloat(data.data.stake),
    //     "transactionId":`${data.LOGINDATA.LOGINUSER.userName}${uniqueToken}Parent`
    // }
    // await accountStatementByUserModel.create(Acc2)
    // if(commissionPer > 0){
    //     let WhiteLableUser = await userModel.findByIdAndUpdate(user.parentUsers[1], {$inc:{myPL: - Math.round(commissionPer * data.data.stake), availableBalance : -Math.round(commissionPer * data.data.stake)}})
    //     let houseUser = await userModel.findByIdAndUpdate(user.parentUsers[0], {$inc:{myPL: Math.round(commissionPer * data.data.stake), availableBalance : Math.round(commissionPer * data.data.stake)}}) 

    //     await accountStatementByUserModel.create({
    //       "user_id":WhiteLableUser._id,
    //       "description": `commission for ${data.data.title}/stake = ${data.data.stake}`,
    //       "creditDebitamount" : - Math.round(commissionPer * data.data.stake),
    //       "balance" : WhiteLableUser.availableBalance - Math.round(commissionPer * data.data.stake),
    //       "date" : Date.now(),
    //       "userName" : WhiteLableUser.userName,
    //       "role_type" : WhiteLableUser.role_type,
    //       "Remark":"-",
    //       "stake": data.data.stake,
    //       "transactionId":`${data.LOGINDATA.LOGINUSER.userName}${uniqueToken}`
    //     })

    //     await accountStatementByUserModel.create({
    //       "user_id":houseUser._id,
    //       "description": `commission for ${data.data.title}/stake = ${data.data.stake}/from user ${WhiteLableUser.userName}`,
    //       "creditDebitamount" : Math.round(commissionPer * data.data.stake),
    //       "balance" : houseUser.availableBalance + Math.round(commissionPer * data.data.stake),
    //       "date" : Date.now(),
    //       "userName" : houseUser.userName,
    //       "role_type" : houseUser.role_type,
    //       "Remark":"-",
    //       "stake": data.data.stake,
    //       "transactionId":`${data.LOGINDATA.LOGINUSER.userName}${uniqueToken}Parent`
    //     })
    // } 

    //FOR CIMMISSION//
   



    return "Bet placed successfully"
}

module.exports = placeBet