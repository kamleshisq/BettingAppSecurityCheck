const userModel = require("../model/userModel");
const AccModel = require("../model/accountStatementByUserModel");
const betModel = require("../model/betmodel");


exports.mapbet = async(data) => {
    console.log(data)
    let bets = await betModel.find({marketId:`${data.id}`})
    bets.forEach(bet => {
        if(data.result === "yes" || data.result === "no"){

        }else{
            if(bet.selectionName.toLowerCase() === data.result.toLowerCase()){
                console.log("WORKING    ")
            }
        }
    });
}