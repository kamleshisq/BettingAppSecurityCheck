const User = require('../model/userModel');
const accountStatementModel = require("../model/accountStatementByUserModel");
const Bet = require('../model/betmodel');
const settlementHistory = require('../model/settelementHistory')

async function voidBET(data){
 console.log(data, 444)  
 let loginUser = await User.findOne({userName:data.LOGINDATA.LOGINUSER.userName}).select('+password'); 
 if(!loginUser || !(await loginUser.correctPassword(data.data.password, loginUser.password))){
    return 'please provide a valid password'
}else{
    let allBetWithMarketId = await Bet.find({marketId:data.id})
    // console.log(allBetWithMarketId)
    let dataForHistory = {
        marketID:`${data.id}`,
        userId:`${data.LOGINDATA.LOGINUSER._id}`,
        eventName: `${allBetWithMarketId[0].match}`,
        date:Date.now(),
        result:"Cancel Bet",
        marketName : `${allBetWithMarketId[0].marketName}`,
        remark:data.data.remark
      }
    //   await settlementHistory.create(dataForHistory)
    console.log(dataForHistory, 121212)
    for(const bets in allBetWithMarketId){
        console.log(allBetWithMarketId[bets])
        console.log(allBetWithMarketId[bets].id)
        // await Bet.findByIdAndUpdate(allBetWithMarketId[bets].id)
    }
}
//  return "WORKING"
}


module.exports = voidBET