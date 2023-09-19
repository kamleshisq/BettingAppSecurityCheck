let User = require('../model/userModel');
let accModel = require('../model/accountStatementByUserModel');
let Bet = require('../model/betmodel');
let settlementHistory = require("../model/settelementHistory");


async function rollBack(data){
    // console.log(data, "rollBack Data")
    let loginUser = await User.findOne({userName:data.LOGINDATA.LOGINUSER.userName}).select('+password');
    if(!loginUser || !(await loginUser.correctPassword(data.data.password, loginUser.password))){
        return 'please provide a valid password'
    }else{ 
        let allBetWithMarketId = await Bet.find({marketId:data.id})
        console.log(allBetWithMarketId)
    } 
}


module.exports = rollBack