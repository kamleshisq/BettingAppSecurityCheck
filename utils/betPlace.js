const userModel = require('../model/userModel');
const betmodel = require('../model/betmodel');
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
    let uniqueToken = generateString(5)
    const sportData = await cricketAndOtherSport()
    let gameList
    let bettype
    if(data.data.spoetId == 4){
        gameList = sportData[0].gameList[0].eventList
        bettype = 'Cricket'
    }
    let liveBetGame = gameList.find(item => item.eventData.eventId == data.data.eventId);
    let marketDetails
    let marketList = liveBetGame.marketList
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
        selectionName : betOn.runner
    }
    let user = await userModel.findByIdAndUpdate(data.LOGINDATA.LOGINUSER._id, {$inc:{balance: -data.data.stake, availableBalance: -data.data.stake, myPL: -data.data.stake, Bets : 1}})
    if(!user){
        return next(new AppError("There is no user with that id", 404))
    }
    await userModel.updateMany({ _id: { $in: user.parentUsers } }, {$inc:{balance: -data.data.stake, downlineBalance: -data.data.stake}})
    let whiteLabelParent
    if(user.parentUsers.length < 1){
        whiteLabelParent = await userModel.findById(user.parentUsers[0])
    }else{
        whiteLabelParent = await userModel.findById(user.parentUsers[1])
    }
    console.log(whiteLabelParent)

}

module.exports = placeBet