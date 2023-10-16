let commissionMarket = await commissionMarketModel.find()
                        if(commissionMarket.some(item => item.marketId == betsWithMarketId.marketId)){
                           try{
                            let commission = await commissionModel.find({userId:user.id})
                            let commissionPer = 0
                            if (betsWithMarketId.marketName == "Match Odds" && commission[0].matchOdd.status){
                                commissionPer = commission[0].matchOdd.percentage
                              }
                              let commissionCoin = ((commissionPer * betsWithMarketId.Stake)/100).toFixed(4)
                              if(commissionPer > 0){
                                let user1 = await userModel.findByIdAndUpdate(user.id, {$inc:{commission:commissionCoin}})
                                // console.log(user)
                                // console.log(user1)
                                let commissionReportData = {
                                    userId:user.id,
                                    market:betsWithMarketId.marketName,
                                    commType:'Win Commission',
                                    percentage:commissionPer,
                                    commPoints:commissionCoin,
                                    event:betsWithMarketId.event,
                                    match:betsWithMarketId.match,
                                    Sport:betsWithMarketId.gameId
                                }
                                let commisssioReport = await commissionRepportModel.create(commissionReportData)
                            }
                            }catch(err){
                                console.log(err)
                            }

                            try{
                                for(let i = user.parentUsers.length - 1; i >= 1; i--){
                                    let childUser = await userModel.findById(user.parentUsers[i])
                                    let parentUser = await userModel.findById(user.parentUsers[i - 1])
                                    let commissionChild = await commissionModel.find({userId:childUser.id})
                                    let commissionPer = 0
                                    if (betsWithMarketId.marketName == "Match Odds" && commissionChild[0].matchOdd.status){
                                        commissionPer = commissionChild[0].matchOdd.percentage
                                      }
                                    let commissionCoin = ((commissionPer * betsWithMarketId.Stake)/100).toFixed(4)
                                    if(commissionPer > 0){
                                        let user1 = await userModel.findByIdAndUpdate(childUser.id, {$inc:{commissionChild:commissionCoin}})
                                        let commissionReportData = {
                                            userId:childUser.id,
                                            market:betsWithMarketId.marketName,
                                            commType:'Win Commission',
                                            percentage:commissionPer,
                                            commPoints:commissionCoin,
                                            event:betsWithMarketId.event,
                                            match:betsWithMarketId.match,
                                            Sport:betsWithMarketId.gameId
                                        }
                                        let commisssioReport = await commissionRepportModel.create(commissionReportData)
                                    }
                                }
                            }catch(err){
                                console.log(err)
                            }
                        }