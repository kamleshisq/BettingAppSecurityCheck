const Roles = require('./../model/roleModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const User = require("../model/userModel");
const betModel = require("../model/betmodel");
const accountModel = require("../model/accountStatementByUserModel");

exports.dashboardData = catchAsync(async(req, res, next) => {
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
            isActive: true,
            parentUsers : { $in: [req.currentUser.id] }
        });

        adminCount = await User.countDocuments({
            roleName: { $ne: 'user' },
            isActive: true,
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
            //   {
            //     $group: {
            //       _id: "$user.userName",  // Grouping by userName
            //       totalBets: { $sum: 1 }
            //     }
            //   }
            {
                $count: "totalBets"
              }
              
              
          ])


    console.log(req.currentUser, 45645464)
   
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
            $lookup: {
                from: "bets", // Assuming the collection name is "bets"
                localField: "_id",
                foreignField: "_id",
                as: "betDetails"
            }
        },
        {
            $unwind: "$betDetails"
        }
    ]);
    console.log(alertBet)
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
    
    res.status(200).json({
        status:'success',
        dashboard
    })
});