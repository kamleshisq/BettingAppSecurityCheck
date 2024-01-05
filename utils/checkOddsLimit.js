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
            
            // let betLimit = await betLimitModel.findOne({type:thatMatch.eventData.name})
            // if(!betLimit){
            //     betLimit = await betLimitModel.findOne({type:thatMatch.eventData.league})
            //     if(!betLimit){
            //         betLimit = await betLimitModel.findOne({type:sport_name})
            //         if(!betLimit){
            //             betLimit = await betLimitModel.findOne({type:'Sport'})
            //             if(!betLimit){
            //                 betLimit = await betLimitModel.findOne({type:'Home'})
            //             }
            //         }
            //     }
            // }


            let betLimit = await betLimitModel.findOne({ type: thatMatch.eventData.name });

const checkAndAssign = async (type) => {
    const tempBetLimit = await betLimitModel.findOne({ type });
    if (tempBetLimit) {
        Object.keys(tempBetLimit._doc).forEach(field => {
            if (betLimit[field] === 0 && tempBetLimit[field] !== 0) {
                betLimit[field] = tempBetLimit[field];
            }
        });
    }
};

const checkAndUpdateIfZero = async (type) => {
    const tempBetLimit = await betLimitModel.findOne({ type });
    if (tempBetLimit) {
        Object.keys(tempBetLimit._doc).forEach(field => {
            if (betLimit[field] === 0 && tempBetLimit[field] !== 0) {
                betLimit[field] = tempBetLimit[field];
            }
        });
    }
};

if (!betLimit || Object.values(betLimit).some(value => value === 0)) {
    await checkAndUpdateIfZero(thatMatch.eventData.league);
    if (!betLimit || Object.values(betLimit).some(value => value === 0)) {
        await checkAndUpdateIfZero(sport_name);
        if (!betLimit || Object.values(betLimit).some(value => value === 0)) {
            await checkAndUpdateIfZero('Sport');
            if (!betLimit || Object.values(betLimit).some(value => value === 0)) {
                await checkAndUpdateIfZero('Home');
            }
        }
    }
}

// Now betLimit should contain the desired values with only zero fields taken from upper levels.

// Now betLimit should contain the desired values with only zero fields taken from upper levels.


            console.log(betLimit, "betLimitbetLimitbetLimit")


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
                        if(marketsDetails.data.items[i].title && !marketsDetails.data.items[i].title.toLowerCase().startsWith('book') && !marketsDetails.data.items[i].title.toLowerCase().startsWith('toss') && !marketsDetails.data.items[i].title.toLowerCase().startsWith('winn')){
                            // console.log(marketsDetails.data.items[i].market_id.endsWith('OE'))
                            if(!marketsDetails.data.items[i].title.startsWith("Only") && marketsDetails.data.items[i].title.includes("Over") && !marketsDetails.data.items[i].market_id.endsWith('OE')){
                                thatMarketLimit = await betLimitModel.findOne({type:`${thatMatch.eventData.eventId}_session`})
                                // console.log('WORKING3')
                            }else if (marketsDetails.data.items[i].title.startsWith("Only") && !marketsDetails.data.items[i].market_id.endsWith('OE')){
                                thatMarketLimit = await betLimitModel.findOne({type:`${thatMatch.eventData.eventId}_onlyOver`})
                                // console.log('WORKING2')
                            }else if (!marketsDetails.data.items[i].title.includes("Over") && !marketsDetails.data.items[i].market_id.endsWith('OE')){
                                thatMarketLimit = await betLimitModel.findOne({type:`${thatMatch.eventData.eventId}_w_p_market`})
                                // console.log('WORKING1')
                            }else if (marketsDetails.data.items[i].market_id.endsWith('OE')){
                                thatMarketLimit = await betLimitModel.findOne({type:`${thatMatch.eventData.eventId}_odd_even`})
                                // console.log(thatMarketLimit, "thatMarketLimitthatMarketLimitthatMarketLimit")
                            }else{
                                thatMarketLimit = betLimit
                            }
                            // console.log(thatMarketLimit)
                            if(!thatMarketLimit){
                                thatMarketLimit = betLimit
                            }
                        }else{
                            thatMarketLimit = betLimit
                        }
                    }
                    pushData.Limits = thatMarketLimit
                    sendData.push(pushData)
                }
                // console.log(sendData, "hghg")
                return sendData
            }else{
                return 'ERR'
            }

        }else{
            return 'ERR'
        }
    }else{
        return 'ERR'
    }
}

module.exports = checkLimit