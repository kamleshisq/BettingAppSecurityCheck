const cron = require('node-cron');
const betModel = require('../model/betmodel');
const accountModel = require("../model/accountStatementByUserModel");
const commissionRepportModel = require("../model/commissionReport");
const netCommission = require("../model/netCommissionModel");
const commissionModel = require("../model/CommissionModel");
const commissionMarketModel = require("../model/CommissionMarketsModel");
const Decimal = require('decimal.js');
const Roles = require('./../model/roleModel');
const User = require("../model/userModel");
const loginLogs = require('../model/loginLogs');

const dashAlertBets = require('../model/dashAlerBets')
const dashCategories = require('../model/dashCategories')
const dashSettlement = require('../model/dashSettlement')
const dashTopBets = require('../model/dashTopBets')
const dashTopGames = require('../model/dashTopGames')
const dashTopPlayer = require('../model/dashTopPlayer')


module.exports = () => {
    cron.schedule('*/5 * * * * *', async() => {
        try{
            let topGames
            let Categories
            let alertBet
            let betsEventWise
            let childrenUsername = []
            let children = await User.find({parentUsers:req.currentUser._id})
            children.map(ele => {
                childrenUsername.push(ele.userName) 
            })
    
            
            topGames = await betModel.aggregate([
                {
                    $match: {
                        status: { $ne: "OPEN" },
                        date: { $gte: sevenDaysAgo },
                        userName:{$in:childrenUsername}
                    }
                },
    
                {
                    $group: {
                        _id: "$event",
                        totalCount: { $sum: 1 },
                        uniqueUsers: { $addToSet: "$userId" },
                        totalReturns: { $sum: "$Stake" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        event: "$_id",
                        totalCount: 1,
                        noOfUniqueUsers: { $size: "$uniqueUsers" },
                        totalReturns: 1
                    }
                },
                {
                    $sort: {
                        totalCount: -1
                    }
                },
                {
                    $limit: 5
                }
            ]);
            
            console.log(topGames, "topGames")

        }catch(err){
            console.log(err)
        }
        console.log('Dashboarcrone started .....')

        // for(let i = 0;i<topGames.length;i++){
        //     await dashTopGames.create({
        //         name:topGames[i].event,
        //         user_count:topGames[i].noOfUniqueUsers,
        //         bet_count:topGames[i].totalCount,
        //         amount:topGames[i].totalReturns
               
        //     })
        // }

        // console.log('===>TopGame Done 1')

        // Categories = await betModel.aggregate([
        //     {
        //         $match: {
        //             status: { $ne: "OPEN" },
        //             date: { $gte: sevenDaysAgo },
        //             userName:{$in:childrenUsername}
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: "$betType",
        //             totalBets: { $sum: 1 },
        //             totalReturns: { $sum: "$Stake" },
        //             uniqueEvent: { $addToSet: "$event" }
        //         }
        //     },
        //     {
        //         $sort: {
        //             totalBets: -1
        //         }
        //     }
        // ])
        // for(let i = 0;i<Categories.length;i++){
        //     await dashCategories.create({
        //         name:Categories[i]._id,
        //         match_count:Categories[i].uniqueEvent.length,
        //         bet_count:Categories[i].totalBets,
        //         amount:Categories[i].totalReturns
               
        //     })
        // }

        // console.log('===>Category Done 2')



        // alertBet = await betModel.aggregate([
        //     {
        //         $match: {
        //             "status": "Alert",
        //             userName:{$in:childrenUsername}

        //         }
        //     },
        //     {
        //       $sort: {
        //           Stake: -1
        //       }
        //   },
        //   {
        //       $limit: 5
        //   }
        // ]);

        
        
        // for(let i = 0;i<alertBet.length;i++){
        //     await dashAlertBets.create({
        //         name:alertBet[i].userName,
        //         eventName:alertBet[i].betType,
        //         point:alertBet[i].Stake
               
        //     })
        // }

        // console.log('===>alertBet  Done 3')

      
        // betsEventWise = await betModel.aggregate([
        //     {
        //         $match: {
        //             status: "OPEN",
        //             userName: {$in:childrenUsername}
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: "$match",
        //             count: { $sum: 1 },
        //             eventdate: { $first: "$eventDate" },
        //             eventid: { $first: "$eventId" },
        //             series: { $first: "$event" },
        //             sport: { $first: "$betType" }
        //         }
        //     },
        //     {
        //         $project: {
        //             _id: 0,
        //             matchName: "$_id",
        //             eventdate: 1,
        //             eventid: 1,
        //             series: 1,
        //             count: 1,
        //             sport: 1
        //         }
        //     },
        //     {
        //         $sort: { count: -1 }
        //     },
        //     {
        //         $limit: 5
        //     }
        // ]);

        // for(let i = 0;i<betsEventWise.length;i++){
        //     await dashSettlement.create({
        //         sportName:betsEventWise[i].sport,
        //         seriesName:betsEventWise[i].series,
        //         eventName:betsEventWise[i].matchName,
        //         bet_count:betsEventWise[i].count
               
        //     })
        // }

        // console.log('===>Settlement Done 4')

        
        // let topBets = await betModel.aggregate([
        //     {
        //         $match: {
        //             status:"OPEN",
        //             userName: {$in:childrenUsername}
        //         }
        //     },
        //       {
        //         $sort:{
        //             Stake: -1
        //         }
        //       },
        //       {
        //         $limit:5
        //       }
        // ])
        
        // for(let i = 0;i<topBets.length;i++){
        //     await dashTopBets.create({
        //         name:topBets[i].userName,
        //         eventName:topBets[i].match,
        //         marketName:topBets[i].marketName,
        //         odds:topBets[i].oddValue,
        //         value:topBets[i].Stake,
        //         risk:(topBets[i].Stake * topBets[i].oddValue).toFixed(2),
        //     })
        // }

        // console.log('===>Top Bets Done 5')

        

        // // console.log(topBets, "topBets 741258963")
        // const topPlayers = await User.find({Bets:{ $nin : [0, null, undefined] }, parentUsers : { $in: [req.currentUser.id] }}).limit(5).sort({Bets:-1})

        // for(let i = 0;i<topPlayers.length;i++){
        //     await dashTopPlayer.create({
        //         name:topPlayers[i].userName,
        //         bet_count:topPlayers[i].Bets,
        //         point:topPlayers[i].Bets
        //     })
        // }

        // console.log('===>Top Player Done 6')

        // console.log('dashboard Crone - Done')


    })
}