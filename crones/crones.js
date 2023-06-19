const cron = require('node-cron');
const catchAsync = require('../utils/catchAsync'); 
const betModel = require('../model/betmodel');
const accModel = require('../model/accountStatementByUserModel');
const userModel = require("../model/userModel");

module.exports = () => {
    cron.schedule('*/5 * * * * *', async() => {
        const openBets = await betModel.find({status:"OPEN"});
        const marketIds = [...new Set(openBets.map(item => item.marketId))];
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
            marketIds.forEach(async(marketIds) => {
                const marketresult = result.find(item => item.mid === marketIds)
                let betsWithMarketId = await betModel.find({status:"OPEN", marketId : marketresult.mid});

                
            });
            

            
        }

    })
}