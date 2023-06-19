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
        // console.log(result.data.length)
        if(result.data.length != 0){
            let data = marketIds.map(item => result.data.find(item1 => item1.mid(item)))
            console.log(data)
        }

    })
}