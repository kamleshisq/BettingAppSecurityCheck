const User = require('../model/userModel');
const Bet = require('../model/betmodel');
const runnerData = require('../model/runnersData');


async function checkExposureWithoutThatMarket(data, bet){
// console.log('WORKING')
if(data){
    let userData = await User.findById(data.id)
    if(userData && userData.userName){
        const exposure1 = await Bet.aggregate([
            {
                $match: {
                    status: "OPEN",
                    userName:userData.userName,
                    marketId:{
                        $regex: /OE$/,
                        $ne: `${bet}`
                    }
                    
                }
            },
            {
                $group: {
                    _id: "$marketId",
                    totalAmountB: {
                        $sum: {
                            $cond: {
                                if : {$eq: ['$bettype2', "BACK"]},
                                then:{$multiply:["$exposure",-1]},
                                else:'$WinAmount'
                            }
                        }
                    },
                    totalAmountL: {
                        $sum: {
                            $cond: {
                                if : {$eq: ['$bettype2', "LAY"]},
                                then:{$multiply:["$exposure",-1]},
                                else:'$WinAmount'
                            }
                        }
                    }
               
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: {$sum:{$cond:{
                        if:{
                            $eq:[{$cmp:['$totalAmountB','$totalAmountL']},0]
                        },
                        then:"$totalAmountL",
                        else:{
                            $cond:{
                                if:{
                                    $eq:[{$cmp:['$totalAmountB','$totalAmountL']},1]
                                },
                                then:"$totalAmountL",
                                else:"$totalAmountB"
                            }
                           
                        }
                    },
                }},
            }
        }
        ])

    
        const exposure2 = await Bet.aggregate([
            {
                $match: {
                    status: "OPEN",
                    userName:userData.userName,
                    marketId:{
                        $regex: /F2$/,
                        $ne: `${bet}`
                    }
                    
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
                    _id:{
                        marketId:"$marketId",
                        runs:'$runs',
                        bettype2:'$bettype2'
                    },
                    exposure:{$sum: '$exposure'},
                    WinAmount:{$sum:'$WinAmount'},
                },
            },
            {
                $group:{
                    _id:"$_id.marketId",
    
                    runs:{
                        $push:'$_id.runs'
                    },
                    data:{
                        $push:{
                            run:'$_id.runs',
                            exposure:'$exposure',
                            winAmount:'$WinAmount',
                            type:'$_id.bettype2'
                        }
                    },
                }
                    
                
            },
        ])


        let exposure3 = await Bet.aggregate([
            {
                $match: {
                    status: "OPEN",
                    userName:userData.userName,
                    marketName: {
                        $regex: /^(match|book|winn|toss|over\/under)/i,
                        $ne: `${bet}`
                    }
                    
                }
            },
            {
                $group:{
                    _id: {
                        selectionName: "$selectionName",
                        marketId : "$marketId",
                        matchName: "$match"
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
                                                { $regexMatch: { input: "$marketName", regex: /^winner/i } },
                                                { $regexMatch: { input: "$marketName", regex: /^over\/under/i } }
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
                                                { $regexMatch: { input: "$marketName", regex: /^winner/i } },
                                                { $regexMatch: { input: "$marketName", regex: /^over\/under/i } }
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
            }
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
            {
                $project: {
                  _id: "$_id",
                  data: {
                    $map: {
                      input: "$selections",
                      as: "item",
                      in: {
                        selectionName: "$$item.selectionName",
                        totalAmount: "$$item.totalAmount",
                        exposure : "$$item.exposure",
                        Stake : "$$item.Stake",
                        totalLossAmount: {
                          $add: [
                            "$$item.totalAmount",
                            {
                                $sum:{
                                    $reduce: { 
                                        input: "$selections",
                                        initialValue: 0,
                                        in: { 
                                            $cond: { 
                                                if: {
                                                    $ne: ["$$this.selectionName", "$$item.selectionName"] 
                                                  },
                                                  then: { $add: ["$$value", "$$this.Stake"]  },
                                                  else: {
                                                      $add: ["$$value", 0] 
                                                  }
                                            }
                                        }
                                    }
                                }
                            }
                          ]
                        }
                      }
                    }
                  }
                }
              },
        ])

        // console.log(exposure3, "exposure3exposure3exposure3")
        let exposer3Amount = 0
        // console.log(exposure3[1].data, exposure3[0].data,userData.userName)
        if(exposure3.length > 0){
            for(let i = 0; i < exposure3.length; i++){
                let thisAMOunt = 0
                let thisAMOunt2 = 0
                let statusrun = true
                let runnersData1 = await runnerData.findOne({marketId:exposure3[i]._id})
                if(runnersData1){
                    runnersData1 = JSON.parse(runnersData1.runners)
                    // console.log(runnersData1)
                    for(const runDATA in runnersData1){
                        let thatdata = exposure3[i].data.find(item =>  item.selectionName === runnersData1[runDATA].runner)
                        if(thatdata ){
                            if(thatdata.totalLossAmount < 0){
                            if(thatdata.totalLossAmount < thisAMOunt){
                                    thisAMOunt = thatdata.totalLossAmount
                                }
                            }
                        }else{
                            statusrun = false
                        }
                    }
                }
                if(!statusrun){
                    for(const j in exposure3[i].data){
                        thisAMOunt2 = thisAMOunt2 - exposure3[i].data[j].exposure
                    }
                // console.log(thisAMOunt, thisAMOunt2)
                }
                if(thisAMOunt > thisAMOunt2){
                    if(thisAMOunt2 < 0){
                        exposer3Amount = exposer3Amount + thisAMOunt2
                    }
                }else{
                    if(thisAMOunt < 0){
                        exposer3Amount = exposer3Amount + thisAMOunt
                    }
                }
            }
            // exposer3Amount = exposure3[0].amount
            // console.log(exposer3Amount)
        }
    
        // console.log(exposure3, exposure2, exposure1,'==>exposures')

        function getExposure(runs,obj){
            runs.sort((a, b) => a - b)
            obj.sort((a, b) => a.run - b.run)
            let runLength = runs.length;
            let dataToshow = [];
            let min = 0
            for(let i = 0;i<runLength;i++){
                if(runLength == 1){
                    let data1 = {}
                    data1.message = `${runs[0] - 1} or less`
                    let sum = 0
                    for(let j = 0; j < obj.length; j++){
                        if(obj[j].type === "LAY"){
                            sum += obj[j].winAmount
                        }else{
                            sum -= obj[j].exposure
                        }
                    }
                    data1.sum = sum
                    dataToshow.push(data1)
                    let data2 = {}
                    let sum2 = 0
                    data2.message = `${runs[i]} or more`
                    for(let j = 0; j < obj.length; j++){
                        if(obj[j].type === "BACK"){
                            sum2 += obj[j].winAmount
                        }else{
                            sum2 -= obj[j].exposure
                        }
                    }
                    data2.sum = sum2
                    dataToshow.push(data2)
                }else{
                    if(i === 0){
                        let data = {}
                        data.message = `${runs[i] - 1} or less`
                        let sum = 0
                        for(let j = 0; j < obj.length; j++){
                            if(obj[j].type === "LAY" && obj[j].run >= runs[i]){
                                sum += obj[j].winAmount
                            }else{
                                sum -= obj[j].exposure
                            }
                        }
                        data.sum = sum
                        dataToshow.push(data)
                    }else if (i === (runs.length - 1)){
                        let data = {}
                        let data1 = {}
                        
                        if(runs[i - 1] == (runs[i] - 1)){
                            data.message = `${runs[i - 1]}`
                        }else{
                            data.message = `between ${runs[i - 1]} and ${runs[i] - 1}`
                        }
                        let sum = 0
                        for(let j = 0; j < obj.length; j++){
                            if(obj[j].type === "LAY" && obj[j].run == runs[i]){
                                sum += obj[j].winAmount
                            }else if(obj[j].type === "BACK" && obj[j].run == runs[i-1]){
                                sum += obj[j].winAmount
                            }else{
                                sum -= obj[j].exposure
    
                            }
                        }
                        data.sum = sum
                        dataToshow.push(data)
                        let sum2 = 0
                        data1.message = `${runs[i]} or more`
                        for(let j = 0; j < obj.length; j++){
                            if(obj[j].type === "BACK" && obj[j].run <= runs[i]){
                                sum2 += obj[j].winAmount
                            }else{
                                sum2 -= obj[j].exposure
                            }
                        }
                        data1.sum = sum2
                        dataToshow.push(data1)
                    }else{
                        let data = {}
                        if(runs[i - 1] == (runs[i] - 1)){
                            data.message = `${runs[i] - 1}`
                        }else{
                            data.message = `between ${runs[i - 1]} and ${runs[i] - 1}`
                        }
                        let sum = 0
                        for(let j = 0; j < obj.length; j++){
                            if(obj[j].type === "LAY" && obj[j].run == runs[i]){
                                sum += obj[j].winAmount
                            }else if (obj[j].type === "BACK" && obj[j].run == runs[i - 1]){
                                sum += obj[j].winAmount
                            }
                            else{
                                sum -= obj[j].exposure
                            }
                        }
                        data.sum = sum
                        dataToshow.push(data)
                    }
                }
    
            }
    
            for(let i = 0;i<Object.keys(dataToshow).length;i++){
                if(dataToshow[i].sum < min){
                    min = dataToshow[i].sum
                }
            }
            return min;
        }
    
        let exposureFancy = 0;
        for(let i = 0;i<exposure2.length;i++){
            exposureFancy += getExposure(exposure2[i].runs,exposure2[i].data)
        }
        let totalExposure;
        let exposureOther;
        if(exposure1.length == 0 ){
            exposureOther = 0
        }else{
            exposureOther = exposure1[0].totalAmount
        }
        // console.log(exposureOther, exposureFancy, exposer3Amount)
        let stoprtBookexp = await Bet.aggregate([
            {
                $match: {
                    status: "OPEN",
                    userName:userData.userName,
                    betType:'SportBook'
                    
                }
            },
            {
                $group:{
                    _id:null,
                    sum:{
                        $sum:'$returns'
                    }
                }
            }
        ])
        // console.log(stoprtBookexp, "stoprtBookexpstoprtBookexpstoprtBookexp")
        totalExposure = (exposureOther + exposureFancy + exposer3Amount) * -1
        if(stoprtBookexp.length > 0){
            totalExposure = totalExposure - stoprtBookexp[0].sum
        }
        await User.findByIdAndUpdate(data.id, {exposure:totalExposure})
       return totalExposure
    }
}
}


module.exports = checkExposureWithoutThatMarket