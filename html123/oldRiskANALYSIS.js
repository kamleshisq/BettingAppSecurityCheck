let Bets = await Bet.aggregate([
                {
                    $match: {
                        status: "OPEN",
                        marketId: data.marketId
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userName",
                        foreignField: "userName",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user"
                },
                {
                    $match: {
                        "user.parentUsers": { $in: [data.LOGINDATA.LOGINUSER._id] }
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
                        selections: 1,
                    },
                },
            ]);