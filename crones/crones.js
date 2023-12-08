const cron = require('node-cron');
const betModel = require('../model/betmodel');
const accModel = require('../model/accountStatementByUserModel');
const userModel = require("../model/userModel");
const commissionRepportModel = require("../model/commissionReport");
const netCommission = require("../model/netCommissionModel");
const commissionModel = require("../model/CommissionModel");
const commissionMarketModel = require("../model/CommissionMarketsModel");
const newCommissionModel = require('../model/commissioNNModel');
const Decimal = require('decimal.js');
const runnerDataModel = require('../model/runnersData');
const autoSettleCheck = require('../model/sattlementModel');

module.exports = () => {
    cron.schedule('*/5 * * * * *', async() => {
        console.log("Working")
        let check = await autoSettleCheck.findOne({userName: 'admin'})
        if(check && check.status){
        let openBetsMarketIds = await betModel.distinct('marketId', {status: 'OPEN'})

        const fullUrl = 'https://admin-api.dreamexch9.com/api/dream/markets/result';
        let result;
        await fetch(fullUrl, {
            method:'POST',
            headers: { 
                'Content-Type': 'application/json',
                'accept': 'application/json'
                },
            body:JSON.stringify(marketIds)
        }).then(res =>res.json())
        .then(data => {
            result = data
        })
        if(result.data.length != 0){
            console.log(result.data)
        }
        }
    })
}