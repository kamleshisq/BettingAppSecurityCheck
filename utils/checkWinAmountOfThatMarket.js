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
            if(exposure1.length > 0){
                for(let i = 0; i < exposure1[0].data.length; i++){
                    if(exposure1[0].data[i]._id === bet.secId){
                        exposure1[0].data[i].totalWinAmount2 =  parseFloat(exposure1[0].data[i].totalWinAmount2) + parseFloat(bet.WinAmount)
                    }else{
                        exposure1[0].data[i].totalWinAmount2 =  parseFloat(exposure1[0].data[i].totalWinAmount2) - parseFloat(bet.exposure)
                    }
                }
                WinAmount = exposure1[0].data.reduce((max, current) => 
                current.totalWinAmount2 > max.totalWinAmount2 ? current : max,
                { totalWinAmount2: -Infinity }
              );
              WinAmount = WinAmount.totalWinAmount2
            }
           
        }else{
            let betDetails = await Bet.aggregate([
                {
                    $match: {
                        status: "OPEN",
                        userName:bet.userName,
                        marketId:bet.marketId   
                    }
                },
                {
                    $addFields: {
                      runs: {
                        $toInt: {
                          $arrayElemAt: [
                            { $split: ["$selectionName", "@"] },
                            1 
                          ]
                        }
                      }
                    }
                },
                {
                    $group: { 
                        _id: {
                            "secId":"$secId",
                            "runs":"$runs"
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
                    $project:{
                        _id:0,
                        secId: "$_id.secId",
                        runs: "$_id.runs",
                        totalAmount:"$totalAmount",
                        totalWinAmount:"$totalWinAmount",
                    }
                },
                {
                    $group: {
                      _id: null,
                      uniqueRuns: { $addToSet: "$runs" },
                      data: { $push: "$$ROOT" } 
                    }
                },
                {
                    $project: {
                      _id: 0, 
                      uniqueRuns: 1,
                      data: 1 
                    }
                  },
                  {
                    $unwind: "$uniqueRuns" 
                  },
                  {
                    $sort: {
                      "uniqueRuns": 1 
                    }
                  },
                  {
                    $group: {
                      _id: null,
                      uniqueRuns: { $push: "$uniqueRuns" },
                      data: { $push: "$data" }
                    }
                  },
            ])


            console.log(betDetails, betDetails[0].data, "betDetailsbetDetailsbetDetails")
        }
    }else{

    }

    console.log(WinAmount, "WinAmountWinAmountWinAmountWinAmount")
    return WinAmount
}


module.exports = checkExpoOfThatMarket