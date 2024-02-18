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
            // console.log('gotHERE')

            let betLimit = await betLimitModel.findOne({ type: thatMatch.eventData.name });

            const checkAndUpdateIfZero = async (type) => {
                const tempBetLimit = await betLimitModel.findOne({ type });
                if (tempBetLimit) {
                    if(betLimit){
                        if (betLimit.max_stake === 0 && tempBetLimit.max_stake !== 0) {
                            betLimit.max_stake = tempBetLimit.max_stake;
                        }
                        if (betLimit.max_profit === 0 && tempBetLimit.max_profit !== 0) {
                            betLimit.max_profit = tempBetLimit.max_profit;
                        }
                        if (betLimit.max_odd === 0 && tempBetLimit.max_odd !== 0) {
                            betLimit.max_odd = tempBetLimit.max_odd;
                        }
                        if (betLimit.delay === 0 && tempBetLimit.delay !== 0) {
                            betLimit.delay = tempBetLimit.delay;
                        }
                        if (betLimit.min_stake === 0 && tempBetLimit.min_stake !== 0) {
                            betLimit.min_stake = tempBetLimit.min_stake;
                        }
                    }else{
                        betLimit = tempBetLimit
                    }
                }
            };

            if (!betLimit || (betLimit && (betLimit.max_stake === 0 || betLimit.max_profit === 0 || betLimit.max_odd === 0 || betLimit.delay === 0 || betLimit.min_stake === 0))) {
                await checkAndUpdateIfZero(thatMatch.eventData.league);
                await checkAndUpdateIfZero(sport_name);
                await checkAndUpdateIfZero('Sport');
                await checkAndUpdateIfZero('Home');
            }


            // console.log(betLimit, "betLimitbetLimitbetLimit")


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
                            }else{
                                if (thatMarketLimit.max_stake === 0 && betLimit.max_stake !== 0) {
                                    thatMarketLimit.max_stake = betLimit.max_stake;
                                }
                                if (thatMarketLimit.max_profit === 0 && betLimit.max_profit !== 0) {
                                    thatMarketLimit.max_profit = betLimit.max_profit;
                                }
                                if (thatMarketLimit.max_odd === 0 && betLimit.max_odd !== 0) {
                                    thatMarketLimit.max_odd = betLimit.max_odd;
                                }
                                if (thatMarketLimit.delay === 0 && betLimit.delay !== 0) {
                                    thatMarketLimit.delay = betLimit.delay;
                                }
                                if (thatMarketLimit.min_stake === 0 && betLimit.min_stake !== 0) {
                                    thatMarketLimit.min_stake = betLimit.min_stake;
                                }
                            }
                        }else{
                            thatMarketLimit = betLimit
                        }
                    }else{
                        if (thatMarketLimit.max_stake === 0 && betLimit.max_stake !== 0) {
                            thatMarketLimit.max_stake = betLimit.max_stake;
                        }
                        if (thatMarketLimit.max_profit === 0 && betLimit.max_profit !== 0) {
                            thatMarketLimit.max_profit = betLimit.max_profit;
                        }
                        if (thatMarketLimit.max_odd === 0 && betLimit.max_odd !== 0) {
                            thatMarketLimit.max_odd = betLimit.max_odd;
                        }
                        if (thatMarketLimit.delay === 0 && betLimit.delay !== 0) {
                            thatMarketLimit.delay = betLimit.delay;
                        }
                        if (thatMarketLimit.min_stake === 0 && betLimit.min_stake !== 0) {
                            thatMarketLimit.min_stake = betLimit.min_stake;
                        }
                    }
                    pushData.Limits = thatMarketLimit
                    sendData.push(pushData)
                }
                console.log(sendData, "hghg")
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