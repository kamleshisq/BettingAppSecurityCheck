const cricketAndOtherSport = require('../utils/getSportAndCricketList');
const betLimitModel = require('../model/betLimitModel');
const getmarketDetails = require('../utils/getmarketsbymarketId');



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
        
            let betLimit = await betLimitModel.findOne({type:thatMatch.eventData.name})
            if(!betLimit){
                betLimit = await betLimitModel.findOne({type:thatMatch.eventData.league})
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

            // console.log(betLimit, "gotHERE")
            let marketsDetails = await getmarketDetails(IDS)
            // console.log(marketsDetails.data.items)
            let sendData = []
            if(marketsDetails.data && marketsDetails.data.items){
                for(let i = 0; i < marketsDetails.data.items.length; i++){
                    let pushData = {}
                    pushData.marketId = marketsDetails.data.items[i].market_id
                    let thatMarketLimit = await betLimitModel.findOne({type:marketsDetails.data.items[i].market_id})
                    if(!thatMarketLimit){
                        if(item.title && !item.title.toLowerCase().startsWith('book') && !item.title.toLowerCase().startsWith('toss') && !item.title.toLowerCase().startsWith('winn')){
                            if(!item.title.startsWith("Only") && item.title.includes("Over")){
                                thatMarketLimit = await betLimitModel.findOne({type:`${thatMatch.eventData.eventId}_session`})
                            }else if (item.title.startsWith("Only")){
                                thatMarketLimit = await betLimitModel.findOne({type:`${thatMatch.eventData.eventId}_onlyOver`})
                            }else if (!item.title.includes("Over")){
                                thatMarketLimit = await betLimitModel.findOne({type:`${thatMatch.eventData.eventId}_w_p_market`})
                            }else if (item.market_id.endsWith('OE')){
                                thatMarketLimit = await betLimitModel.findOne({type:`${thatMatch.eventData.eventId}_odd_even`})
                            }else{
                                thatMarketLimit = betLimit
                            }
                        }else{
                            thatMarketLimit = betLimit
                        }
                    }
                    pushData.Limits = thatMarketLimit
                    sendData.push(pushData)
                }
                console.log(sendData, "hghg")
            }

        }else{
            return 'ERR'
        }
    }else{
        return 'ERR'
    }
}

module.exports = checkLimit