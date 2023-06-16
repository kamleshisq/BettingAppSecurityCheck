const userModel = require('../model/userModel');
const betmodel = require('../model/betmodel');
const cricketAndOtherSport = require('../utils/getSportAndCricketList');

async function placeBet(data){
    const sportData = await cricketAndOtherSport()
    let gameList
    if(data.data.spoetId == 4){
        gameList = sportData[0].gameList[0].eventList

    }
    let liveBetGame = gameList.find(item => item.eventData.eventId == data.data.eventId);
    console.log(liveBetGame)

}

module.exports = placeBet