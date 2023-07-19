const userModel = require('../model/userModel');
const betmodel = require('../model/betmodel');
const accountStatementByUserModel = require("../model/accountStatementByUserModel");
const betLimitModel = require('../model/betLimitModel');
const cricketAndOtherSport = require('../utils/getSportAndCricketList');


const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    function generateString(length) {
        let result = "";
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
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
    if(betLimit.min_stake > (data.data.stake * 1) ){
        return `Invalide stake, Please play with atleast minimum stake (${betLimit.min_stake})`
    }else if(betLimit.max_stake < (data.data.stake * 1)){
        return `Invalide stake, Please play with atmost maximum stake (${betLimit.max_stake})`
    }else if(betLimit.max_odd < (data.data.odds) * 1 ){
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
    console.log(marketList)
    for (let key in marketList) {
        if (marketList.hasOwnProperty(key)) {
          const marketData = marketList[key];
          if (marketData.marketId === data.data.market) {
            marketDetails =  marketData;
            break;
          }
        }
      }
let runnersData = JSON.parse(marketDetails.runners)
let betOn = runnersData.find(item => item.secId == data.data.secId)
    let betPlaceData = {
        userId : data.LOGINDATA.LOGINUSER._id,
        userName : data.LOGINDATA.LOGINUSER.userName,
        transactionId : `${data.LOGINDATA.LOGINUSER.userName}${uniqueToken}`,
        date : Date.now(),
        oddValue : data.data.odds * 1,
        Stake : data.data.stake * 1,
        status : "OPEN",
        returns : -(data.data.stake),
        role_type : data.LOGINDATA.LOGINUSER.role_type,
        match : data.data.title,
        betType : bettype,
        event : liveBetGame.eventData.league,
        gameId : liveBetGame.eventData.sportId,
        marketName : marketDetails.title,
        selectionName : betOn.runner,
        marketId : data.data.market,
        secId : data.data.secId
    }
    let description = `Bet for ${data.data.title}/stake = ${data.data.stake}`
    let description2 = `Bet for ${data.data.title}/stake = ${data.data.stake}/user = ${data.LOGINDATA.LOGINUSER.userName} `

    let Acc = {
        "user_id":data.LOGINDATA.LOGINUSER._id,
        "description": description,
        "creditDebitamount" : -data.data.stake,
        "balance" : check.availableBalance - data.data.stake,
        "date" : Date.now(),
        "userName" : data.LOGINDATA.LOGINUSER.userName,
        "role_type" : data.LOGINDATA.LOGINUSER.role_type,
        "Remark":"-",
        "stake": data.data.stake,
        "transactionId":`${data.LOGINDATA.LOGINUSER.userName}${uniqueToken}`
    }
    await betmodel.create(betPlaceData)
    await accountStatementByUserModel.create(Acc)
    let parentUser
    let user = await userModel.findByIdAndUpdate(data.LOGINDATA.LOGINUSER._id, {$inc:{balance: -data.data.stake, availableBalance: -data.data.stake, myPL: -data.data.stake, Bets : 1, exposure:data.data.stake}})
    if(!user){
        return "There is no user with that id"
    }
    if(user.parentUsers.length < 2){
        // await userModel.updateMany({ _id: { $in: user.parentUsers } }, {$inc:{balance: -data.data.stake, downlineBalance: -data.data.stake}})
        // parentUser = await userModel.findByIdAndUpdate(user.parentUsers[0], {$inc:{availableBalance:data.data.stake}})
        parentUser = await userModel.findByIdAndUpdate(user.parentUsers[0],{$inc:{availableBalance:data.data.stake, downlineBalance: -data.data.stake}})
    }else{
        await userModel.updateMany({ _id: { $in: user.parentUsers.slice(2) } }, {$inc:{balance: -data.data.stake, downlineBalance: -data.data.stake}})
        parentUser = await userModel.findByIdAndUpdate(user.parentUsers[1], {$inc:{availableBalance:data.data.stake, downlineBalance: -data.data.stake}})
    }
    let Acc2 = {
        "user_id":parentUser._id,
        "description": description2,
        "creditDebitamount" : data.data.stake,
        "balance" : parentUser.availableBalance + (data.data.stake * 1),
        "date" : Date.now(),
        "userName" : parentUser.userName,
        "role_type" : parentUser.role_type,
        "Remark":"-",
        "stake": data.data.stake,
        "transactionId":`${data.LOGINDATA.LOGINUSER.userName}${uniqueToken}Parent`
    }
    await accountStatementByUserModel.create(Acc2)
    return "Bet place successfully"
}

module.exports = placeBet