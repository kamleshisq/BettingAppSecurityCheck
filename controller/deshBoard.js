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
    if(req.currentUser.role.roleName == 'Operator'){
        let parentUser = await User.findById(req.currentUser.parent_id) 
        req.currentUser = parentUser
    }
    
    let childrenUsername = []
    childrenUsername = await User.distinct('userName', { parentUsers: req.currentUser._id });
    // let children = await User.find({parentUsers:req.currentUser._id})
    // children.map(ele => {
    //     childrenUsername.push(ele.userName) 
    // })
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


    users = []
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
    topGames = []
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
    Categories = []
    Categories = await betModel.aggregate([
        {
            $match: {
                status: { $ne: "OPEN" },
                date: { $gte: sevenDaysAgo },
                userName:{$in:childrenUsername}
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

    var today = new Date();
    var todayFormatted = formatDate(today);
    function formatDate(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        return year + "-" + month + "-" + day;
    }
    const result1 = await loginLogs.aggregate([
        {
            $match: {
               
                userName:{$in:childrenUsername},
                role_Type:5
            }
        },
        {
            $group:{
                _id:'$userName',
            }
        }
    ]);
    const result2 = await loginLogs.aggregate([
        {
            $match: {
                userName:{$in:childrenUsername},
                role_Type:{$ne:5}
            }
        },
        {
            $group:{
                _id:'$userName',
            }
        }
    ]);
    const userTotalAmount = result1.length > 0?result1.length : 0;
    const adminTotalAmount = result2.length > 0?result2.length : 0;

    betCount = await betModel.countDocuments({userName: {$in:childrenUsername}})
    alertBet = []
    alertBet = await betModel.aggregate([
        {
            $match: {
                "status": "Alert",
                userName:{$in:childrenUsername}

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
    betsEventWise = []
    betsEventWise = await betModel.aggregate([
        {
            $match: {
                status: "OPEN",
                userName: {$in:childrenUsername}
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
    
    turnOver = []
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


    // let topBets = []
    let topBets = await betModel.aggregate([
        {
            $match: {
                status:"OPEN",
                userName: {$in:childrenUsername}
            }
        },
        {
            $sort:{
                Stake: -1
            }
        },
        {
            $limit:5
        }
    ])
        
        

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