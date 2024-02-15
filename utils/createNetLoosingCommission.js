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


async function commisiion(data){
    let commissionMarket = await commissionMarketModel.find()
    let usercommissiondata3
    if(commissionMarket.some(item => (item.marketId == data.marketId))){
        console.log('in commission market')
        // let newfilterUser = await commissionModel.distinct('userId', {"Bookmaker.type":'NET_LOSS'});

    //   let filterUser = await commissionModel.find({"Bookmaker.type":'NET_LOSS'})
    //   let newfilterUser = filterUser.map(ele => {
    //       return ele.userId
    //   })
    
    // console.log(newfilterUser,'newfilterUser')
      let netLossingCommission = await betModel.aggregate([
        {
          $match:{
              marketName : new RegExp('(book|toss)','i'),
              match: `${data.match}`,
            //   userId:{$in:newfilterUser},
              marketId:`${data.marketId}`,
              status:{$in:['WON','LOSS']},
              commionstatus:true
          }
        },
        {
          $group:{
              _id:'$userName',
              returns:{
                $sum:'$returns'
              },
              userId:{$first:'$userId'},
              eventId:{$first:'$eventId'},
              gameId:{$first:'$gameId'},
              event:{$first:'$event'},
              marketId:{$first:'$marketId'},
              match:{$first:'$match'},
              eventDate:{$first:'$eventDate'},
              marketName:{$first:'$marketName'}
          }
      }
      ]);

      
     
   
        console.log(netLossingCommission,'netlossingcommission test')
                       
        for(let i = 0;i<netLossingCommission.length;i++) {
              function generateUniqueId() {
                const timestamp = netLossingCommission[i].marketId;
                const randomString = netLossingCommission[i]._id;
                return `${timestamp}-${randomString}`;
              }
            let uniqueId = generateUniqueId()
          let user = await userModel.findById(netLossingCommission[i].userId)
          try{
                  let commission = await commissionModel.find({userId:netLossingCommission[i].userId})
                  let commissionPer = 0
                  if (commission[0] &&commission[0].Bookmaker.type && commission[0].Bookmaker.type == "NET_LOSS" && commission[0].Bookmaker.status){
                      commissionPer = commission[0].Bookmaker.percentage
                  }
                  let commissionCoin = ((commissionPer * netLossingCommission[i].returns)/100).toFixed(4)
                  if(commissionPer > 0 && commissionCoin < 0){
                      let commissiondata = {
                          userName : user.userName,
                          userId : user._id,
                          eventId : netLossingCommission[i].eventId,
                          sportId : netLossingCommission[i].gameId,
                          seriesName : netLossingCommission[i].event,
                          marketId : netLossingCommission[i].marketId,
                          eventDate : new Date(netLossingCommission[i].eventDate),
                          eventName : netLossingCommission[i].match,
                          commission : commissionCoin * -1,
                          upline : 100,
                          commissionType: 'Net Losing Commission',
                          commissionPercentage:commissionPer,
                          date:Date.now(),
                          marketName:netLossingCommission[i].marketName,
                          loginUserId:user._id,
                          parentIdArray:user.parentUsers,
                          uniqueId
                      }
                      usercommissiondata3 = await newCommissionModel.create(commissiondata)
                  }
          }catch(err){
              console.log(err)
          }
   
          try{
            let uplinePlCOMMIDDDION = 0
            for(let j = 1; j < user.parentUsers.length; j++){
              let childUser = await userModel.findById(user.parentUsers[j])
              let parentUser2Amount = new Decimal(childUser.Share).times(Math.abs(netLossingCommission[i].returns)).dividedBy(100);
              let thatUserWinAmount = Math.abs(parentUser2Amount) + uplinePlCOMMIDDDION
              let commissionChild = await commissionModel.find({userId:user.parentUsers[j]})
              if(commissionChild.length > 0){
                let commissionPer = 0
                if (commissionChild[0] && commissionChild[0].Bookmaker &&commissionChild[0].Bookmaker.type == "NET_LOSS" && commissionChild[0].Bookmaker.status){
                    commissionPer = commissionChild[0].Bookmaker.percentage
                }
                console.log(commissionPer, thatUserWinAmount, childUser.userName)
                let commissionCoin = ((commissionPer * thatUserWinAmount)/100).toFixed(4)
                if(commissionPer > 0){
                  let commissiondata = {
                      userName : childUser.userName,
                      userId : user.parentUsers[j],
                      eventId : netLossingCommission[i].eventId,
                      sportId : netLossingCommission[i].gameId,
                      seriesName : netLossingCommission[i].event,
                      marketId : netLossingCommission[i].marketId,
                      eventDate : new Date(netLossingCommission[i].eventDate),
                      eventName : netLossingCommission[i].match,
                      commission : commissionCoin,
                      upline : 100,
                      commissionType: 'Net Losing Commission',
                      commissionPercentage:commissionPer,
                      date:Date.now(),
                      marketName:netLossingCommission[i].marketName,
                      uniqueId,
                      loginUserId:user._id,
                      parentIdArray:childUser.parentUsers,
                  }
                  let commissionData = await newCommissionModel.create(commissiondata)
                }
              }
              uplinePlCOMMIDDDION = Math.abs(uplinePlCOMMIDDDION) +  Math.abs(parentUser2Amount)
            }
          }catch(err){
              console.log(err)
          }
        }
  
        
        // await betModel.updateMany({
        //     marketName : new RegExp('book','i'),
        //     match: `${data.match}`,
        //     userId:{$in:newfilterUser},
        //     marketId:`${data.marketId}`,
        //     status:{$in:['WON','LOSS']},
        //     commissionStatus:false
        // },{commissionStatus:true})
        console.log('net losing commission ended')
    }
}


module.exports = commisiion