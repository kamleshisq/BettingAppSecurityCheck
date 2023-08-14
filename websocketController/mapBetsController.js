const userModel = require("../model/userModel");
const AccModel = require("../model/accountStatementByUserModel");
const betModel = require("../model/betmodel");


exports.mapbet = async(data) => {
    console.log(data)
    let bets = await betModel.find({marketId:`${data.id}`})
    bets.forEach(bet => {
        console.log(bet, 121212)
    });
}