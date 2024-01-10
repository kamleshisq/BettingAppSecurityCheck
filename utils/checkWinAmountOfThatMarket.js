const User = require('../model/userModel');
const Bet = require('../model/betmodel');
const runnerData = require('../model/runnersData');


async function checkExpoOfThatMarket( bet ){
    console.log(bet, 123456789)
    let WinAmount = 0
    if(bet.secId.toLowerCase().startsWith('odd_even')){
        if(bet.marketId.endsWith('OE')){
            const exposure1 = await Bet.aggregate([
                {
                    $match: {
                        status: "OPEN",
                        userName:bet.userName,
                        marketId:bet.marketId
                        
                    }
                },
                {
                    $group: { 
                        _id: {
                            "secId":"$secId",
                        },
                        totalAmount: { 
                            $sum: '$returns'
                        },
                        totalWinAmount:{
                            $sum: { 
                                $cond : {
                                    if : {$eq: ["$secId", "odd_Even_Yes"]},
                                then:{
                                    $divide: [{ $multiply: ["$oddValue", "$Stake"] }, 100]
                                },
                                else:"$Stake"
                                }
                            }
                        }
                    }
                },
                {
                    $group: {
                      _id: null,
                      data: {
                        $push: {
                          _id: "$_id.secId",
                          totalAmount: {
                            $multiply:["$totalAmount", 1]
                          },
                          totalWinAmount: {
                            $multiply:["$totalWinAmount", 1]
                          }
                        }
                      }
                    }
                  },
                  {
                    $project: {
                      _id: 0,
                      data: {
                        $map: {
                          input: "$data",
                          as: "item",
                          in: {
                            _id: "$$item._id",
                            totalAmount: "$$item.totalAmount",
                            totalWinAmount: "$$item.totalWinAmount",
                            totalWinAmount2: {
                              $add: ["$$item.totalWinAmount", {
                                $reduce: { 
                                    input: "$data",
                                    initialValue: 0,
                                    in: {
                                        $cond: {
                                            if: {
                                                $ne: ["$$this._id", "$$item._id"] 
                                            },
                                            then: { $add: ["$$value", "$$this.totalAmount"] },
                                            else: {
                                                $add: ["$$value", 0] 
                                            }
                                        }
                                    }
                                }
                              }]
                            }
                          }
                        }
                      }
                    }
                  }
            ])


            console.log(exposure1[0].data, "exposure1exposure1exposure1")
        }
    }else{

    }
}


module.exports = checkExpoOfThatMarket