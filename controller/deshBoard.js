const Roles = require('./../model/roleModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const User = require("../model/userModel");
const betModel = require("../model/betmodel");
const accountModel = require("../model/accountStatementByUserModel");

exports.dashboardData = catchAsync(async(req, res, next) => {
    console.log(req.currentUser)
    const roles = await User.aggregate([
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
    const users = await User.aggregate([
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

    let topGames = await betModel.aggregate([
        {
            $match: {
                status: { $ne: "OPEN" }
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
    ])

    // console.log(topGames)
    
    let Categories = await betModel.aggregate([
        {
            $match: {
                status: { $ne: "OPEN" }
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

    let userCount = 0
    let adminCount = 0
    let betCount = 0
    // console.log(req.currentUser.id)
        userCount = await User.countDocuments({
            roleName: 'user',
            is_Online: true,
            parentUsers : { $in: [req.currentUser.id] }
        });

        adminCount = await User.countDocuments({
            roleName: { $ne: 'user' },
            is_Online: true,
            parentUsers : { $in: [req.currentUser.id] }
        });

        betCount = await betModel.aggregate([
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
                $count: "totalBets"
              }
          ])


    // console.log(req.currentUser, 45645464)
   
        // console.log(next10Days)
    

    //   console.log(accountForGraph)

      

    // console.log(incomeArray)
    
    // for(let i = 0; i < accountForGraph.length; i++){
    //     console.log(accountForGraph[i].details)
    // }

    let alertBet = await betModel.aggregate([
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
        }
    ]);


    let betsEventWise = await betModel.aggregate([
        {
            $match: {
                status:"OPEN" 
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
        //   {
        //     $group: {
        //       _id: "$match",
        //       count: { $sum: 1 }
        //     }
        //   },
        //   {
        //     $project: {
        //       _id: 0,
        //       eventname: "$_id",
        //       count: 1
        //     }
        //   }
        {
            $group: {
              _id: "$match",
              count: { $sum: 1 },
              eventdate: { $first: "$eventDate" }, 
              eventid: { $first: "$eventId" },
              series: {$first: "$event"},
              sport: {$first : "$betType"}
            }
          },
          {
            $project: {
              _id: 0,
              matchName: "$_id",
              eventdate: 1,
              eventid: 1,
              series:1,
              count: 1,
              sport:1
            }
          },{
            $sort:{count : -1}
          },
          {
            $limit:5
          }
    ])

    let turnOver = await accountModel.aggregate([
        {
            $match:{
                user_id:req.currentUser._id
            }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: { $abs: "$creditDebitamount" } }
            }
        }
    ])
    // console.log(turnOver, 121212121)
    const topPlayers = await User.find({Bets:{ $nin : [0, null, undefined] }, parentUsers : { $in: [req.currentUser.id] }}).limit(5).sort({Bets:-1})
    const dashboard = {};
    dashboard.roles = roles
    dashboard.users = users
    dashboard.topPlayers = topPlayers
    dashboard.topGames = topGames
    dashboard.Categories = Categories
    dashboard.userCount = userCount
    dashboard.adminCount = adminCount
    dashboard.betCount = betCount
    dashboard.alertBet = alertBet
    dashboard.settlement = betsEventWise
    dashboard.turnOver = turnOver
    
    res.status(200).json({
        status:'success',
        dashboard
    })
});