const cron = require('node-cron');
const betModel = require('../model/betmodel');
const accModel = require('../model/accountStatementByUserModel');
const userModel = require("../model/userModel");
const commissionRepportModel = require("../model/commissionReport");
const netCommission = require("../model/netCommissionModel");
const commissionModel = require("../model/CommissionModel");
const commissionMarketModel = require("../model/CommissionMarketsModel");
const Decimal = require('decimal.js');
const sportData = require('../utils/getSportAndCricketList');


module.exports = () => {
    cron.schedule('*/10 * * * * *', async() => { 
        try{
            console.log('betCrone')
            let sportData1 = await sportData()
            const cricket = sportData1[0].gameList[0].eventList.sort((a, b) => a.eventData.time - b.eventData.time);
            // let LiveCricket = cricket.filter(item => item.eventData.type === "IN_PLAY")
            // console.log(LiveCricket)
            for(gameList in cricket){
                if(cricket[gameList].marketList.match_odd != null){
                    console.log(cricket[gameList].marketList.match_odd)
                }
            }

        }catch(err){
            console.log(err)
        }
    })}