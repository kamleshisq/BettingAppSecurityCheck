const User = require('../model/userModel');
const Bet = require('../model/betmodel');
const runnerDataModel = require('../model/runnersData');


async function checkExpoOfThatMarket( bet ){
   let WinAmount = 0
   if(bet.secId.toLowerCase().startsWith('odd_even')){
    if(bet.marketId.slice(-2).startsWith('OE')){
        let betDetails = await Bet.aggregate([
            {
                $match : {
                    status: "OPEN",
                    marketId : bet.marketId,
                    userName:bet.userName
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
        // socket.emit('getFancyBookDATAuserSide', {betDetails:betDetails[0].data, status:'ODD'})
    }else{
        let betDetails = await Bet.aggregate([
            {
                $match : {
                    status: "OPEN",
                    marketId : bet.marketId,
                    userName:bet.userName
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
        // console.log(betDetails[0].data, "betDetailsbetDetailsbetDetails")
        let dataToshow = []
        if(betDetails.length != 0){
            betDetails = betDetails[0]
            for(let i = 0; i < betDetails.uniqueRuns.length; i++){ 
                if(betDetails.uniqueRuns.length === 1){
                    let data1 = {}
                    data1.message = `${betDetails.uniqueRuns[i] - 1} or less`
                    let sum = 0
                    for(let j = 0; j < betDetails.data[0].length; j++){
                        if(betDetails.data[0][j].secId === "odd_Even_No"){
                            sum += betDetails.data[0][j].totalWinAmount
                        }else{
                            sum += betDetails.data[0][j].totalAmount
                        }
                    }
                    data1.sum = sum
                    dataToshow.push(data1)
                    let data2 = {}
                    let sum2 = 0
                    data2.message = `${betDetails.uniqueRuns[i]} or more`
                    for(let j = 0; j < betDetails.data[0].length; j++){
                        if(betDetails.data[0][j].secId === "odd_Even_Yes"){
                            sum2 += betDetails.data[0][j].totalWinAmount
                        }else{
                            sum2 += betDetails.data[0][j].totalAmount
                        }
                    }
                    data2.sum = sum2
                    dataToshow.push(data2)
                }else{
                    if(i === 0){
                        let data = {}
                        data.message = `${betDetails.uniqueRuns[i] - 1} or less`
                        let sum = 0
                        for(let j = 0; j < betDetails.data[0].length; j++){
                            if(betDetails.data[0][j].secId === "odd_Even_No" && betDetails.data[0][j].runs >= (betDetails.uniqueRuns[i])){
                                sum += betDetails.data[0][j].totalWinAmount
                            }else{
                                sum += betDetails.data[0][j].totalAmount
                            }
                        }
                        data.sum = sum
                        dataToshow.push(data)
                    }else if (i === (betDetails.uniqueRuns.length - 1)){
                        let data = {}
                        let data1 = {}
                        if(betDetails.uniqueRuns[i - 1] == (betDetails.uniqueRuns[i] - 1)){
                            data.message = `${betDetails.uniqueRuns[i - 1]}`
                        }else{
                            data.message = `between ${betDetails.uniqueRuns[i - 1]} and ${betDetails.uniqueRuns[i] - 1}`
                        }
                        let sum = 0
                        for(let j = 0; j < betDetails.data[0].length; j++){
                            if(betDetails.data[0][j].secId === "odd_Even_No" && betDetails.data[0][j].runs == betDetails.uniqueRuns[i]){
                                sum += betDetails.data[0][j].totalWinAmount
                            }else if (betDetails.data[0][j].secId === "odd_Even_Yes" && betDetails.data[0][j].runs == betDetails.uniqueRuns[i - 1]){
                                sum += betDetails.data[0][j].totalWinAmount
                            }
                            else{
                                sum += betDetails.data[0][j].totalAmount
                            }
                        }
                        data.sum = sum
                        dataToshow.push(data)
                        let sum2 = 0
                        data1.message = `${betDetails.uniqueRuns[i]} or more`
                        for(let j = 0; j < betDetails.data[0].length; j++){
                            if(betDetails.data[0][j].secId === "odd_Even_Yes" && betDetails.data[0][j].runs <= betDetails.uniqueRuns[i]){
                                sum2 += betDetails.data[0][j].totalWinAmount
                            }
                            else{
                                sum2 += betDetails.data[0][j].totalAmount
                            }
                        }
                        data1.sum = sum2
                        dataToshow.push(data1)
                    }else{
                        let data = {}
                        if(betDetails.uniqueRuns[i - 1] == (betDetails.uniqueRuns[i] - 1)){
                            data.message = `${betDetails.uniqueRuns[i] - 1}`
                        }else{
                            data.message = `between ${betDetails.uniqueRuns[i - 1]} and ${betDetails.uniqueRuns[i] - 1}`
                        }
                        let sum = 0
                        for(let j = 0; j < betDetails.data[0].length; j++){
                            if(betDetails.data[0][j].secId === "odd_Even_No" && betDetails.data[0][j].runs == betDetails.uniqueRuns[i]){
                                sum += betDetails.data[0][j].totalWinAmount
                            }else if (betDetails.data[0][j].secId === "odd_Even_Yes" && betDetails.data[0][j].runs == betDetails.uniqueRuns[i - 1]){
                                sum += betDetails.data[0][j].totalWinAmount
                            }
                            else{
                                sum += betDetails.data[0][j].totalAmount
                            }
                        }
                        data.sum = sum
                        dataToshow.push(data)
                    }
                }
            }
        }
        // socket.emit('getFancyBookDATAuserSide', {dataToshow, status:'Fancy'})
    }
   }else{
    
   }
    console.log(WinAmount, "WinAmountWinAmountWinAmountWinAmount")
    return WinAmount
}


module.exports = checkExpoOfThatMarket