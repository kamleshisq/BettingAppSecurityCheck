const cron = require('node-cron');
const betModel = require('../model/betmodel');
const accModel = require('../model/accountStatementByUserModel');
const userModel = require("../model/userModel");
const Decimal = require('decimal.js');


module.exports = () => { 
    cron.schedule('*/5 * * * * *', async() => { 
        console.log('WORKING 123456879')
        let currentDate = new Date();
        let oneDayAgo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
        console.log("Current Date:", currentDate);
        console.log("One Day Ago:", oneDayAgo);
    })
}