socket.on('UerBook', async(data) => {
    // console.log(data)
    // let users = await User.find({parentUsers:data.LOGINDATA.LOGINUSER._id,role_type:2})
    let users = []
    let falg = false
    let Id 
    if(data.userName){
        let thatUSer = await User.findOne({userName:data.userName})
        if(thatUSer){
            Id = thatUSer.userName
            falg = true
            users = await User.find({parent_id:thatUSer._id, isActive:true , roleName:{$ne:'Operator'}})
        }
        // users = await User.find({parent_id:data.LOGINDATA.LOGINUSER._id, isActive:true , roleName:{$ne:'Operator'}})
    }else{
        users = await User.find({parent_id:data.LOGINDATA.LOGINUSER._id, isActive:true , roleName:{$ne:'Operator'}})
        Id = data.LOGINDATA.LOGINUSER.userName

    }
    try{
        let newUser = users.map(async(ele)=>{
            let childrenUsername1 = []
            let children
            if(falg){
                children = await User.find({parentUsers:ele.id})
            }else{
                children = await User.find({parentUsers:ele._id})
            }
            children.map(ele1 => {
                childrenUsername1.push(ele1.userName) 
            })
            if(childrenUsername1.length > 0){
                let Bets = await Bet.aggregate([
                    {
                        $match: {
                            status: "OPEN",
                            marketId: data.marketId,
                            userName:{$in:childrenUsername1}
                        }
                    },
                    {
                        $group: {
                            _id: {
                                userName: "$userName",
                                selectionName: "$selectionName",
                                matchName: "$match",
                            },
                            totalAmount: {
                                $sum: {
                                    $cond: { 
                                        if : {$eq: ['$bettype2', "BACK"]},
                                        then:{
                                            $cond:{
                                                if: { $regexMatch: { input: "$marketName", regex: /^match/i } },
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
                                                if: { $regexMatch: { input: "$marketName", regex: /^match/i } },
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
                            parentArray: { $first: "$parentArray" }
                        },
                    },
                    {
                        $group: {
                            _id: "$_id.userName",
                            parentArray: { $first: "$parentArray" },
                            selections: {
                                $push: {
                                    selectionName: "$_id.selectionName",
                                    totalAmount: "$totalAmount",
                                    matchName: "$_id.matchName",
                                    Stake: { $multiply: ["$Stake", -1] },
                                },
                            },
                        },
                    },
                    {
                        $project: { 
                            _id:0,
                            userName: "$_id",
                            parentArray:"$parentArray",
                            selections: { 
                                $map: { 
                                    input: "$selections",
                                    as: "selection",
                                    in: { 
                                        selectionName: "$$selection.selectionName",
                                        totalAmount: "$$selection.totalAmount",
                                        matchName: "$$selection.matchName",
                                        Stake: "$$selection.Stake",
                                        winAmount: "$$selection.totalAmount",
                                        lossAmount:"$$selection.Stake"
                                    }
                                }
                            }
                        }
                    },
                    {
                        $sort: {
                            "userName": 1, 
                        }
                    },
                    {
                        $project: { 
                            _id:0,
                            userName: "$userName",
                            elementUser : ele.userName,
                            parentArray:"$parentArray",
                            selections2:{ 
                                $map: { 
                                    input: "$selections",
                                    as: "selection",
                                    in: { 
                                        selectionName: "$$selection.selectionName",
                                        totalAmount: "$$selection.totalAmount",
                                        matchName: "$$selection.matchName",
                                        Stake: "$$selection.Stake",
                                        winAmount :"$$selection.winAmount",
                                        lossAmount : "$$selection.lossAmount",
                                        winAmount2: {
                                            $reduce:{
                                                input:'$parentArray',
                                                initialValue: { value: 0, flag: true },
                                                in : {
                                                    $cond:{
                                                        if : {
                                                            $and: [
                                                              { $ne: ['$$this.parentUSerId', ele.id] }, 
                                                              { $eq: ['$$value.flag', true] } 
                                                            ]
                                                          },
                                                        then : {
                                                            value: { 
                                                                $cond:{
                                                                    if:{ $eq: ["$$value.value", 0] },
                                                                    then:{
                                                                        $multiply: ["$$selection.winAmount", { $divide: ["$$this.uplineShare", 100] }]
                                                                    },
                                                                    else:{
                                                                        $multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]
                                                                    }
                                                                }
                                                            },
                                                            flag: true,
                                                            
                                                        },
                                                        else : {
                                                            value: {
                                                                $cond : {
                                                                    if : { $eq : ["$$value.value" , 0]},
                                                                    then : {
                                                                        $subtract : ["$$selection.winAmount",{$multiply: ["$$selection.winAmount", { $divide: ["$$this.uplineShare", 100] }]}]
                                                                    },
                                                                    else : "$$value.value"
                                                                }
                                                            },
                                                            flag:false
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        lossAmount2:{
                                            $reduce:{
                                                input:'$parentArray',
                                                initialValue: { value: 0, flag: true },
                                                in : {
                                                    $cond:{
                                                        if : {
                                                            $and: [
                                                              { $ne: ['$$this.parentUSerId', ele.id] }, 
                                                              { $eq: ['$$value.flag', true] } 
                                                            ]
                                                          },
                                                        then : {
                                                            value: { 
                                                                $cond:{
                                                                    if:{ $eq: ["$$value.value", 0] },
                                                                    then:{
                                                                        $multiply: ["$$selection.lossAmount", { $divide: ["$$this.uplineShare", 100] }]
                                                                    },
                                                                    else:{
                                                                        $multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]
                                                                    }
                                                                }
                                                            },
                                                            flag: true,
                                                            
                                                        },
                                                        else : {
                                                            value: {
                                                                $cond : {
                                                                    if : { $eq : ["$$value.value" , 0]},
                                                                    then : {
                                                                        $subtract:["$$selection.lossAmount", {$multiply: ["$$selection.lossAmount", { $divide: ["$$this.uplineShare", 100] }]}]
                                                                    },
                                                                    else : "$$value.value"
                                                                }
                                                            },
                                                            flag:false
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        $unwind: "$selections2"
                    },
                    {
                        $group: {
                          _id: {
                            elementUser: "$elementUser",
                            selectionName: "$selections2.selectionName"
                          },
                          totalWinAmount: { $sum: "$selections2.winAmount2.value" },
                          totalLossAmount: { $sum: "$selections2.lossAmount2.value" }
                        }
                    },
                    {
                        $project: {
                          _id: 0,
                          elementUser: "$_id.elementUser",
                          selection: {
                            selectionName: "$_id.selectionName",
                            totalWinAmount: {
                                $multiply:["$totalWinAmount", -1]
                            },
                            totalLossAmount:{
                                $multiply:["$totalLossAmount", -1]
                            }
                          }
                        }
                    },
                    {
                        $group: {
                          _id: "$elementUser",
                          selections: { $push: "$selection" }
                        }
                    },
                    {
                        $project: {
                          _id: 0,
                          elementUser: "$_id",
                          selections: 1
                        }
                    },
                    {
                        $project: {
                          _id: 0,
                          elementUser: 1,
                          selections: {
                            $cond: {
                              if: {
                                $in: [
                                  "the draw",
                                  {
                                    $map: {
                                      input: "$selections",
                                      as: "sel",
                                      in: "$$sel.selectionName"
                                    }
                                  }
                                ]
                              },
                              then: "$selections", 
                              else: {
                                $concatArrays: [
                                  "$selections",
                                  [
                                    {
                                      selectionName: "the draw",
                                      totalWinAmount: {
                                        $sum: {
                                          $map: {
                                            input: "$selections",
                                            as: "sel",
                                            in: "$$sel.totalLossAmount"
                                          }
                                        }
                                      },
                                      totalLossAmount : 0
                                    }
                                  ]
                                ]
                              }
                            }
                          }
                        }
                      },
                    {
                        $project: { 
                            _id:0,
                            elementUser:"$elementUser",
                            selections: { 
                                $map: { 
                                    input: "$selections",
                                    as: "selection",
                                    in: { 
                                        selectionName: "$$selection.selectionName",
                                        totalAmount: "$$selection.totalWinAmount",
                                        winAmount: { 
                                            $add : [
                                                "$$selection.totalWinAmount", 
                                                {
                                                    $reduce: {
                                                        input: "$selections",
                                                        initialValue: 0,
                                                        in: {
                                                            $cond: {
                                                                if: {
                                                                  $ne: ["$$this.selectionName", "$$selection.selectionName"] 
                                                                },
                                                                then: { $add: ["$$value", "$$this.totalLossAmount"] },
                                                                else: {
                                                                    $add: ["$$value", 0] 
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        lossAmount:{ 
                                            $add : [
                                                "$$selection.totalLossAmount", 
                                                {
                                                    $reduce: {
                                                        input: "$selections",
                                                        initialValue: 0,
                                                        in: {
                                                            $cond: {
                                                                if: {
                                                                  $ne: ["$$this.selectionName", "$$selection.selectionName"] 
                                                                },
                                                                then: { $add: ["$$value", "$$this.totalWinAmount"] },
                                                                else: {
                                                                    $add: ["$$value", 0] 
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                    }
                                }
                            }
                        }
                    },
                    
                    
                ])
                if(falg){
                    return({User:ele, Bets:Bets, userName:data.userName})
                }else{
                    return({User:ele, Bets:Bets})
                }
            }else{
                if(ele.roleName === "user"){
                    let Bets = await Bet.aggregate([
                        {
                            $match: {
                                status: "OPEN",
                                marketId: data.marketId,
                                userName:ele.userName
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    userName: "$userName",
                                    selectionName: "$selectionName",
                                    matchName: "$match",
                                },
                                totalAmount: {
                                    $sum: {
                                        $cond: { 
                                            if : {$eq: ['$bettype2', "BACK"]},
                                            then:{
                                                $cond:{
                                                    if: { $regexMatch: { input: "$marketName", regex: /^match/i } },
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
                                                    if: { $regexMatch: { input: "$marketName", regex: /^match/i } },
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
                                parentArray: { $first: "$parentArray" }
                            },
                        },
                        {
                            $group: {
                                _id: "$_id.userName",
                                parentArray: { $first: "$parentArray" },
                                selections: {
                                    $push: {
                                        selectionName: "$_id.selectionName",
                                        totalAmount: "$totalAmount",
                                        matchName: "$_id.matchName",
                                        Stake: { $multiply: ["$Stake", -1] },
                                    },
                                },
                            },
                        },
                        {
                            $project: { 
                                _id:0,
                                userName: "$_id",
                                parentArray:"$parentArray",
                                selections: { 
                                    $map: { 
                                        input: "$selections",
                                        as: "selection",
                                        in: { 
                                            selectionName: "$$selection.selectionName",
                                            totalAmount: "$$selection.totalAmount",
                                            matchName: "$$selection.matchName",
                                            Stake: "$$selection.Stake",
                                            winAmount: "$$selection.totalAmount",
                                            lossAmount:"$$selection.Stake"
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $sort: {
                                "userName": 1, 
                            }
                        },
                        {
                            $unwind: "$selections"
                        },
                        {
                            $group: {
                              _id: {
                                elementUser: "$userName",
                                selectionName: "$selections.selectionName"
                              },
                              totalWinAmount: { $sum: "$selections.winAmount" },
                              totalLossAmount: { $sum: "$selections.lossAmount" }
                            }
                        },
                        {
                            $project: {
                              _id: 0,
                              elementUser: "$_id.elementUser",
                              selection: {
                                selectionName: "$_id.selectionName",
                                totalWinAmount: "$totalWinAmount",
                                totalLossAmount: "$totalLossAmount"
                              }
                            }
                        },
                        {
                            $group: {
                              _id: "$elementUser",
                              selections: { $push: "$selection" }
                            }
                        },
                        {
                            $project: {
                              _id: 0,
                              elementUser: "$_id",
                              selections: 1
                            }
                        },
                        {
                            $project: { 
                                _id:0,
                                elementUser:"$elementUser",
                                selections: { 
                                    $map: { 
                                        input: "$selections",
                                        as: "selection",
                                        in: { 
                                            selectionName: "$$selection.selectionName",
                                            totalAmount: "$$selection.totalWinAmount",
                                            winAmount: { 
                                                $add : [
                                                    "$$selection.totalWinAmount", 
                                                    {
                                                        $reduce: {
                                                            input: "$selections",
                                                            initialValue: 0,
                                                            in: {
                                                                $cond: {
                                                                    if: {
                                                                      $ne: ["$$this.selectionName", "$$selection.selectionName"] 
                                                                    },
                                                                    then: { $add: ["$$value", "$$this.totalLossAmount"] },
                                                                    else: {
                                                                        $add: ["$$value", 0] 
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            },
                                            lossAmount:{ 
                                                $add : [
                                                    "$$selection.totalLossAmount", 
                                                    {
                                                        $reduce: {
                                                            input: "$selections",
                                                            initialValue: 0,
                                                            in: {
                                                                $cond: {
                                                                    if: {
                                                                      $ne: ["$$this.selectionName", "$$selection.selectionName"] 
                                                                    },
                                                                    then: { $add: ["$$value", "$$this.totalWinAmount"] },
                                                                    else: {
                                                                        $add: ["$$value", 0] 
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            },
                                        }
                                    }
                                }
                            }
                        },

                    ])

                    return({User:ele, Bets:Bets, status:'User', userName:data.userName})

                }
            }
        })
        let resultPromise = await Promise.all(newUser)
        let result = []
        for(let i = 0;i<resultPromise.length;i++){
            // console.log(resultPromise[i], 123)
            if(resultPromise[i] && resultPromise[i].Bets.length > 0){
                result.push(resultPromise[i])
                // console.log(resultPromise[i].Bets)
                // console.log(resultPromise[i].Bets[0].selections)
            }
        }
        
        let matchName2 = await Bet.findOne({marketId: data.marketId})
        let matchName
        let sport
        if(matchName2){
            matchName = matchName2.match
            sport = matchName2.betType
        }

        // console.log(Id, "IdIdIdIdIdIdId")
       socket.emit('UerBook', {Bets:result,type:data.type,newData:data.newData, matchName, Id,sport});
    //    socket.emit();
    }catch(err){
        console.log(err)
        socket.emit('UerBook', {message:"err", status:"error"})
    }
})


// {
//     $subtract : ["$$selection.winAmount",{$multiply: ["$$selection.winAmount", { $divide: ["$$this.uplineShare", 100] }]}]
// }

// {
//     $subtract:["$$selection.lossAmount", {$multiply: ["$$selection.lossAmount", { $divide: ["$$this.uplineShare", 100] }]}]
// },