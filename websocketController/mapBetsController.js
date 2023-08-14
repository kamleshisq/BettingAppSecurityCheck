const userModel = require("../model/userModel");
const AccModel = require("../model/accountStatementByUserModel");
const betModel = require("../model/betmodel");


exports.mapbet = (data) => {
    let bets = betModel.find({marketId:`${data.id}`})
    console.log(bets)
}