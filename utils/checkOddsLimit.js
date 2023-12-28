const cricketAndOtherSport = require('../utils/getSportAndCricketList');
const betLimitModel = require('../model/betLimitModel');



async function checkLimit(data){
    if(data.eventId){
        let Sports = await cricketAndOtherSport()
        let cricketList = Sports[0].gameList[0].eventList
        let footballList = Sports[1].gameList.find(item => item.sportId == 1)
        footballList = footballList.eventList
        let tennisList = Sports[1].gameList.find(item => item.sportId == 2)
        tennisList = tennisList.eventList
        let allData = cricketList.concat(footballList, tennisList)
        let thatMatch = allData.find(item => item.eventData.eventId == data.eventId)
        if(thatMatch){
            let IDS = [...new Set(data.ids)];
            let sport_name
            if(thatMatch.eventData.sportId == 4){
                sport_name = 'Cricket'
            }else if(thatMatch.eventData.sportId == 1){
                sport_name = "Football"
            }else if (thatMatch.eventData.sportId == 2){
                sport_name = "Tennis"
            }
        
            let betLimit = await betLimitModel.findOne({type:liveBetGame.eventData.name})
            if(!betLimit){
                betLimit = await betLimitModel.findOne({type:liveBetGame.eventData.league})
                if(!betLimit){
                    betLimit = await betLimitModel.findOne({type:sport_name})
                    if(!betLimit){
                        betLimit = await betLimitModel.findOne({type:'Sport'})
                        if(!betLimit){
                            betLimit = await betLimitModel.findOne({type:'Home'})
                        }
                    }
                }
            }

            console.log(betLimit, "gotHERE")

        }else{
            return 'ERR'
        }
    }else{
        return 'ERR'
    }
}

module.exports = checkLimit