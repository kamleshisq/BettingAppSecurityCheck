const cron = require('node-cron');
const betModel = require('../model/betmodel');
const accModel = require('../model/accountStatementByUserModel');
const userModel = require("../model/userModel");
const commissionRepportModel = require("../model/commissionReport");
const netCommission = require("../model/netCommissionModel");
const commissionModel = require("../model/CommissionModel");
const commissionMarketModel = require("../model/CommissionMarketsModel");
const marketDetailsBymarketID = require("../utils/getmarketsbymarketId");
const Decimal = require('decimal.js');
const sportData = require('../utils/getSportAndCricketList');


module.exports = () => {
    cron.schedule('*/10 * * * * *', async() => { 
        try{
            let MarketIds = []
            let betDetailsArray = []
            console.log('betCrone')
            let sportData1 = await sportData()
            const cricket = sportData1[0].gameList[0].eventList.sort((a, b) => a.eventData.time - b.eventData.time);
            // let LiveCricket = cricket.filter(item => item.eventData.type === "IN_PLAY")
            for(gameList in cricket){
                if(cricket[gameList].marketList.match_odd != null){
                    let data = {
                        title : cricket[gameList].eventData.name,
                        eventId : cricket[gameList].eventData.eventId,
                        market : cricket[gameList].marketList.match_odd.marketId,
                        stake : '1000',
                        spoetId : '4'
                    }
                    betDetailsArray.push(data)
                    // console.log(cricket[gameList].marketList.match_odd)
                    MarketIds.push(cricket[gameList].marketList.match_odd.marketId)
                }
            }
            const result = await marketDetailsBymarketID(MarketIds)
            for(i in result.data.items){
                let data = betDetailsArray.find(items => items.market == result.data.items[i].market_id)
                const dataIndex = betDetailsArray.findIndex((item) => item.market === result.data.items[i].market_id);
                if(data){
                    data.odds = result.data.items[i].odds[0].backPrice1
                    data.secId = result.data.items[i].odds[0].selectionId
                    data.bettype2 = 'BACK'
                    betDetailsArray[dataIndex] = data
                }
            }
            let users =  await userModel.find({userName:'qMGvgT8'})
            for(user in users){
                let LOGINDATA = {
                    LOGINUSER : users[user]
                }
                for(j in betDetailsArray){
                    let data = {
                        data : betDetailsArray[j],
                        LOGINDATA
                    }

                    console.log(data)
                }
            }
            
        }catch(err){
            console.log(err)
        }
    })}