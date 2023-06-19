const cron = require('node-cron');
const catchAsync = require('../utils/catchAsync'); 
const betModel = require('../model/betmodel');
const accModel = require('../model/accountStatementByUserModel');
const userModel = require("../model/userModel");

module.exports = () => {
    cron.schedule('*/5 * * * * *', async() => {
        const openBets = await betModel.find({status:"OPEN"});
        const marketIds = [...new Set(openBets.map(item => item.marketId))];
        console.log(marketIds)
    })
}