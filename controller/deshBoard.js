const Roles = require('./../model/roleModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const User = require("../model/userModel");
const betModel = require("../model/betmodel");
const accountModel = require("../model/accountStatementByUserModel");
const loginLogs = require('../model/loginLogs');
exports.dashboardData = catchAsync(async(req, res, next) => {
    let roles
    let users
    let topGames
    let Categories
    let userCount = 0
    let adminCount = 0
    let betCount = 0
    let alertBet
    let betsEventWise
    let turnOver
        roles = await User.aggregate([
            {
                $match:{
                    parentUsers : { $in: [req.currentUser.id] }
                }
            },
            {
                $group:{
                    _id:"$roleName",
                    total:{$sum:1}
                }
            },
            { 
                $sort:{
                    total:1
                }
            }
        ]);
        users = await User.aggregate([
            {
                $match:{
                    parentUsers : { $in: [req.currentUser.id] }
                }
            },
            {
                $group:{
                    _id:{
                        whiteLabel:"$whiteLabel",
                        roleType:"$roleName"
                    },
                    total:{$sum:1}
                }
            },
            { $group : { 
                _id :  "$_id.whiteLabel",
                terms: { 
                    $push: { 
                        roleType:"$_id.roleType",
                        total:"$total"
                    }
                }
             }
            },    { 
                $sort:{
                    _id:1
                }
            }
        ]);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        topGames = await betModel.aggregate([
            {
                $match: {
                    status: { $ne: "OPEN" },
                    date: { $gte: sevenDaysAgo }
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
                    "user.parentUsers": { $in: [req.currentUser.id] }
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

        Categories = await betModel.aggregate([
            {
                $match: {
                    status: { $ne: "OPEN" },
                    date: { $gte: sevenDaysAgo }
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
                  "user.parentUsers": { $in: [req.currentUser.id] }
                }
              },
            {
                $group: {
                    _id: "$betType",
                    totalBets: { $sum: 1 },
                    totalReturns: { $sum: "$Stake" },
                    uniqueEvent: { $addToSet: "$event" }
                }
            },
            {
                $sort: {
                    totalBets: -1
                }
            }
        ])


        const result = await loginLogs.aggregate([
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
                    "user.parentUsers": { $in: [req.currentUser.id] },
                    "user.is_Online": true // Optionally, include this filter if needed
                }
            },
            {
                $facet: {
                    "userCount": [
                        {
                            $match: {
                                "user.roleName": "user"
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                totalAmount: { $sum: 1 }
                            }
                        }
                    ],
                    "adminCount": [
                        {
                            $match: {
                                "user.roleName": { $ne: "user" }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                totalAmount: { $sum: 1 }
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    _id: 0,
                    userCount: { $arrayElemAt: ["$userCount.totalAmount", 0] },
                    adminCount: { $arrayElemAt: ["$adminCount.totalAmount", 0] }
                }
            }
        ]);
        
        const userTotalAmount = result[0].userCount || 0;
        const adminTotalAmount = result[0].adminCount || 0;

        // betCount = await betModel.aggregate([
        //     {
        //         $lookup: {
        //           from: "users",
        //           localField: "userName",
        //           foreignField: "userName",
        //           as: "user"
        //         }
        //       },
        //       {
        //         $unwind: "$user"
        //       },
        //       {
        //         $match: {
        //           "user.parentUsers": { $in: [req.currentUser.id] }
        //         }
        //       },
        //     {
        //         $count: "totalBets"
        //       }
        //   ])
          alertBet = await betModel.aggregate([
              {
                  $match: {
                      "status": "Alert"
                  }
              },
              {
                $sort: {
                    Stake: -1
                }
            },
            {
                $limit: 5
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
                    "user.parentUsers": { $in: [req.currentUser.id] }
                }
            },
            
        ]);
        
        betsEventWise = await betModel.aggregate([
            {
                $match: {
                    status: "OPEN",
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
              $match:{
                "user.parentUsers": { $in: [req.currentUser.id] }
              }  
            },
            {
                $group: {
                    _id: "$match",
                    count: { $sum: 1 },
                    eventdate: { $first: "$eventDate" },
                    eventid: { $first: "$eventId" },
                    series: { $first: "$event" },
                    sport: { $first: "$betType" }
                }
            },
            {
                $project: {
                    _id: 0,
                    matchName: "$_id",
                    eventdate: 1,
                    eventid: 1,
                    series: 1,
                    count: 1,
                    sport: 1
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 5
            }
        ]);
        
        console.log(betsEventWise, "betsEventWise")
        turnOver = await accountModel.aggregate([
            {
                $match:{
                    user_id:req.currentUser._id
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: { $abs: "$creditDebitamount" } },
                    Income : {$sum: '$creditDebitamount'},
                }
            }
        ])



        let topBets = await betModel.aggregate([
            {
                $sort: {
                    Stake: -1,
                    oddValue: -1,
                }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: "users",
                    let: { userName: "$userName" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$$userName", "$userName"] },
                                        { $in: [req.currentUser.id, "$parentUsers"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $match: {
                    status: "OPEN"
                }
            },
        ]);
        
        

        // console.log(topBets, "topBets 741258963")
    const topPlayers = await User.find({Bets:{ $nin : [0, null, undefined] }, parentUsers : { $in: [req.currentUser.id] }}).limit(5).sort({Bets:-1})
    const dashboard = {};
    dashboard.roles = roles
    dashboard.users = users
    dashboard.topPlayers = topPlayers
    dashboard.topGames = topGames
    dashboard.Categories = Categories
    dashboard.userCount = userTotalAmount
    dashboard.adminCount = adminTotalAmount
    dashboard.betCount = betCount
    dashboard.alertBet = alertBet
    dashboard.settlement = betsEventWise
    dashboard.turnOver = turnOver
    dashboard.topBets = topBets
    
    res.status(200).json({
        status:'success',
        dashboard
    })
});