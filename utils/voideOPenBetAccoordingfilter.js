const Bet = require('../model/betmodel');
const User = require('../model/userModel');
const AccModel = require('../model/accountStatementByUserModel');
const settlementHistoryModel = require('../model/settelementHistory');
const InprogressModel = require('../model/InprogressModel');
const Decimal =  require('decimal.js');
const commissionNewModel = require('../model/commissioNNModel');


async function voidbetOPENFORTIMELYVOIDE(data){
    console.log(data, "DATADAT")
}


module.exports = voidbetOPENFORTIMELYVOIDE