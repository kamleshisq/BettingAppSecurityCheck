const User = require('../model/userModel');
const Bet = require('../model/betmodel');
const runnerData = require('../model/runnersData');


async function checkExpoOfThatMarket( bet ){
    console.log(bet, 123456789)
    let WinAmount = parseFloat(bet.WinAmount)
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
            if(betDetails.length > 0){

                let runtopush = parseFloat(bet.selectionName.split('@')[1])
                let objectPUsh = {
                    secId : bet.secId,
                    runs : parseFloat(bet.selectionName.split('@')[1]),
                    totalAmount : parseFloat(bet.exposure),
                    totalWinAmount:parseFloat(bet.WinAmount)
                }
                if(!betDetails[0].uniqueRuns.some(ietm => ietm == runtopush)){
                    betDetails[0].uniqueRuns.push(runtopush)
                    betDetails[0].data[0].push(objectPUsh)
                }else{
                    letnewDATA = betDetails[0].data[0].findIndex(item => item.secId === bet.secId && item.runs == runtopush)
                    if(letnewDATA !== -1){
                        betDetails[0].data[0][letnewDATA].totalAmount = betDetails[0].data[0][letnewDATA].totalAmount - parseFloat(bet.exposure)
                        betDetails[0].data[0][letnewDATA].totalWinAmount = betDetails[0].data[0][letnewDATA].totalWinAmount + parseFloat(bet.WinAmount)
                    }else{
                        betDetails[0].data[0].push(objectPUsh)
                    }
                }
                // console.log(betDetails[0].data[0], betDetails[0].uniqueRuns)
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
                // console.log(dataToshow)
                let maxSumObject = dataToshow.reduce((max, current) => 
                    current.sum > max.sum ? current : max,
                    { sum: -Infinity }
                );
    
                WinAmount = maxSumObject.sum;
            }
        }
    }else{
        let betsMarketIdWise = await Bet.aggregate([
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
                    marketId: "$marketId",
                    selectionName: "$selectionName",
                    matchName: "$match",
                },
                totalAmount: {
                        $sum: {
                        $cond: { 
                            if : {$eq: ['$bettype2', "BACK"]},
                            then:{
                                $cond:{
                                    if: {
                                            $or: [
                                                { $regexMatch: { input: "$marketName", regex: /^match/i } },
                                                { $regexMatch: { input: "$marketName", regex: /^winner/i } }
                                            ]
                                        },
                                    then:{
                                        $sum: {
                                            $subtract: [{ $multiply: ["$oddValue", "$Stake"] }, "$Stake"]
                                        }
                                    },
                                    else:{
                                        $sum: {
                                            $divide: [{ $multiply: ["$oddValue", "$Stake"] }, 100]
                                        }
                                    }
                                }
                            },
                            else:{
                                $cond:{
                                    if: {
                                            $or: [
                                                { $regexMatch: { input: "$marketName", regex: /^match/i } },
                                                { $regexMatch: { input: "$marketName", regex: /^winner/i } }
                                            ]
                                        },
                                    then:{
                                        $sum: {
                                            $multiply : [ {$subtract: [ { $multiply: ["$oddValue", "$Stake"] }, "$Stake" ]}, -1]
                                        }
                                    },
                                    else:{
                                        $sum: { 
                                            $multiply : [ {$divide: [{ $multiply: ["$oddValue", "$Stake"] }, 100]}, -1]
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                Stake: {
                     $sum: { 
                        $cond: { 
                            if : {$eq: ['$bettype2', "BACK"]},
                            then : {
                                $sum: '$Stake' 
                            },
                            else : {
                                $multiply: ['$Stake', -1]
                            }
                        }
                    }
                },
                exposure:{
                    // $sum:'$exposure'
                    $sum: { 
                        $cond: { 
                            if : {$eq: ['$bettype2', "BACK"]},
                            then : {
                                $sum: '$exposure' 
                            },
                            else : {
                                $multiply: ['$Stake', -1]
                            }
                        }
                    }
                }
            },
            },
            {
                $group: {
                    _id: "$_id.marketId",
                    selections: {
                        $push: {
                            selectionName: "$_id.selectionName",
                            totalAmount: '$totalAmount',
                            exposure:'$exposure',
                            matchName: "$_id.matchName",
                            Stake: { $multiply: ["$Stake", -1] },
                        },
                    },
                },
            },
        ])


        console.log(betsMarketIdWise, "betsMarketIdWisebetsMarketIdWisebetsMarketIdWise")
    }

    console.log(WinAmount, "WinAmountWinAmountWinAmountWinAmount")
    return WinAmount
}


module.exports = checkExpoOfThatMarket