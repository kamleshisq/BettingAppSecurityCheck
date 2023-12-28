const cricketAndOtherSport = require('../utils/getSportAndCricketList');



async function checkLimit(data){
    let Sports = await cricketAndOtherSport()
    let cricketList = Sports[0].gameList[0].eventList
    let footballList = Sports[1].gameList.find(item => item.sportId == 1)
    footballList = footballList.eventList
    let tennisList = Sports[1].gameList.find(item => item.sportId == 2)
    tennisList = tennisList.eventList
    let allData = cricketList.concat(footballList, tennisList)
    let thatMatch = allData.filter(item => item.eventData.eventId == data.eventId)
    console.log(data,thatMatch, "GOtHERE")
}

module.exports = checkLimit