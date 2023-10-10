try{
    let newUser = users.map(async(ele)=>{
        role_type = []
        roles = await Role.find({role_level: {$gt:ele.role.role_level}});
        for(let i = 0; i < roles.length; i++){
            role_type.push(roles[i].role_type)
        }
        let childrenUsername = []
       
        if(ele.role_type == 2){
            let children = await User.find({parentUsers:ele._id,isActive:true,role_type:{$in:role_type}})
            children.map(ele => {
                childrenUsername.push(ele.userName) 
            })
        }
        else if(ele.role_type == 5){
            let children = await User.find({userName:ele.userName,isActive:true})
            children.map(ele => {
                childrenUsername.push(ele.userName) 
            })
        }
        let Bets = await Bet.aggregate([
            {
                $match: {
                    status: "OPEN",
                    marketId: data.marketId,
                    userName:{$in:childrenUsername}
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
                            $subtract: [{ $multiply: ["$oddValue", "$Stake"] }, "$Stake"]
                        }
                    },
                    Stake: { $sum: "$Stake" }
                },
            },
            {
                $group: {
                    _id: "$_id.userName",
                    selections: {
                        $push: {
                            selectionName: "$_id.selectionName",
                            totalAmount: "$totalAmount",
                            matchName: "$_id.matchName",
                            Stake: "$Stake"
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    userName: "$_id",
                    selections: {
                        $map: {
                            input: "$selections",
                            as: "selection",
                            in: {
                                selectionName: "$$selection.selectionName",
                                totalAmount: {
                                    $subtract: [
                                        "$$selection.totalAmount",
                                        {
                                            $reduce: {
                                                input: "$selections",
                                                initialValue: 0,
                                                in: {
                                                    $cond: {
                                                        if: {
                                                            $and: [
                                                                { $eq: ["$$this.matchName", "$$selection.matchName"] },
                                                                { $ne: ["$$this.selectionName", "$$selection.selectionName"] }
                                                            ]
                                                        },
                                                        then: { $add: ["$$value", "$$this.Stake"] },
                                                        else: "$$value"
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                },
                                matchName: "$$selection.matchName",
                                Stake: "$$selection.Stake"
                            }
                        }
                    }
                },
            },
            {
                $sort: {
                    "userName": 1, 
                    // "selections.selectionName": 1 
                }
            }
        ]);

        console.log(Bets, "Bets")
        let sumOfTeamA = 0
        let sumOfTeamB = 0
        let teamA;
        let teamB;
        if(Bets.length != 0){
            let match = Bets[0].selections[0].matchName
            let team1 = match.split('v')[0]
            let team2 = match.split('v')[1]
            teamA = match.split('v')[0]
            teamB = match.split('v')[1]
            for(let i = 0; i < Bets.length; i++){

                let team1data = 0 
                let team2data = 0
                if(Bets[i].selections[0].selectionName.toLowerCase().includes(team1.toLowerCase)){
                    // console.log("2121222122121")
                    team1data = Bets[i].selections[0].totalAmount
                    if(Bets[i].selections[1]){
                        team2data = Bets[i].selections[1].totalAmount
                    }else{
                        team2data = -Bets[i].selections[0].Stake
                    }
                    sumOfTeamB += team2data
                    sumOfTeamA += team1data

                }else{
                    team2data = Bets[i].selections[0].totalAmount
                    if(Bets[i].selections[1]){
                        team1data = Bets[i].selections[1].totalAmount
                    }else{
                        team1data = -Bets[i].selections[0].Stake
                    }
                    
                    sumOfTeamA += team1data
                    sumOfTeamB += team2data
                }

            }
            return ({ele,Bets:{teama:sumOfTeamB,teamb:sumOfTeamA,teamA,teamB,type:data.type}})
        }
    })
    let resultPromise = await Promise.all(newUser)
    let result = []
    for(let i = 0;i<resultPromise.length;i++){
        if(resultPromise[i]){
            result.push(resultPromise[i])
        }
    }
    
    
    

    // for (bet in Bets){
    //     for(selcet in Bets[bet].selections){}
    // }
    
    
    
    
   console.log(result, "==> WORKING")
//    console.log(Bets[0].selections)
   socket.emit('UerBook', {Bets:result,type:data.type,newData:data.newData});
//    socket.emit();
}catch(err){
    console.log(err)
    socket.emit('UerBook', {message:"err", status:"error"})
}