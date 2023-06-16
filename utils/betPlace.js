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
        match : data.data.title
    }
    const sportData = await cricketAndOtherSport()
    let gameList
    if(data.data.spoetId == 4){
        gameList = sportData[0].gameList[0].eventList
    }
    let liveBetGame = gameList.find(item => item.eventData.eventId == data.data.eventId);

    console.log(liveBetGame)
    console.log(betPlaceData)

}

module.exports = placeBet