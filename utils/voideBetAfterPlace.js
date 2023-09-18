const userModel = require('../model/userModel');
const accountStatementModel = require("../model/accountStatementByUserModel");
const betmodel = require('../model/betmodel');


async function voidBET(data){
 console.log(data, 444)  
 let loginUser = await userModel.findOne({userName:data.LOGINDATA.LOGINUSER.userName}).select('+password'); 
 if(!loginUser || !(await loginUser.correctPassword(data.data.password, loginUser.password))){
    return 'please provide a valid password'
}else{
    let allBetWithMarketId = await betmodel.find({marketId:data.id})
    console.log(allBetWithMarketId)
}
//  return "WORKING"
}


module.exports = voidBET