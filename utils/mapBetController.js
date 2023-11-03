const userModel = require('../model/userModel');
const accModel = require('../model/accountStatementByUserModel');
const betModel = require('../model/betmodel');
const commissionModel = require('../model/CommissionModel');
const commissionMarketModel = require('../model/CommissionMarketsModel');
const settlementHistory = require('../model/settelementHistory');
const InprogressModel = require('../model/InprogressModel');
const newCommissionModel = require('../model/commissioNNModel');
const Decimal = require('decimal.js');
const runnerDataModel = require("../model/runnersData");


async function mapBet(data){
    console.log(data, "datadatadata1234564879")
    let childrenUsername = []
    let operatorId;
    if(data.LOGINDATA.LOGINUSER.roleName == 'Operator'){
        childrenUsername = await userModel.distinct('userName', {parentUsers:data.LOGINDATA.LOGINUSER.parent_id});
        operatorId = data.LOGINDATA.LOGINUSER.parent_id
      }else{
        childrenUsername = await userModel.distinct('userName', {parentUsers:data.LOGINDATA.LOGINUSER._id});
        operatorId = data.LOGINDATA.LOGINUSER._id
      }

      let bets = await betModel.aggregate([
        {
            $match:{
                marketId:`${data.id}`,
                status:"MAP",
                userName:{$in:childrenUsername}
            }
        },
      ])

// FOR DUMMY TABLE
    let InProgress = await InprogressModel.findOne({marketId : bets[0].marketId, progressType:'SettleMent'})
    if(InProgress === null){
        try{

            let inprogressData = {
              eventId : bets[0].eventId,
              marketId: bets[0].marketId,
              length: bets.length,
              marketName: bets[0].marketName,
              progressType:'SettleMent'
            }
            InProgress = await InprogressModel.create(inprogressData)
        }catch(err){
            console.log(err)
        }
    }


    //FOR SATTLEMENT HISTORY



    let dataForHistory = {
        marketID:`${data.id}`,
        userId:`${operatorId}`,
        eventName: `${bets[0].match}`,
        date:Date.now(),
        result:data.result,
        marketName : `${bets[0].marketName}`
      }
      await settlementHistory.create(dataForHistory)

      

      try{ 
        for(const bet in bets){ 
            console.log(bet, "betbetbet")
        }

      }catch(err){
        console.log(err)
        return 'Please try again leter'
      }
}

module.exports = mapBet