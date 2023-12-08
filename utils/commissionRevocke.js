let User = require('../model/userModel');
let accountStatementModel = require('../model/accountStatementByUserModel');
let Bet = require('../model/betmodel');
let settlementHistory = require("../model/settelementHistory");
const InprogressModel = require('../model/InprogressModel');
const commissionNewModel = require('../model/commissioNNModel');
let Decimal = require('decimal.js');


async function revokeCommission(data){
    console.log(data)
}

module.exports = revokeCommission