socket.on('UerBook1', async(data) => {
        console.log(data)
        let childrenUsername = []
        let user = await User.findOne({userName:data.userName})
        let children = await User.find({parentUsers:user._id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })        
        try{
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
                // {
                //     $unwind: "$selections"
                // },
                {
                    $sort: {
                        "userName": 1, 
                        // "selections.selectionName": 1 
                    }
                }
            ]);
            
            console.log(Bets);
            
            
            

            // for (bet in Bets){
            //     for(selcet in Bets[bet].selections){}
            // }
            
            
            
            
           console.log(Bets, "==> WORKING")
        //    console.log(Bets[0].selections)
           socket.emit('UerBook1', {Bets,type:data.type});
        //    socket.emit();
        }catch(err){
            console.log(err)
            socket.emit('UerBook1', {message:"err", status:"error"})
        }
    })