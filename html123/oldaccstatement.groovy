if(marketidarray.includes(userAcc[i].marketId)){
                        continue;
                    }
                     let bet = await accountStatement.aggregate([
                         {
                             $match:{
                                 userId:req.currentUser._id.toString(),
                                 $and:[{marketId:{$exists:true}},{marketId:userAcc[i].marketId},{settleDate:{$exists:true}},{settleDate:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))}}],
                                 closingBalance:{$exists:true}
                             }
                         },
                         {
                            $sort:{settleDate:-1}
                         },
                         {
                             $group:{
                                 _id:{
                                     eventId:"$eventId",
                                     marketId:"$marketId",
                                     date:{ $dateToString: { format: "%d-%m-%Y", date: "$settleDate"} }
                                 },
                                 match:{$first:'$match'},
                                 marketName:{$first:'$marketName'},
                                 stake:{$first:'$Stake'},
                                 creditDebitamount:{$sum:'$returns'},
                                 balance:{$first:'$closingBalance'},
                                 transactionId:{$first:'$transactionId'}
                             }
                         },
                         {
                            $sort:{settleDate:-1}
                         },
                         {
                            $limit:(20 - finalresult.length)
                         }
                     ])
                     if(bet.length !== 0 && !marketidarray.includes(bet[0]._id.marketId)){
                         marketidarray.push(bet[0]._id.marketId)
                         finalresult = finalresult.concat(bet)
                         if(finalresult.length >= 20){
                             break
                         }
                     }