const Roles = require('./../model/roleModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const User = require("../model/userModel");
const betModel = require("../model/betmodel");

exports.dashboardData = catchAsync(async(req, res, next) => {
    const roles = await User.aggregate([
        {
            $match:{
                roleName:{$ne:"Admin"}
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
                roleName:{$ne:"Admin"}
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
            $group: {
                _id: {
                    gameId: '$event',
                    userName: '$userName'
                },
                betCount: { $sum: 1 },
                loss: { $sum: { $cond: [{ $eq: ['$status', 'LOSS'] }, 1, 0] } },
                won: { $sum: { $cond: [{ $eq: ['$status', 'WON'] }, 1, 0] } },
                returns: { $sum: { $cond: [{ $eq: ['$status', 'LOSS'] }, '$returns', { $subtract: ['$returns', '$Stake'] }] } }
            }
        },
        {
            $group: {
                _id: '$_id.gameId',
                userCount: { $sum: 1 },
                totalBetCount: { $sum: '$betCount' },
                totalLoss: { $sum: '$loss' },
                totalWon: { $sum: '$won' },
                totalReturns: { $sum: '$returns' }
            }
        },
        {
            $sort: {
                totalBetCount: -1
            }
        },
        {
            $limit: 5
        }
    ])

    console.log(topGames)

    const topPlayers = await User.find({Bets:{ $nin : [0, null, undefined] }}).limit(5).sort({Bets:-1})
    const dashboard = {};
    dashboard.roles = roles
    dashboard.users = users
    dashboard.topPlayers = topPlayers
    
    res.status(200).json({
        status:'success',
        dashboard
    })
});