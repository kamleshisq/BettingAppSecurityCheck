let User = require('../model/userModel');
let accModel = require('../model/accountStatementByUserModel');
let Bet = require('../model/betmodel');
let settlementHistory = require("../model/settelementHistory");


async function rollBack(data){
    console.log(data, "rollBack Data")
}


module.exports = rollBack