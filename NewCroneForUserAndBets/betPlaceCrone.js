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
    cron.schedule('*/5 * * * * *', async() => { 
        try{
            console.log('betCrone')
            let sportData = await sportData()
            const cricket = sportData[0].gameList[0].eventList.sort((a, b) => a.eventData.time - b.eventData.time);
            console.log(cricket)

        }catch(err){
            console.log(err)
        }
    })}