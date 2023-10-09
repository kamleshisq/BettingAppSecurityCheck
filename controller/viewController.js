const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');
const User = require('../model/userModel');
const loginLogs = require("../model/loginLogs");
const Role = require('../model/roleModel');
const betModel = require("../model/betmodel");
const Stream = require('./../model/streammanagement')
const promotionModel = require("../model/promotion");
const roleAuth = require('../model/authorizationModel');
const gameModel = require('../model/gameModel');
const betLimitModel = require("../model/betLimitModel");
const verticalMenuModel = require("../model/verticalMenuModel");
const horizontalMenuModel = require("../model/horizontalMenuModel");
const sliderModel = require("../model/sliderModel");
const pagesModel = require("../model/pageModel");
const fetch = require("node-fetch")
const whiteLabel = require('../model/whitelableModel');
const mongoose = require("mongoose");
const SHA256 = require("../utils/sha256");
const sportList = require("../utils/getSportList");
const getCrkAndAllData = require("../utils/getSportAndCricketList");
const getmarketDetails = require("../utils/getmarketsbymarketId"); 
const fs = require('fs');
const path = require('path');
const bannerModel = require('../model/bannerModel');
const accountStatement = require("../model/accountStatementByUserModel");
const liveStreameData = require("../utils/getLiveStream");
const gameAPI = require("../utils/gameAPI");
const request = require('request');
const multimarkets = require("../model/maltimarket");
const stakeLable = require("../model/stakeLabelModel");
const gamrRuleModel = require("../model/gamesRulesModel");
const casinoFevorite = require("../model/CasinoFevorite");
const houseFundModel = require('../model/houseFundmodel');
const sattlementModel =  require("../model/sattlementModel");
const commissionModel = require("../model/CommissionModel");
const settlementHisory = require("../model/settelementHistory");
const catalogController = require("./../model/catalogControllModel");
const FeatureventModel = require('./../model/featureEventModel')
const commissionReportModel = require("../model/commissionReport");
const betLimitMatchWisemodel = require('../model/betLimitMatchWise');
const streamModel = require('../model/streammanagement');
const InprogreshModel = require('../model/InprogressModel');
const commissionMarketModel = require('../model/CommissionMarketsModel')
let eventNotification = require('../model/eventNotification');
const commissionNewModel = require('../model/commissioNNModel');
// exports.userTable = catchAsync(async(req, res, next) => {
//     // console.log(global._loggedInToken)
//     // console.log(req.token, req.currentUser);
//     // let users
//     // let users = await User.find();
//     var WhiteLabel = await whiteLabel.find()
//     var roles = await Role.find()
//     // console.log(roles)
//     var fullUrl = req.protocol + '://' + req.get('host') + '/api/v1/users/getOwnChild'
//     // console.log(fullUrl)
//     fetch(fullUrl, {
//         headers: {
//             'Content-type': 'application/json',
//             'Authorization': `Bearer ` + req.token, // notice the Bearer before your token
//         }
//     }).then(resp => resp.json()).then(result => {
//         const currentUser = global._User
//         const users = result.child
//         const rows = result.rows
//         res.status(200).render('userTable',{
//             title: "User table",
//             users,
//             rows,
//             currentUser,
//             WhiteLabel,
//             roles
//         })
//     })
// });

exports.userTable = catchAsync(async(req, res, next) => {
    // let AllUsers = await User.find()
    // for(let i = 0; i < AllUsers.length; i++){
    //     await commissionModel.create({userId:AllUsers[i].id})
    // }
    // console.log(global._loggedInToken)
    // console.log(req.token, req.currentUser);
    // let users
    // let users = await User.find();
    var WhiteLabel = await whiteLabel.find()
    // var roles = await Role.find({role_level:{$gt : req.currentUser.role.role_level}})
    let id = req.query.id;
    let page = req.query.page;
    // console.log(req.query)
    let urls;
    if(id && id != req.currentUser.parent_id){
        var isValid = mongoose.Types.ObjectId.isValid(id)

        if(!isValid){
            return res.redirect('/admin/userManagement')
        }
        urls = [
            {
                url:`http://172.105.58.243/api/v1/users/getOwnChild?id=${id}`,
                name:'user'
            },
            {
                url:`http://172.105.58.243/api/v1/role/getAuthROle`,
                name:'role'
            }
        ]
    }
    else{
        urls = [
            {
                url:`http://172.105.58.243/api/v1/users/getOwnChild`,
                name:'user'
            },
            {
                url:`http://172.105.58.243/api/v1/role/getAuthROle`,
                name:'role'
            }
        ]
    }
    // console.log(fullUrl)
    let requests = urls.map((item) => {
        return new Promise((resolve, reject) => {
          request(
            {
              url: item.url,
              headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${req.token}`,
              },
            },
            (error, response, body) => {
              if (error) {
                reject(error);
              } else {
                resolve(JSON.parse(body));
              }
            }
          );
        });
      });
    let roles1 = await Role.find({role_level:{$gt:req.currentUser.role.role_type}}).sort({role_level:1});
    const data = await Promise.all(requests);
    if(data[0].status == 'Error'){
        return res.redirect('/admin/userManagement')
    }
    const users = data[0].child;
    const roles = roles1;
    const currentUser = req.currentUser
    console.log(currentUser)
    const rows = data[0].rows
    const me = data[0].me
    // console.log(currentUser)
    res.status(200).render('./userManagement/main',{
        title: "User Management",
        users,
        rows,
        currentUser,
        me,
        WhiteLabel,
        roles
        // userLogin:global._loggedInToken
    })

   
});

exports.login = catchAsync(async(req, res, next) => {
    console.log("1")
    console.log(req.currentUser)
    if(req.currentUser){
        if(req.currentUser.role_type < 5){
           return res.redirect('/admin/dashboard')
        }
    }
    return res.status(200).render('loginPage', {
        title:"Login form"
    })
});

exports.createUser = catchAsync(async(req, res, next) => {
    let WhiteLabel = await whiteLabel.find()
    // console.log(req.currentUser)
    var fullUrl = req.protocol + '://' + req.get('host') + '/api/v1/role/getAuthROle'
    fetch(fullUrl, {
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ` + req.token, // notice the Bearer before your token
        }
    }).then(resp => resp.json()).then(result => {
        // console.log(result)
        if(result.status == "success"){
            const role = result.roles
            res.status(200).render('createUser',{
                title: "CreateUser",
                role,
                WhiteLabel,
                currentUser:req.currentUser
            })
        }else{
            res.status(200).json({
                message:"You do not have permission to perform this action"
            })
        }
    })
})

exports.accountStatement = catchAsync(async(req, res, next) => {
    // let id = req.originalUrl.split("=")[1]
    // console.log(req.query.id)
    var fullUrl = req.protocol + '://' + req.get('host') + '/api/v1/Account/getUserAccStatement?id=' + req.query.id
    fetch(fullUrl, {
        method: 'POST',
        body: req.query.id,
        headers: { 'Authorization': `Bearer ` + req.token }
}).then(res => res.json())
  .then(json => res.status(200).render("accountStatement", {
    title:"Account Statement",
    data:json.userAcc
}));
    
    
});

exports.resetPassword = catchAsync(async(req,res,next)=> {
    res.status(200).render("resetPassword",{
        id:req.query.id
    })
})

exports.updateUser = catchAsync(async(req, res, next) => {
    let urls = [
        {
            url:`http://127.0.0.1/api/v1/users/getUser?id=${req.query.id}`,
            name:'user'
        },
        {
            url:`http://127.0.0.1/api/v1/role/getAuthROle`,
            name:'role'
        }
    ]
    // console.log(urls)
    let requests = urls.map(item => fetch(item.url, {
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ` + req.token, // notice the Bearer before your token
        }
    }).then(data => data.json()));
    const resultData = {user:[], role:[]};
    // console.log('here')
    const data = await Promise.all(requests)
    // console.log(data)
    const user = data[0].user;
    const role = data[1].roles;
    res.status(200).render('editUser',{
        user,
        role
    })

        
});

exports.getCreditDebitPage = catchAsync(async(req, res, next) => {
    res.status(200).render("DebitCredit")
});

exports.createRole = catchAsync(async(req, res, next) => {
    var fullUrl = req.protocol + '://' + req.get('host') + '/api/v1/role/getAuthROle'
    fetch(fullUrl, {
        method: 'get',
        headers: { 'Authorization': `Bearer ` + req.token }
    }).then(res => res.json()).then(result => {
        res.status(200).render('createRole',{
            roles:result.roles
        })
    })
      
});

exports.getUpdateRolePage = catchAsync(async(req, res, next) => {
    var fullUrl = req.protocol + '://' + req.get('host') + '/api/v1/role/getAllRoles'
    fetch(fullUrl, {
        method: 'get',
        headers: { 'Authorization': `Bearer ` + req.token }
    }).then(res => res.json()).then(result => {
        res.status(200).render("updateRole",{
            roles:result.roles
        })
        // console.log(result)
    })
    // res.status(200).render("updateRole")
});

exports.dashboard = catchAsync(async(req, res, nex) => {
    var fullUrl = req.protocol + '://' + req.get('host') + '/api/v1/deshBoard/getDeshboardUserManagement'
    fetch(fullUrl, {
        method: 'get',
        headers: { 'Authorization': `Bearer ` + req.token }
    }).then(res => res.json()).then(result => {
        // console.log(result.dashboard)
        const currentUser = req.currentUser
        res.status(200).render('./adminSideDashboard/dashboard',{
            title:"Dashboard",
            data:result,
            me:currentUser,
            currentUser
        })
    })
});


exports.inactiveUser = catchAsync(async(req, res, next) => {
    const roles = await Role.find({role_level: {$gt:req.currentUser.role.role_level}});
    let role_type =[]
    for(let i = 0; i < roles.length; i++){
        role_type.push(roles[i].role_type)
    }
    const currentUser = req.currentUser
    let users
    if(currentUser.role_type == 1){
        users = await User.find({isActive:false})
    }else{
        users = await User.find({role_type:{$in:role_type},isActive:false , whiteLabel:currentUser.whiteLabel})
    }
    res.status(200).render('inactiveUser',{
        title:"Inavtive Users",
        users,
        currentUser
    })
});
exports.onlineUsers = catchAsync(async(req, res, next) => {
    let limit = 10;
    // const roles = await Role.find({role_level: {$gt:req.currentUser.role.role_level}});
    // let role_type =[]
    // for(let i = 0; i < roles.length; i++){
    //     role_type.push(roles[i].role_type)
    // }
    const currentUser = req.currentUser
    // let users
    // if(req.currentUser.role_type == 1){
    //     users = await User.find({is_Online:true})
    // }else{
    //     users = await User.find({role_type:{$in:role_type},is_Online:true , whiteLabel:req.currentUser.whiteLabel, parentUsers:{$elemMatch:{$eq:req.currentUser.id}}})
    // }
    let users = await User.find({is_Online:true , parentUsers:{$in:[currentUser._id]}}).limit(limit)
    let me = req.currentUser
    res.status(200).render('./onlineUsers/onlineUsers',{
        title:"Online Users",
        users,
        currentUser,
        me
    })
});

exports.userDetailsAdminSide = catchAsync(async(req, res, next) => {
    // console.log(req.query.id)
    let currentUser = req.currentUser
    let userDetails = await User.findById(req.query.id)
    // if(userDetails.roleName)
    // console.log(userDetails)
    let limit = 10
    let bets
    let betsDetails
    if(userDetails.roleName != "user"){
        let childrenUsername = []
        let children = await User.find({parentUsers:req.query.id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
        bets = await betModel.aggregate([
            {
                $match: {
                    userName: { $in: childrenUsername }
                }
            },
            {
                $sort: {
                    date: -1
                }
            },
            {
                $limit: limit
            }
        ])

        betsDetails = await betModel.aggregate([
            {
                $match: {
                    userName: { $in: childrenUsername }
                }
            },
            {
                $group: {
                    _id: null,
                    totalReturns: { $sum: '$returns' },
                    totalCount: { $sum: 1 }
                }
            }
        ])
        
    }else{
        bets = await betModel.find({userId:req.query.id}).sort({date:-1}).limit(limit)
        betsDetails = await betModel.aggregate([
            {
                $match:{
                    userId:req.query.id
                }
            },
            {
                $group: {
                  _id: null,
                  totalReturns: { $sum: '$returns' },
                  totalCount: { $sum: 1 }
                }
              }
        ])
    }

    let ACCount = await accountStatement.find({user_id:req.query.id}).sort({date: -1}).limit(limit)
    let historty = await loginLogs.find({userName:userDetails.userName}).sort({login_time:-1}).limit(limit)
    // console.log(bets)
    // console.log(betsDetails)
    res.status(200).render("./userDetailsAdmin/main",{
        title:"User Details",
        userDetails,
        currentUser,
        me:currentUser,
        bets,
        betsDetails,
        ACCount,
        historty

    })
})

exports.profile = catchAsync(async(req,res,next)=>{
    res.status(200).render("./myProfile/myprofile",{
        title:"User Details",
        currentUser:req.currentUser

    })
})


exports.updatePass = catchAsync(async(req, res, next) => {
    res.status(200).render('updatePassword')
});
exports.updateUserPass = catchAsync(async(req, res, next) => {
    res.status(200).render('./user/passwordUpdate')
});

exports.userLogin = catchAsync(async(req, res, next) => {
    res.status(200).render("./user/userLoginPage")
});
exports.registration = catchAsync(async(req, res, next) => {
    res.status(200).render("./user/registration")
});

exports.userdashboard = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    const data = await promotionModel.find();
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const banner = await bannerModel.find()
    let sliders = await sliderModel.find().sort({Number:1})
    let pages = await pagesModel.find()
    const sportListData = await getCrkAndAllData()
    const cricket = sportListData[0].gameList[0].eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    let featureEventId = []
    let featureStatusArr = await FeatureventModel.find();
    featureStatusArr.map(ele => {
        featureEventId.push(parseInt(ele.Id))
    })
    let LiveCricket = cricket.filter(item => featureEventId.includes(item.eventData.eventId))
    let footBall = sportListData[1].gameList.find(item => item.sport_name === "Football")
    let Tennis = sportListData[1].gameList.find(item => item.sport_name === "Tennis")
    footBall = footBall.eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    Tennis = Tennis.eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    let liveFootBall = footBall.filter(item => featureEventId.includes(item.eventData.eventId));
    let liveTennis = Tennis.filter(item => featureEventId.includes(item.eventData.eventId))
    let userLog
    if(user){
        userLog = await loginLogs.find({user_id:user._id})
    }
    res.status(200).render("./userSideEjs/home/homePage",{
        title:'Home',
        user,
        data,
        verticalMenus,
        banner,
        sliders,
        pages,
        check:"Home",
        userLog,
        LiveCricket,
        liveFootBall,
        liveTennis,
        notifications:req.notifications,
        featureStatusArr
    })
})

exports.edit = catchAsync(async(req, res, next) => {
    const user = req.currentUser;
    res.status(200).render('./user/edit',{
        user
    })
})

exports.myAccountStatment = catchAsync(async(req, res, next) => {
    // let id = req.originalUrl.split("=")[1]
    let userLog
    if(req.currentUser){
        userLog = await loginLogs.find({user_id:req.currentUser._id})
    }
    // console.log(req.query.id)
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    let userAcc = await accountStatement.find({user_id:req.currentUser._id}).sort({date: -1}).limit(20)
    // var fullUrl = req.protocol + '://' + req.get('host') + '/api/v1/Account/getMyAccStatement'
    // fetch(fullUrl, {
    //     method: 'POST',
    //     headers: { 'Authorization': `Bearer ` + req.token }
    // }).then(res => res.json())
    // .then(json =>
    //     console.log(json) 
        res.status(200).render("./userSideEjs/AccountStatements/main", {
        title:"Account Statement",
        data:userAcc,
        user:req.currentUser,
        verticalMenus,
        check:"ACCC",
        userLog,
        notifications:req.notifications
    })
    // )
});

exports.myProfile = catchAsync(async(req, res, next) => {
    // let id = req.originalUrl.split("=")[1]
    let userLog
    if(req.currentUser){
        userLog = await loginLogs.find({user_id:req.currentUser._id})
    }
    // console.log(req.query.id)
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    // var fullUrl = req.protocol + '://' + req.get('host') + '/api/v1/Account/getMyAccStatement'
    // fetch(fullUrl, {
    //     method: 'POST',
    //     headers: { 'Authorization': `Bearer ` + req.token }
    // }).then(res => res.json())
    // .then(json =>
    //     console.log(json) 
        res.status(200).render("./userSideEjs/myProfile/main", {
        title:"My Profile",
        user:req.currentUser,
        verticalMenus,
        check:"ACCC",
        userLog,
        notifications:req.notifications
    })
    // )
});


exports.APIcall = catchAsync(async(req, res, next) => {
    var fullUrl = 'https://stage-api.mysportsfeed.io/api/v1/feed/user-login';
    fetch(fullUrl, {
        method: 'POST',
        headers: { 
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Signature':'mpc' 
            },
        body:JSON.stringify({
            "clientIp": "46.101.225.192",
            "currency": "INR",
            "operatorId": "sheldon",
            "partnerId": "SHPID01",
            "platformId": "DESKTOP",
            "userId": `TEST123`,
            "username": "TEST123"
           })

    })
    .then(res => res.json())
    .then(result => {

        console.log(result)
        res.status(200).json({
            status:"success",
            result
        })
    }
    )
});


exports.ReportPage = catchAsync(async(req, res, next) => {
    const currentUser = req.currentUser
    let childrenUsername = []
    if(req.currentUser.roleName == 'Operator'){
        let children = await User.find({parentUsers:req.currentUser.parent_id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
    }else{
        let children = await User.find({parentUsers:req.currentUser._id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
    }
    let bets = await betModel.aggregate([
        {
            $match: {
              status: {$ne:"OPEN"},
              userName:{$in:childrenUsername}
            }
        },
        {
            $sort:{
                date:-1
            }
        },
        { $limit : 10 }
    ])
    console.log(bets)

    res.status(200).render("./reports/reports",{
        title:"Bet List",
        bets:bets,
        me : currentUser,
        currentUser
    })

    // User.aggregate([
    //     {
    //       $match: {
    //         parentUsers: { $elemMatch: { $eq: req.currentUser.id } }
    //       }
    //     },
    //     {
    //       $group: {
    //         _id: null,
    //         userIds: { $push: '$_id' } 
    //       }
    //     }
    //   ])
    //     .then((userResult) => {
    //       const userIds = userResult.length > 0 ? userResult[0].userIds.map(id => id.toString()) : [];
      
    //       betModel.aggregate([
    //         {
    //           $match: {
    //             userId: { $in: userIds },
    //             status: {$ne:"OPEN"}
    //           }
    //         },
    //         {
    //             $sort:{
    //                 date:-1
    //             }
    //         },
    //         { $limit : 10 }
    //       ])
    //         .then((betResult) => {
    //         //   socket.emit("aggreat", betResult)
    //             res.status(200).render("./reports/reports",{
    //                 title:"Reports",
    //                 bets:betResult,
    //                 me : currentUser,
    //                 currentUser
    //             })
    //         })
    //         .catch((error) => {
    //           console.error(error);
    //         });
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // res.status(200).render('./reports/reports',{
    //     title:"Reports",
    //     me:currentUser,
    //     bets
    // })
})

exports.gameReportPage = catchAsync(async(req, res, next) => {
    const currentUser = req.currentUser
    let childrenUsername = []
    if(req.currentUser.roleName == 'Operator'){
        let children = await User.find({parentUsers:req.currentUser.parent_id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
    }else{
        let children = await User.find({parentUsers:req.currentUser._id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
    }

    let betResult = await betModel.aggregate([
    {
        $match: {
        userName: { $in: childrenUsername },
        status: {$ne:"OPEN"}
        }
    },
    {
        $group:{
            _id:{
                userName:'$userName',
                gameId: '$event'
            },
            gameCount:{$sum:1},
            loss:{$sum:{$cond:[{$eq:['$status','LOSS']},1,0]}},
            won:{$sum:{$cond:[{$eq:['$status','WON']},1,0]}},
            returns:{$sum:{$cond:[{$eq:['$status','LOSS']},'$returns',{ "$subtract": [ "$returns", "$Stake" ] }]}}
            
        }
    },
    {
        $group:{
            _id:'$_id.userName',
            gameCount:{$sum:1},
            betCount:{$sum:'$gameCount'},
            loss:{$sum:'$loss'},
            won:{$sum:'$won'},
            returns:{$sum:'$returns'}

        }
    },
    {
        $sort: {
            _id: 1,
            returns: 1
        }
    },
    {
        $skip:0
    },
    {
        $limit:10
    }
    ])

    res.status(200).render('./gamereports/gamereport',{
        title:"Game Reports",
        me:currentUser,
        games:betResult,
        currentUser
    })
         

    // let roles
    // if(currentUser.role_type == 1){
    //     roles = await Role.find();
    // }else{
    //     roles = await Role.find({role_level: {$gt:req.currentUser.role.role_level}});
    // }
    //     let role_type =[]
    //     for(let i = 0; i < roles.length; i++){
    //         role_type.push(roles[i].role_type)
    //     }
    // const games = await betModel.aggregate([
    //     {
    //         $match:{
    //             role_type:{$in:role_type}
    //         }
    //     },
    //     {
    //         $group:{
    //             _id:{
    //                 userName:'$userName',
    //                 gameId: '$event'
    //             },
    //             gameCount:{$sum:1},
    //             loss:{$sum:{$cond:[{$eq:['$status','LOSS']},1,0]}},
    //             won:{$sum:{$cond:[{$eq:['$status','WON']},1,0]}},
    //             returns:{$sum:{$cond:[{$eq:['$status','LOSS']},'$returns',{ "$subtract": [ "$returns", "$Stake" ] }]}}
                
    //         }
    //     },
    //     {
    //         $group:{
    //             _id:'$_id.userName',
    //             gameCount:{$sum:1},
    //             betCount:{$sum:'$gameCount'},
    //             loss:{$sum:'$loss'},
    //             won:{$sum:'$won'},
    //             returns:{$sum:'$returns'}

    //         }
    //     },
    //     {
    //         $skip:0
    //     },
    //     {
    //         $limit:10
    //     }
    // ])
    // // console.log(games)
    // res.status(200).render('./gamereports/gamereport',{
    //     title:"gameReports",
    //     me:currentUser,
    //     games
    // })
})

exports.myaccount = catchAsync(async(req, res, next) => {
    const currentUser = req.currentUser
    // console.log(currentUser)
    let operatorId;
    if(req.currentUser.roleName == 'Operator'){
        operatorId = req.currentUser.parent_id
    }else{
        operatorId = req.currentUser._id
    }
    var fullUrl = req.protocol + '://' + req.get('host') + '/api/v1/Account/getUserAccStatement?id=' + operatorId 
    fetch(fullUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ` + req.token }
    }).then(res => res.json())
    .then(json =>{ 
        // console.log(json)
        const data = json.userAcc
        res.status(200).render('./userAccountStatement/useracount',{
        title:"My Account Statement",
        me:currentUser,
        data,
        currentUser
    })
});

    
})
exports.adminaccount = catchAsync(async(req, res, next) => {
    const currentUser = req.currentUser
    // console.log(currentUser)
    let operatorId;
    if(req.currentUser.roleName == 'Operator'){
        operatorId = req.currentUser.parent_id
    }else{
        operatorId = req.currentUser._id
    }
    var fullUrl = req.protocol + '://' + req.get('host') + '/api/v1/Account/getUserAccStatement1?id=' + operatorId 
    fetch(fullUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ` + req.token }
    }).then(res => res.json())
    .then(json =>{ 
        // console.log(json)
        const data = json.userAcc
        res.status(200).render('./userAccountStatement/adminAccountStatment',{
        title:"Admin Account Statement",
        me:currentUser,
        data,
        currentUser
    })

})

    
})
exports.useracount = catchAsync(async(req, res, next) => {
    const currentUser = req.currentUser
    res.status(200).render('./userAccountStatement/userAccountStatment',{
        title:"User Account Statement",
        me:currentUser,
        data:[],
        currentUser
    })

    
})

exports.userhistoryreport = catchAsync(async(req, res, next) => {
    // const currentUser = global._User
    const currentUser = req.currentUser
    let limit = 10;
    let childrenUsername = []
    if(req.currentUser.roleName == 'Operator'){
        let children = await User.find({parentUsers:req.currentUser.parent_id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
    }else{
        let children = await User.find({parentUsers:req.currentUser._id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
    }
    let Logs = await loginLogs.aggregate([
      
        {
            $match:{
               userName : {$in:childrenUsername}
            }
        },
        {
            $sort:{
                login_time:-1
            }
        },
        {
            $limit:10
        }
    ])

    // console.log(Logs)

    res.status(200).render('./userHistory/userhistoryreport',{
        title:"User History",
        me:currentUser,
        Logs,
        currentUser
    })

    // User.aggregate([
    //     {
    //       $match: {
    //         parentUsers: { $elemMatch: { $eq: req.currentUser.id } }
    //       }
    //     },
    //     {
    //       $group: {
    //         _id: null,
    //         userIds: { $push: '$_id' } 
    //       }
    //     }
    //   ])
    //     .then((userResult) => {
    //       const userIds = userResult.length > 0 ? userResult[0].userIds : [];
    //     loginLogs.aggregate([
    //         {
    //           $match:{
    //             user_id:{$in:userIds}
    //           }
    //         },{
    //             $sort:{
    //                 login_time:-1
    //             }
    //         },
    //         {
    //             $limit:10
    //         }
    //       ])
    //         .then((Logs) => {
    //         //   socket.emit("aggreat", betResult)
    //         res.status(200).render('./userHistory/userhistoryreport',{
    //             title:"UserHistory",
    //             me:currentUser,
    //             Logs,
    //             currentUser
    //         })
    //         })
    //         .catch((error) => {
    //           console.error(error);
    //         });
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    })

exports.plreport = catchAsync(async(req, res, next) => {
    let currentUser = req.currentUser
    let users;
    if(req.currentUser.roleName == 'Operator'){
        users = await User.find({parentUsers:req.currentUser.parent_id}).limit(10)
       
    }else{
        users = await User.find({parentUsers:req.currentUser._id}).limit(10)
       
    }
        // console.log(users)
    res.status(200).render('./PL_Report/plreport',{
        title:"P/L Report",
        me:currentUser,
        users:users,
        currentUser
    })
    
    
});

exports.roleManagement = catchAsync(async(req, res, next) => {
    const currentUser = req.currentUser
    const roles = await Role.find().sort({role_level:1})
    const Auth = await roleAuth.find()
    // console.log(Auth[0].UserControll);
    res.status(200).render("./roleManagement/roleManagement", {
        title:"Role Management",
        me:currentUser,
        roles,
        roleAuth:Auth[0],
        currentUser
    })
});

exports.APIcall2 = catchAsync(async(req, res, next) => {
    // console.log("Working")
    // Example usage
    function readPem (filename) {
        return fs.readFileSync(path.resolve(__dirname, '../prev/' + filename)).toString('ascii');
      }
const privateKey = readPem('private.pem');
let body = {
    "operatorId": "sheldon",
    "userId":"6438f3b5d2eb67c8f67fe065",
    "providerName": "EZUGI",
    "platformId":"DESKTOP",
    "currency":"INR",
    "username":"user1",
    "lobby":false,
    "clientIp":"46.101.225.192",
    "gameId":"105001",
    "balance":766
   }
// console.log(privateKey)
const textToSign = JSON.stringify(body)
// console.log(privateKey, textToSign)
const hashedOutput = SHA256(privateKey, textToSign);
// console.log(hashedOutput)

    var fullUrl = 'https://dev-api.dreamdelhi.com/api/operator/login';
    fetch(fullUrl, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Signature': hashedOutput ,
            'accept': 'application/json'
            },
        body:JSON.stringify(body)

    })
    .then(res => res.json())
    .then(result => {
        res.status(200).json({
            result
        })
    })
});

exports.getPromotionPage = catchAsync(async(req, res, next) => {
    const data = await promotionModel.find()
    let currentUser = req.currentUser
    // console.log(data)
    res.status(200).render("./promotion/promotion",{
        title:"Promotion",
        data,
        currentUser
    })
});

exports.getoperationsPage = catchAsync(async(req, res, next) => {
    const me = req.currentUser
    const fundList = await houseFundModel.find({userId:me.id}).sort({date:-1}).limit(10)
    res.status(200).render("./operations/operation",{
        title:"House Management",
        me,
        currentUser:me,
        fundList
    })
})

exports.getSettlementPage = catchAsync(async(req, res, next) => {
    const me = req.currentUser
    // console.log(me)
    let settlement
    settlement = await sattlementModel.findOne({userId:me.id})
    if(settlement === null){
        settlement = await sattlementModel.create({userId:me.id})
    }
    const currentDate = new Date(); // Current date
    const fiveDaysAgo = new Date(currentDate);
    fiveDaysAgo.setDate(currentDate.getDate() - 5);
    let childrenUsername = []
    if(req.currentUser.roleName == 'Operator'){
        let children = await User.find({parentUsers:req.currentUser.parent_id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
    }else{

        let children = await User.find({parentUsers:req.currentUser._id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
    }
    let betsEventWise = await betModel.aggregate([
        {
          $match: {
            eventDate: {$gte: fiveDaysAgo},
            userName:{$in:childrenUsername}
          }
        },
        {
          $group: {
            _id: {
              betType: "$betType",
              eventid: "$eventId"
            },
            count: { $sum: 1 },
            eventdate: { $first: "$eventDate" }, 
            matchName: { $first: "$match" },
            series: {$first: "$event"},
            count2: { 
                $sum: {
                  $cond: [{ $eq: ["$status", "OPEN"] }, 1, 0],
                },
            },
          }
        },
        {
          $group: {
            _id: "$_id.betType",
            data: {
              $push: {
                matchName: "$matchName",
                count: "$count",
                eventdate : '$eventdate',
                eventid : "$_id.eventid",
                series : '$series',
                count2: "$count2",
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            id: "$_id", 
            data: 1
          }
        },
        {
            $sort:{
                'data.eventdate':-1
            }
        }
      ]);
    console.log(betsEventWise[0].data, '==>DATA')
    res.status(200).render("./sattelment/setalment",{
        title:"Settlements",
        me,
        currentUser:me,
        settlement,
        betsEventWise
    })
})

exports.WhiteLabelAnalysis = catchAsync(async(req, res, next) => {
    const roles = await Role.find({role_level: {$gt:req.currentUser.role.role_level}});
        let role_type =[]
        for(let i = 0; i < roles.length; i++){
            role_type.push(roles[i].role_type)
        }
    let fWhitlabel;
    if(req.currentUser.role_type == 1){
        fWhitlabel = {$ne:null}
    }else{
        fWhitlabel = req.currentUser.whiteLabel
    }
    
    const whiteLabelWise = await User.aggregate([
        {
            $match:{
                roleName:{$ne:'Admin'},
                role_type:{$in:role_type},
                whiteLabel:fWhitlabel,
                parentUsers:{$elemMatch: { $eq:  req.currentUser.id}}
            }
        },
        {
            $group:{
                _id:'$whiteLabel',
                activeUser:{$sum:{$cond:[{$eq:['$isActive',true]},1,0]}},
                onLineUser:{$sum:{$cond:[{$eq:['$is_Online',true]},1,0]}},
                pL:{$sum:"$myPL"}
            }
        },
        {
            $project: {
              _id: 1,
              activeUser: 1,
              onLineUser: 1,
              pL: { $round: ['$pL', 2] } 
            }
          }
    ])
    const me = req.currentUser
    // console.log(whiteLabelWise)
    res.status(200).render("./whiteLableAnalysis/whiteLableAnalysis",{
        title:"White Lable Analysis",
        whiteLabelWise,
        me,
        currentUser:me
        // activeUser,
        // AWhitelabel
    })
}),

exports.gameAnalysis =  catchAsync(async(req, res, next) => {
    const roles = await Role.find({role_level: {$gt:req.currentUser.role.role_level}});
        let role_type =[]
        for(let i = 0; i < roles.length; i++){
            role_type.push(roles[i].role_type)
        }
    let fWhitlabel;
    if(req.currentUser.role_type == 1){
        fWhitlabel = {$ne:null}
    }else{
        fWhitlabel = req.currentUser.whiteLabel
    }
    // const gameAnalist = await betModel.aggregate([
    //     {
    //         $lookup:{
    //             from:'users',
    //             localField:'userName',
    //             foreignField:'userName',
    //             as:'userDetails'
    //         }
    //     },
    //     {
    //         $unwind:'$userDetails'
    //     },
    //     {
    //         $match:{
    //             'userDetails.isActive':true,
    //             'userDetails.roleName':{$ne:'Admin'},
    //             'userDetails.role_type':{$in:role_type},
    //             'userDetails.parentUsers':{$elemMatch:{$eq:req.currentUser.id}}
    //         }
    //     },
    //     {
    //         $group:{
    //             _id:{
    //                 userName:'$userName',
    //                 whiteLabel:'$userDetails.whiteLabel'
    //             },
    //             betCount:{$sum:1},
    //             loss:{$sum:{$cond:[{$eq:['$status','LOSS']},1,0]}},
    //             won:{$sum:{$cond:[{$eq:['$status','WON']},1,0]}},
    //             open:{$sum:{$cond:[{$in:['$status',['MAP','OPEN']]},1,0]}},
    //             void:{$sum:{$cond:[{$eq:['$status','CANCEL']},1,0]}},
    //             returns:{$sum:{$cond:[{$in:['$status',['LOSS','OPEN']]},'$returns',{ "$subtract": [ "$returns", "$Stake" ] }]}}
                
    //         }
    //     },
    //     {
    //         $group:{
    //             _id:'$_id.whiteLabel',
    //             Total_User:{$sum:1},
    //             betcount:{$sum:'$betCount'},
    //             loss:{$sum:'$loss'},
    //             won:{$sum:'$won'},
    //             open:{$sum:'$open'},
    //             void:{$sum:'$void'},
    //             returns:{$sum:'$returns'}
    //         }
    //     },
    //     {
    //         $sort: {
    //             betcount: -1 ,
    //             open : -1,
    //             won : -1,
    //             loss : -1,
    //             Total_User:-1
    //         }
    //     },
    //     {
    //         $limit: 10 
    //     }
    // ])
    // console.log(gameAnalist)

    const me = req.currentUser
    res.status(200).render("./gameAnalysis/gameanalysis",{
        title:"Game Analysis",
        // gameAnalist,
        me,
        currentUser:me
    })
})

exports.getStreamManagementPage = catchAsync(async(req, res, next) => {
    const me = req.currentUser
    const sportData = await getCrkAndAllData()
    let cricketList;
    cricketList = sportData[0].gameList[0]
    const sportList =[
        {sport_name:"Cricket",sportId:4}	,
        {sport_name:"Football",sportId:1}	,
        {sport_name:"Tennis",sportId:2}
    ]
   
    const streams = await Stream.find()
    res.status(200).render("./streamManagement/streammanagement",{
        title:"Stream Management",
        me,
        currentUser:me,
        cricketList,
        streams,
        sportList
    })
})

exports.getStreamEventListPage = catchAsync(async(req, res, next)=>{
    const sportData = await getCrkAndAllData()
    const sportId = req.query.sportId;
    const me = req.currentUser
    let cricketEvents;
    let footballEvents;
    let tennisEvents;
    let sportList;
    let eventList = [];
    let sportName;
   
    let data = {};

    if(sportId == '4'){
        sportList = sportData[0].gameList[0]
    }else{
        sportList = sportData[1].gameList.find(item => item.sportId == parseInt(sportId))
    }
    
    if(sportList){
        sportName = sportList.sport_name;
        let newSportList = sportList.eventList.map(async(item) => {
            if(item.eventData.type == 'IN_PLAY' && item.eventData.isTv == 1){
                let stream = await Stream.findOne({sportId:sportId,eventId:item.eventData.eventId})
                let liveStream = await liveStreameData(item.eventData.channelId)
                console.log(liveStream,'liveStrem')
                let status;
                let url;
                if(stream){
                    status = stream.status
                    if(stream.url != ''){
                        url = stream.url
                    }else{
                        const src_regex = /src='([^']+)'/;
                        let match1
                        if(liveStream.data){
                            match1 = liveStream.data.match(src_regex);
                            if (match1) {
                                url = match1[1];
                            } else {
                                console.log("No 'src' attribute found in the iframe tag.");
                            }
                            console.log(url, 123)
                        }
                    
                    }
                    eventList.push({eventId:item.eventData.eventId,sportId,created_on:item.eventData.created_on,eventName:item.eventData.name,sportName:sportName,status,url})
                }else{
                    const src_regex = /src='([^']+)'/;
                    let match1
                    if(liveStream.data){
                        match1 = liveStream.data.match(src_regex);
                        if (match1) {
                            url = match1[1];
                        } else {
                            console.log("No 'src' attribute found in the iframe tag.");
                        }
                        // console.log(src, 123)
                    }
                    eventList.push({eventId:item.eventData.eventId,sportId,created_on:item.eventData.created_on,eventName:item.eventData.name,sportName:sportName,status:true,url})

                }
            }
        })

        Promise.all(newSportList).then(()=>{
            console.log(eventList)
            res.status(200).render("./streamManagement/events",{
                title:"Stream Management",
                me,
                currentUser:me,
                eventList
            })
        })

    }else{
        res.status(200).render("./streamManagement/events",{
            title:"Stream Management",
            me,
            currentUser:me,
            eventList
        })
    }


})

exports.getNotificationsPage = catchAsync(async(req, res, next) => {
    const me = req.currentUser
    let notifications
    var fullUrl = "http://127.0.0.1/api/v1/notification/myNotifications"
    await fetch(fullUrl, {
        method:"GET",
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ` + req.token, // notice the Bearer before your token
        }
    }).then(resp => resp.json()).then(result => {
        notifications = result
    })
    res.status(200).render("./Notifications/Notification",{
        title:"Notification",
        me,
        notifications:notifications.notifications,
        currentUser:me
    })
})

exports.getBetMoniterPage = catchAsync(async(req, res, next) => {
    // console.log(req.currentUser)
    // const roles = await Role.find({role_level: {$gt:req.currentUser.role.role_level}});
    // let role_type =[]
    // for(let i = 0; i < roles.length; i++){
    //     role_type.push(roles[i].role_type)
    // }
    // // console.log(await betModel.find({status:'OPEN'}).limit(10))
    // let bets
    // if(req.currentUser.role.role_level == 1){
    //     bets = await betModel.find({status:'OPEN'}).limit(10)
    // }else{
    //     bets = await betModel.find({role_type:{$in:role_type},status:'OPEN'}).limit(10)
    // }
    // console.log(bets)
    let limit = 10;
    // const sportListData = await getCrkAndAllData()
    // let events = sportListData[0].gameList[0].eventList
    // sportListData[1].gameList.map(ele => {
    //     events = events.concat(ele.eventList)
    // })
    let whiteLabels;
    if(req.currentUser.role.role_level == 1){
        whiteLabels = await whiteLabel.find()
    }

    let childrenUsername = []
    if(req.currentUser.roleName == "Operator"){
        let children = await User.find({parentUsers:req.currentUser.parent_id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
    }else{
        let children = await User.find({parentUsers:req.currentUser._id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
    }
    var today = new Date();
    var todayFormatted = formatDate(today);
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() - 1);
    var tomorrowFormatted = formatDate(tomorrow);
    function formatDate(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        return year + "-" + month + "-" + day;
    }

    let betResult = await betModel.aggregate([
        {
          $match: {
            userName: { $in: childrenUsername },
            date:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))}          
            }
        },
        {
            $sort:{
                date:-1
            }
        },
        { $limit : limit }
    ])

    let events = await betModel.aggregate([
        {
            $match: {
              userName: { $in: childrenUsername },
              date:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))}          
              }
        },
        {
            $group:{
                _id:'$match',
                eventId:{$first:'$eventId'}
            }
        }
    ])

   
    let me = req.currentUser
    res.status(200).render("./betMonitering/betmoniter",{
        title:"Bet Moniter",
        bets:betResult,
        me,
        currentUser:me,
        events,
        whiteLabels
    })
           
})

exports.getBetAlertPage = catchAsync(async(req, res, next) => {
    var today = new Date();
    var todayFormatted = formatDate(today);
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() - 7);
    var tomorrowFormatted = formatDate(tomorrow);
    function formatDate(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        return year + "-" + month + "-" + day;
    }
    let childrenUsername = []
    if(req.currentUser.roleName == "Operator"){
        let children = await User.find({parentUsers:req.currentUser.parent_id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
    }else{
        let children = await User.find({parentUsers:req.currentUser._id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
    }
    let betResult = await betModel.aggregate([
        {
          $match: {
            userName: { $in: childrenUsername },
            alertStatus:{$in:['ALERT','CANCLE','ACCEPT']},
            date:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))}          
          }
        },
        {
            $sort:{
                date: -1
            }
        },
        { $limit : 10 }
      ])
    //   socket.emit("aggreat", betResult)
    let me = req.currentUser
        res.status(200).render("./alertBet/alertbet", {
        title:"Alert Bet",
        bets:betResult,
        me,
        currentUser:me
    })
          
})

exports.getCasinoControllerPage = catchAsync(async(req, res, next) => {
    let data;
    let RG;
    let currentUser = req.currentUser
    data = await gameModel.find({game_name:new RegExp("32 Cards","i")})
    RG = await gameModel.find({sub_provider_name:"Royal Gaming"})
    // console.log(RG.length)
    res.status(200).render("./casinoController/casinocontrol", {
        title:"Casino Controller",
        data:data,
        RG,
        currentUser,
        me: currentUser
    })
})

exports.promotion = catchAsync(async(req, res, next) => {
    const data = await promotionModel.find()
    res.status(200).render("promotionpage",{
        
        data
    })
});

exports.getAllCasinoPageFOrTEsting = catchAsync(async(req, res, next) => {
    const data = await gameModel.find({status:true});
    let user = req.currentUser
    res.status(200).render('allCasinoGame', {
        title:"All Games",
        data,
        user
    })
});

exports.url123 = catchAsync(async(req, res, next) => {
    global.url123 = "123/SPORT"
    next()
})

exports.getSpoertPage = catchAsync(async(req, res, next) => {
    
    // console.log(req.body.url)
    global.url123 = "/SPORT"
    let user = req.currentUser
    res.status(200).render("sport",{
        title:"Sports",
        url: req.body.url,
        user
    })
});


exports.getVoidBetPage = catchAsync(async(req, res, next) => {
    // const roles = await Role.find({role_level: {$gt:req.currentUser.role.role_level}});
    // let role_type =[]
    // for(let i = 0; i < roles.length; i++){
    //     role_type.push(roles[i].role_type)
    // }
    // // console.log(await betModel.find({status:'OPEN'}).limit(10))
    // let bets
    // if(req.currentUser.role.role_level == 1){
    //     bets = await betModel.find({status:'CANCEL'}).limit(10)
    // }else{
    //     bets = await betModel.find({role_type:{$in:role_type},status:'CANCEL'}).limit(10)
    // }
    let limit = 10;
    let childrenUsername = []
    if(req.currentUser.roleName == 'Operator'){
        let children = await User.find({parentUsers:req.currentUser.parent_id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
    }else{
        let children = await User.find({parentUsers:req.currentUser._id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
    }
    var today = new Date();
    var todayFormatted = formatDate(today);
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() - 1);
    var tomorrowFormatted = formatDate(tomorrow);
    function formatDate(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        return year + "-" + month + "-" + day;
    }

    let betResult = await betModel.aggregate([
        {
            $match:{
                status: 'CANCEL',
                userName:{$in:childrenUsername},
                date:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))}          
            }
        },
        {
            $sort:{
                date:-1
            }
        },
        {
            $limit:limit
        }
    ])
    let events = await betModel.aggregate([
        {
            $match:{
                status: 'CANCEL',
                userName:{$in:childrenUsername},
                date:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))}          
            }
        },
        {
            $group:{
                _id:'$match',
                eventId:{$first:'$eventId'}
            }
        }
    ])

    let me = req.currentUser
    res.status(200).render("./voidBet/voidBet",{
        title:"Void Bets",
        bets:betResult,
        me,
        currentUser:me,
        events
    })
});


exports.getBetLimitPage = catchAsync(async(req, res, next) => {
    const me = req.currentUser
    // const betLimit = await betLimitModel.find()
    let homeData = await betLimitModel.findOne({type:'Home'})
    let sportData = await betLimitModel.findOne({type:'Sport'})
    res.status(200).render("./betLimit/betLimit", {
        title:"Bet Limits",
        // betLimit,
        me,
        currentUser:me,
        homeData,
        sportData
    })
});

exports.getSportList = catchAsync(async(req, res, next) => {
    var fullUrl = 'https://admin-api.dreamexch9.com/api/dream/cron/get-sportdata';
    fetch(fullUrl, {
        method: 'GET'
    })
    .then(res =>res.json())
    .then(result => {
        // let data = result.gameList.filter(item => item.sport_name == "Football")
        // let data2 = data[0].eventList.filter(item => item.eventData.type == "IN_PLAY")
        // console.log(data2[0].marketList.score[0].data)
        res.status(200).json({
            result
        })
    })
});


exports.getCricketData = catchAsync(async(req, res, next) => {
    var fullUrl = 'https://admin-api.dreamexch9.com/api/dream/cron/get-cricketdata';
    fetch(fullUrl, {
        method: 'GET'
    })
    .then(res =>res.json())
    .then(result => {
        console.log(result)
        res.status(200).json({
            result
        })
    })
});

// exports.getFootballData = catchAsync(async(req, res, next) => {
//     var fullUrl = 'https://admin-api.dreamexch9.com/api/dream/cron/get-footballdata';
//     fetch(fullUrl, {
//         method: 'GET'
//     })
//     .then(res =>console.log(res))
//     // .then(result => {
//     //     console.log(result)
//     //     res.status(200).json({
//     //         result
//     //     })
//     // })
// });

exports.getmarketDetailsByMarketId = catchAsync(async(req, res, next) => {
    let body = JSON.stringify(["4.1696509847-F2"]);
    // console.log(body)
    var fullUrl = 'https://oddsserver.dbm9.com/dream/get_odds';
    fetch(fullUrl, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'accept': 'application/json'
            },
        body:body 
    })
    .then(res =>res.json())
    .then(result => {
        console.log(result)
        res.status(200).json({
            result
        })
    })
});


exports.getLiveTv = catchAsync(async(req, res, next) => {
    let body = {
        ipv4 : "46.101.225.192",
        channel : "9002"
    }
    var fullUrl = 'https://score-session.dbm9.com/api/tv-stream-2';
    fetch(fullUrl, {
        method: 'POST',
        body:JSON.stringify(body) 
    })
    .then(res =>res.json())
    .then(result => {
        console.log(result, "+==> RESULT")
        res.status(200).json({
            result
        })
    })
});


exports.getMarketResult = catchAsync(async(req, res, next) => {
    let body = JSON.stringify(["4.1696509847-F2", "4.873007165-OE", "4.1696494258-F2", "4.1633986799-F2"]);
    // console.log(body)
    let fullUrl = "https://admin-api.dreamexch9.com/api/dream/markets/result";
    fetch(fullUrl, {
        method: 'POST',
        body:body 
    })
    .then(res =>res.json())
    .then(result => {
        // console.log(result)
        res.status(200).json({
            result
        })
    })
})

exports.getExchangePage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    const sportListData = await getCrkAndAllData()
    const cricket = sportListData[0].gameList[0].eventList
    let LiveCricket = cricket.filter(item => item.eventData.type === "IN_PLAY")
    const footBall = sportListData[1].gameList.find(item => item.sport_name === "Football");
    const Tennis = sportListData[1].gameList.find(item => item.sport_name === "Tennis");
    let liveFootBall = footBall.eventList.filter(item => item.eventData.type === "IN_PLAY");
    let liveTennis = Tennis.eventList.filter(item => item.eventData.type === "IN_PLAY")
    // console.log(liveTennis.length != 0)
    // console.log(liveFootBall)
    res.status(200).render("./user/exchange",{
        user,
        LiveCricket,
        liveFootBall,
        liveTennis
    })
});


exports.getCricketpage = catchAsync(async(req, res, next) => {
    const sportData = await getCrkAndAllData()
    const cricket = sportData[0].gameList[0].eventList
    let liveCricket = cricket.filter(item => item.eventData.type === "IN_PLAY");
    let upcomingCricket = cricket.filter(item => item.eventData.type == "UPCOMING");
    let user = req.currentUser
    // console.log(liveCricket[0].eventData.time * 1)
    // let date = new Date(1687798800)
    // console.log(date)
    res.status(200).render("./user/cricket", {
        user,
        liveCricket,
        upcomingCricket
    })
});


exports.getFootballData = catchAsync(async(req, res, next) => {
    const sportData = await getCrkAndAllData()
    const footBall = sportData[1].gameList.find(item => item.sport_name === "Football")
    let liveFootBall = footBall.eventList.filter(item => item.eventData.type === "IN_PLAY");
    let upcomingFootBall = footBall.eventList.filter(item => item.eventData.type === "UPCOMING");
    let user = req.currentUser
    res.status(200).render("./user/football", {
        user,
        liveFootBall,
        upcomingFootBall
    })
});

exports.getTennisData = catchAsync(async(req, res, next) => {
    const sportData = await getCrkAndAllData()
    const Tennis = sportData[1].gameList.find(item => item.sport_name === "Tennis")
    let liveTennis = Tennis.eventList.filter(item => item.eventData.type === "IN_PLAY");
    let upcomingTennis = Tennis.eventList.filter(item => item.eventData.type === "UPCOMING");
    let user = req.currentUser
    res.status(200).render("./user/tennis", {
        user,
        liveTennis,
        upcomingTennis
    })
});


exports.getMatchDetailsPage = catchAsync(async(req, res, next) => {
    const sportData = await getCrkAndAllData()
    const cricket = sportData[0].gameList[0].eventList
    // let football 
    let liveCricket = cricket.find(item => item.eventData.eventId == req.query.id);
    if(liveCricket === undefined){
        // football = sportData[1].gameList.filter(item => item.sport_name != "Cricket")
        // console.log(football)
        // liveCricket = football.eventList.find(item => item.eventData.eventId == req.query.id)
        let data1liveCricket = sportData[1].gameList.map(item => item.eventList.find(item1 => item1.eventData.eventId == req.query.id))
        liveCricket = data1liveCricket.find(item => item != undefined)
    }
    // console.log(liveCricket.marketList.bookmaker)
    let user = req.currentUser
    res.status(200).render("./user/matchDetails", {
        user,
        liveCricket
    })
});


exports.getLiveMarketsPage = catchAsync(async(req, res, next) => {
    const sportData = await getCrkAndAllData()
    const cricket = sportData[0].gameList[0].eventList
    let liveCricket = cricket;
    const footBall = sportData[1].gameList.find(item => item.sport_name === "Football");
    const Tennis = sportData[1].gameList.find(item => item.sport_name === "Tennis");
    let liveFootBall = footBall.eventList;
    let liveTennis = Tennis.eventList
    let currentUser =  req.currentUser
    let childrenUsername = []
    let children = await User.find({parentUsers:req.currentUser._id})
    children.map(ele => {
        childrenUsername.push(ele.userName) 
    })

    console.log(childrenUsername, "+====>> childrenUsername ")
    // console.log(req.currentUser)
    let openBet = topGames = await betModel.aggregate([
        {
            $match: {
                status:"OPEN" ,
                userName:{$in:childrenUsername}
            }
        },
        {
            $addFields: {
                shortMarketName: { $substrCP: [{ $toLower: "$marketName" }, 0, 3] }
            }
        },
        {
            $match: {
                shortMarketName: { $in: ["mat", "boo", "tos"] }
            }
        },
        {
            $group: {
                _id: {
                    betType: "$betType",
                    marketId: "$marketId",
                    beton: "$selectionName"
                },
                marketName: { $first: "$marketName" },
                match: { $first: "$match" },
                date: { $first: "$date" },
                secId : { $first: "$secId" },
                stake: { $sum: "$Stake" },
                eventId : {$first : '$eventId'},
                count:{$sum:1}
            }
        },
        {
            $group: {
                _id: {
                    betType: "$_id.betType",
                    marketId: "$_id.marketId"
                },
                details: {
                    $push: {
                        id: "$_id.marketId",
                        marketName: "$marketName",
                        shortMarketName: "$shortMarketName",
                        match: "$match",
                        date: "$date",
                        secId: '$secId',
                        count:'$count',
                        stake: "$stake",
                        beton: "$_id.beton",
                        eventId: '$eventId'
                    }
                }
            }
        },
        {
            $group: {
                _id: "$_id.betType",
                details: { $push: "$details" }
            }
        },
        {
            $project: {
                _id: 0,
                bettype: "$_id",
                details: 1
            }
        }
    ])
    res.status(200).render("./liveMarket/liveMarket", {
        title:"Live Market",
        liveCricket,
        liveFootBall,
        liveTennis,
        currentUser,
        openBet,
        me: currentUser
    })
})


exports.getCmsPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let pages = await pagesModel.find()
    let verticalMenus = await verticalMenuModel.find().sort({num:1})
    let hosriZontalMenu = await horizontalMenuModel.find().sort({Number:1})
    let banner = await bannerModel.find()
    let sliders = await sliderModel.find().sort({Number:1})
    res.status(200).render("./Cms/cms",{
        title:"Home Page Management",
        user,
        me:user,
        currentUser:user,
        verticalMenus,
        hosriZontalMenu,
        banner,
        pages,
        sliders
    })
});


exports.getPageManagement = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    const pages = await pagesModel.find()
    res.status(200).render("./Cms/pageManager", {
        title:"Page Management",
        user,
        me:user,
        currentUser:user,
        pages
    })
});

exports.getUserExchangePage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    console.log(user, "USERSLOGIN")
    const sportListData = await getCrkAndAllData()
    const cricket = sportListData[0].gameList[0].eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    let featureEventId = []
    let featureStatusArr = await FeatureventModel.find();
    featureStatusArr.map(ele => {
        featureEventId.push(parseInt(ele.Id))
    })
    let LiveCricket = cricket.filter(item => featureEventId.includes(item.eventData.eventId))
    let footBall = sportListData[1].gameList.find(item => item.sport_name === "Football")
    let Tennis = sportListData[1].gameList.find(item => item.sport_name === "Tennis")
    footBall = footBall.eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    Tennis = Tennis.eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    let liveFootBall = footBall.filter(item => featureEventId.includes(item.eventData.eventId));
    let liveTennis = Tennis.filter(item => featureEventId.includes(item.eventData.eventId))
    let upcomintCricket = cricket.filter(item => item.eventData.type != "IN_PLAY")
    let upcomintFootball = footBall.filter(item => item.eventData.type != "IN_PLAY")
    let upcomintTennis = Tennis.filter(item => item.eventData.type != "IN_PLAY")
    const data = await promotionModel.find();
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    let userLog
    let userMultimarkets
    let cricketSeries = [];
    let footbalSeries = [];
    let tennisSeries = []; 
    Tennis.forEach(match => {
        let seriesIndex = tennisSeries.findIndex(series => series.series === match.eventData.league);
        if (seriesIndex === -1) {
            tennisSeries.push({ series: match.eventData.league, matchdata: [match] });
        } else {
            tennisSeries[seriesIndex].matchdata.push(match);
        }
    });
    footBall.forEach(match => {
        let seriesIndex = footbalSeries.findIndex(series => series.series === match.eventData.league);
        if (seriesIndex === -1) {
            footbalSeries.push({ series: match.eventData.league, matchdata: [match] });
        } else {
            footbalSeries[seriesIndex].matchdata.push(match);
        }
    });
    cricket.forEach(match => {
        let seriesIndex = cricketSeries.findIndex(series => series.series === match.eventData.league);
        if (seriesIndex === -1) {
            cricketSeries.push({ series: match.eventData.league, matchdata: [match] });
        } else {
            cricketSeries[seriesIndex].matchdata.push(match);
        }
    });
    // console.log(footbalSeries);
    if(user){
        userMultimarkets = await multimarkets.findOne({userId:user.id})
        userLog = await loginLogs.find({user_id:user._id})
    }
    let catalog = await catalogController.find()
    res.status(200).render('./userSideEjs/exchangePage/main',{
        title:"Exchange Page",
        user,
        verticalMenus,
        check:"Exchange",
        data,
        liveFootBall,
        liveTennis,
        LiveCricket,
        upcomintCricket,
        upcomintFootball,
        upcomintTennis,
        userLog,
        notifications:req.notifications,
        userMultimarkets,
        cricketSeries,
        footbalSeries,
        tennisSeries,
        catalog,        
    })
})


exports.inplayMatches = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    const sportListData = await getCrkAndAllData()
    const cricket = sportListData[0].gameList[0].eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    let featureEventId = []
    let featureStatusArr = await FeatureventModel.find();
    featureStatusArr.map(ele => {
        featureEventId.push(parseInt(ele.Id))
    })
    let LiveCricket = cricket.filter(item => item.eventData.type === "IN_PLAY")
    let LiveCricket1 = cricket.filter(item => featureEventId.includes(item.eventData.eventId))
    let footBall = sportListData[1].gameList.find(item => item.sport_name === "Football")
    let Tennis = sportListData[1].gameList.find(item => item.sport_name === "Tennis")
    footBall = footBall.eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    Tennis = Tennis.eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    let liveTennis = Tennis.filter(item => item.eventData.type === "IN_PLAY")
    let liveTennis1 = Tennis.filter(item => featureEventId.includes(item.eventData.eventId))
    let liveFootBall = footBall.filter(item => item.eventData.type === "IN_PLAY");
    let liveFootBall1 = footBall.filter(item => featureEventId.includes(item.eventData.eventId));
    const data = await promotionModel.find();
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    let userLog
    let userMultimarkets
    if(user){
        userMultimarkets = await multimarkets.findOne({userId:user.id})
        userLog = await loginLogs.find({user_id:user._id})
    }
    let cricketSeries = [];
    let footbalSeries = [];
    let tennisSeries = []; 
    liveTennis.forEach(match => {
        let seriesIndex = tennisSeries.findIndex(series => series.series === match.eventData.league);
        if (seriesIndex === -1) {
            tennisSeries.push({ series: match.eventData.league, matchdata: [match] });
        } else {
            tennisSeries[seriesIndex].matchdata.push(match);
        }
    });
    liveFootBall.forEach(match => {
        let seriesIndex = footbalSeries.findIndex(series => series.series === match.eventData.league);
        if (seriesIndex === -1) {
            footbalSeries.push({ series: match.eventData.league, matchdata: [match] });
        } else {
            footbalSeries[seriesIndex].matchdata.push(match);
        }
    });
    LiveCricket.forEach(match => {
        let seriesIndex = cricketSeries.findIndex(series => series.series === match.eventData.league);
        if (seriesIndex === -1) {
            cricketSeries.push({ series: match.eventData.league, matchdata: [match] });
        } else {
            cricketSeries[seriesIndex].matchdata.push(match);
        }
    });
    let catalog = await catalogController.find()

    res.status(200).render('./userSideEjs/inplayPage/main',{
        title:'In Play',
        user,
        verticalMenus,
        check:"In-Play",
        data,
        liveFootBall1,
        liveFootBall,
        liveTennis,
        liveTennis1,
        LiveCricket,
        LiveCricket1,
        userLog,
        notifications:req.notifications,
        userMultimarkets,
        cricketSeries,
        footbalSeries,
        tennisSeries,
        catalog
    })
})


exports.cricketPage = catchAsync(async(req, res, next)=>{
    let user = req.currentUser
    const sportListData = await getCrkAndAllData()
    const cricket = sportListData[0].gameList[0].eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    let featureEventId = []
    let featureStatusArr = await FeatureventModel.find();
    featureStatusArr.map(ele => {
        featureEventId.push(parseInt(ele.Id))
    })
    let LiveCricket = cricket.filter(item => featureEventId.includes(item.eventData.eventId))
    let upcomintCricket = cricket.filter(item => item.eventData.type != "IN_PLAY")
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const data = await promotionModel.find();
    let userLog
    let userMultimarkets
    if(user){
        userMultimarkets = await multimarkets.findOne({userId:user.id})
        userLog = await loginLogs.find({user_id:user._id})
    }
    let cricketSeries = [];
    cricket.forEach(match => {
        let seriesIndex = cricketSeries.findIndex(series => series.series === match.eventData.league);
        if (seriesIndex === -1) {
            cricketSeries.push({ series: match.eventData.league, matchdata: [match] });
        } else {
            cricketSeries[seriesIndex].matchdata.push(match);
        }
    });
    let catalog = await catalogController.find()
  

    res.status(200).render("./userSideEjs/cricketPage/main", {
        title:'Cricket',
        user,
        verticalMenus,
        check:"Cricket",
        data,
        LiveCricket,
        upcomintCricket,
        userLog,
        notifications:req.notifications,
        userMultimarkets,
        cricketSeries,
        catalog
        })
})


exports.cardsPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const data = await promotionModel.find();
    let games = await gameModel.find({status:true});
    let userLog
    if(user){
        userLog = await loginLogs.find({user_id:user._id})
    }
    let checkUrl = req.originalUrl
    let check
    if(checkUrl === "/allCards"){
        check = "Cards"
    }else{
        check = "Slots"
    }
    res.status(200).render("./userSideEjs/cards/main",{
        title:'Cards Games',
        user,
        verticalMenus,
        data,
        games,
        userLog,
        notifications:req.notifications,
        check
    })
})

exports.footBallPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const sportListData = await getCrkAndAllData()
    let footBall = sportListData[1].gameList.find(item => item.sport_name === "Football")
    footBall = footBall.eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    let featureEventId = []
    let featureStatusArr = await FeatureventModel.find();
    featureStatusArr.map(ele => {
        featureEventId.push(parseInt(ele.Id))
    })
    let liveFootBall = footBall.filter(item => featureEventId.includes(item.eventData.eventId));
    let upcomintFootball = footBall.filter(item => item.eventData.type != "IN_PLAY")
    const data = await promotionModel.find();
    let userLog
    let userMultimarkets
    if(user){
        userMultimarkets = await multimarkets.findOne({userId:user.id})
        userLog = await loginLogs.find({user_id:user._id})
    }
    let footbalSeries = [];
    footBall.forEach(match => {
        let seriesIndex = footbalSeries.findIndex(series => series.series === match.eventData.league);
        if (seriesIndex === -1) {
            footbalSeries.push({ series: match.eventData.league, matchdata: [match] });
        } else {
            footbalSeries[seriesIndex].matchdata.push(match);
        }
    });
    let catalog = await catalogController.find()

    res.status(200).render('.//userSideEjs/footballPage/main',{
        title:'Football',
        user,
        verticalMenus,
        check:"Football",
        data,
        liveFootBall,
        upcomintFootball,
        userLog,
        notifications:req.notifications,
        userMultimarkets,
        footbalSeries,
        catalog,
        featureStatusArr
    })
})

exports.TennisPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const sportListData = await getCrkAndAllData()
    let Tennis = sportListData[1].gameList.find(item => item.sport_name === "Tennis")
    Tennis = Tennis.eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    let featureEventId = []
    let featureStatusArr = await FeatureventModel.find();
    featureStatusArr.map(ele => {
        featureEventId.push(parseInt(ele.Id))
    })
    let liveTennis = Tennis.filter(item => featureEventId.includes(item.eventData.eventId))
    console.log(featureEventId)
    let upcomintTennis = Tennis.filter(item => item.eventData.type != "IN_PLAY")
    const data = await promotionModel.find();
    let userLog
    let userMultimarkets
    if(user){
        userMultimarkets = await multimarkets.findOne({userId:user.id})
        userLog = await loginLogs.find({user_id:user._id})
    }
    let tennisSeries = [];
    Tennis.forEach(match => {
        let seriesIndex = tennisSeries.findIndex(series => series.series === match.eventData.league);
        if (seriesIndex === -1) {
            tennisSeries.push({ series: match.eventData.league, matchdata: [match] });
        } else {
            tennisSeries[seriesIndex].matchdata.push(match);
        }
    });
    let catalog = await catalogController.find()

    res.status(200).render('.//userSideEjs/tennisPage/main',{
        title:'Tennis',
        user,
        verticalMenus,
        check:"Tennis",
        data,
        liveTennis,
        upcomintTennis,
        userLog,
        notifications:req.notifications,
        userMultimarkets,
        tennisSeries,
        catalog
    })
})



exports.userPlReports = catchAsync(async(req, res, next) => {
    let verticalMenus = await verticalMenuModel.find().sort({num:1});

    let data = await betModel.aggregate([
        {
            $match:{
                userId:req.currentUser.id
            }
        },
        {
            $group: {
              _id: "$event",
              wins: {
                $sum: { $cond: [{ $eq: ["$status", "WON"] }, 1, 0] }
              },
              losses: {
                $sum: { $cond: [{ $eq: ["$status", "LOSS"] }, 1, 0] }
              },
              profit: {
                $sum: "$returns"
              }
            }
        }
    ])
    let userLog
    if(req.currentUser){
        userLog = await loginLogs.find({user_id:req.currentUser.id})
    }
    // console.log(data)
    res.status(200).render("./userSideEjs/plStatemenet/main",{
        title:'P/L Reports',
        user: req.currentUser,
        data,
        verticalMenus,
        check:"plStatemenet",
        userLog,
        notifications:req.notifications
    })
});


exports.getExchangePageIn = catchAsync(async(req, res, next) => {
    let ip = req.ip
    let ipv4
    if (ip.indexOf('::ffff:') === 0) {
        ipv4 = ip.split('::ffff:')[1];
    }else{
        ipv4 = ip
    }
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const sportData = await getCrkAndAllData()
    const cricket = sportData[0].gameList[0].eventList
    let match = cricket.find(item => item.eventData.eventId == req.query.id);
    if(match === undefined){
        let data1liveCricket = sportData[1].gameList.map(item => item.eventList.find(item1 => item1.eventData.eventId == req.query.id))
        match = data1liveCricket.find(item => item != undefined)
    }
    if(match == undefined){
        res.status(404).json({
            status:"Success",
            message:"This match is no more live"
        })
    }
    let src
    let status = false
    let liveStream
    let StreamData = await streamModel.findOne({eventId:req.query.id})
    if(StreamData){
        if(StreamData.status){
            src = StreamData.url
            status = true
        }
    }else{
        liveStream = await liveStreameData(match.eventData.channelId, ipv4)
        const src_regex = /src='([^']+)'/;
        let match1
        // let src
        if(liveStream.data){
    
            match1 = liveStream.data.match(src_regex);
            if (match1) {
                src = match1[1];
                status = true
            } else {
                console.log("No 'src' attribute found in the iframe tag.");
            }
        }
    }
        let userLog
        let stakeLabledata
        let userMultimarkets
        let betsOnthisMatch = []
        let rules = await gamrRuleModel.find()
        if(req.currentUser){
            userLog = await loginLogs.find({user_id:req.currentUser._id})
            userMultimarkets = await multimarkets.findOne({userId:req.currentUser._id})
            stakeLabledata = await stakeLable.findOne({userId:req.currentUser._id})
            if(stakeLabledata === null){
                stakeLabledata = await stakeLable.findOne({userId:"6492fd6cd09db28e00761691"})
            }
            betsOnthisMatch = await betModel.find({userId:req.currentUser._id, match:match.eventData.name, status: 'OPEN'})
        }else{
            stakeLabledata = await stakeLable.findOne({userId:"6492fd6cd09db28e00761691"})
        }

        let filtertinMatch = {}
        let sportName = ''
        if(match.eventData.sportId === 1){
            filtertinMatch = {
                type : {
                    $in :['Home', "Football", 'Football/matchOdds', match.eventData.league, match.eventData.name]
                }
            }

            sportName = 'Football'
        }else if (match.eventData.sportId === 2){
            filtertinMatch = {
                type : {
                    $in :['Home', "Tennis", 'Tennis/matchOdds', match.eventData.league, match.eventData.name]
                }
            }
            sportName = 'Tennis'
        }else if(match.eventData.sportId === 4){
            filtertinMatch = {
                type : {
                    $in :['Home', "Cricket", 'Cricket/matchOdds', "Cricket/bookMaker", 'Cricket/fency', match.eventData.league, match.eventData.name]
                }
            }
            sportName = 'Cricket'
        }

        let betLimit = await betLimitModel.findOne({type:match.eventData.name})
        if(!betLimit){
            betLimit = await betLimitModel.findOne({type:match.eventData.league})
            if(!betLimit){
                betLimit = await betLimitModel.findOne({type:sportName})
                if(!betLimit){
                    betLimit = await betLimitModel.findOne({type:'Sport'})
                    if(!betLimit){
                        betLimit = await betLimitModel.findOne({type:'Home'})
                    }
                }
            }
        }

        let minMatchOdds = betLimit.min_stake
        let maxMatchOdds = betLimit.max_stake
        let minBookMaker = betLimit.min_stake
        let maxBookMaker = betLimit.max_stake
        let minFancy = betLimit.min_stake
        let maxFancy = betLimit.max_stake
        let MATCHODDDATA = await betLimitModel.findOne({type:`${sportName}/matchOdds`})
        if(MATCHODDDATA){
            minMatchOdds = MATCHODDDATA.min_stake
            maxMatchOdds = MATCHODDDATA.max_stake
        }
        let BOOKMAKER = await betLimitModel.findOne({type:`${sportName}/bookMaker`})
        if(BOOKMAKER){
            minBookMaker = BOOKMAKER.min_stake
            maxBookMaker = BOOKMAKER.max_stake
        }
        let FENCY = await betLimitModel.findOne({type:`${sportName}/fency`})
        if(FENCY){
            minFancy = FENCY.min_stake
            maxFancy = FENCY.max_stake
        }

        const commissionmarket = await commissionMarketModel.find();
        let commissionmarkerarr = [];
        commissionmarket.map(ele=>{
            commissionmarkerarr.push(ele.marketId)
        })

        // console.log(betLimit)
        // console.log(minMatchOdds, maxMatchOdds, minFancy, maxFancy, minBookMaker, maxBookMaker)

        const betLimitMarekt = await betLimitMatchWisemodel.findOne({matchTitle:match.eventData.name})
        let notification = await eventNotification.findOne({id:req.query.id})
        console.log(notification, "notification")
        res.status(200).render("./userSideEjs/userMatchDetails/main",{
            title:match.eventData.name,
            user: req.currentUser,
            verticalMenus,
            check:"ExchangeIn",
            match,
            liveStream,
            status,
            userLog,
            notifications:req.notifications,
            stakeLabledata,
            betsOnthisMatch,
            rules,
            src,
            userMultimarkets,
            betLimitMarekt,
            betLimit,
            minBookMaker,
            maxBookMaker,
            minMatchOdds,
            maxMatchOdds,
            minFancy,
            maxFancy,
            commissionmarkerarr,
            notification
    })
});


exports.multimarkets = catchAsync(async(req, res, next) => {
    
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const sportData = await getCrkAndAllData()
    
    const betLimit = await betLimitModel.find()
    // console.log(match.marketList.goals)
    // let session = match.marketList.session.filter(item => {
    //     let date = new Date(item.updated_on);
    //     return date < Date.now() - 1000 * 60 * 60;
    // });
    // let SportLimits = betLimit.find(item => item.type === "Sport")
    // if (SportLimits.min_stake >= 1000) {
    //     SportLimits.min_stake = ( SportLimits.min_stake / 1000).toFixed(1) + 'K';
    //   } else {
    //     SportLimits.min_stake =  SportLimits.min_stake.toString();
    // }
    // if (SportLimits.max_stake >= 1000) {
    //     SportLimits.max_stake = ( SportLimits.max_stake / 1000).toFixed(1) + 'K';
    //   } else {
    //     SportLimits.max_stake =  SportLimits.max_stake.toString();
    // }
    let userLog
    let multimarket 
    let stakeLabledata
    let betsOnthisMatch = []
    let rules = await gamrRuleModel.find()
    if(req.currentUser){
        userLog = await loginLogs.find({user_id:req.currentUser._id})
        multimarket = await multimarkets.findOne({userId:req.currentUser._id})
        if(multimarket != null){
            betsOnthisMatch = await betModel.find({userId:req.currentUser._id, status:"OPEN", marketId:{$in:multimarket.marketIds}})
        }
        stakeLabledata = await stakeLable.findOne({userId:req.currentUser._id})
        if(stakeLabledata === null){
            stakeLabledata = await stakeLable.findOne({userId:"6492fd6cd09db28e00761691"})
        }
    }else{
        stakeLabledata = await stakeLable.findOne({userId:"6492fd6cd09db28e00761691"})
    }
    console.log(multimarket)
    res.status(200).render("./userSideEjs/multimarkets/main",{
        title:'Multi Markets',
        user: req.currentUser,
        verticalMenus,
        check:"Multi Markets",
        // SportLimits,
        userLog,
        notifications:req.notifications,
        multimarket,
        sportData,
        stakeLabledata,
        betsOnthisMatch,
        rules
    })
});

exports.getCardInplayGame = catchAsync(async(req, res, next) => {
    let check
    if(req.url.startsWith('/cards')){
        check = "Cards"
    }else if(req.url.startsWith('/Royal_casinoInplay')){
        check ="Royal Casino"
    }else if(req.url.startsWith('/virtualsInPlay')){
        check = "Virtuals"
    }else if(req.url.startsWith("/live_casinoInPlay")){
        check = "Live Casino InPlay"
    }
    let user = req.currentUser
    let gameData = await gameModel.findById(req.query.gameId)
    let urldata = await gameAPI(gameData, user)
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const data = await promotionModel.find();
    let userLog
    if(user){
        userLog = await loginLogs.find({user_id:user._id})
    }
    res.status(200).render("./userSideEjs/CardInplayPage/main",{
        title:'Cards Games',
        user,
        verticalMenus,
        data,
        check,
        urldata,
        userLog,
        notifications:req.notifications
    })
})

exports.getSportBookGame = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let urldata
    let body = {
        clientIp: `${req.ip}`,
        currency: "INR",
        operatorId: "sheldon",
        partnerId: "SHPID01",
        platformId: "DESKTOP",
        userId: user._id,
        username: user.userName
    }
    function readPem (filename) {
        return fs.readFileSync(path.resolve(__dirname, '../prev/' + filename)).toString('ascii');
      }

    const privateKey = readPem('private.pem');
    const textToSign = JSON.stringify(body);
    const hashedOutput = SHA256(privateKey, textToSign);
    // console.log(hashedOutput)
    var fullUrl = 'https://stage-api.mysportsfeed.io/api/v1/feed/user-login';
    await fetch(fullUrl, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Signature': hashedOutput ,
            'accept': 'application/json'
            },
        body:JSON.stringify(body)

    })
    .then(res => res.json())
    .then(result => {
      urldata = result
    })
    // console.log(DATA)
    // return DATA
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const data = await promotionModel.find();
    let userLog
    if(user){
        userLog = await loginLogs.find({user_id:user._id})
    }
    res.status(200).render("./userSideEjs/SportBook/main",{
        title:'Sports Book',
        user,
        verticalMenus,
        data,
        check:"Sportsbook",
        urldata,
        userLog,
        notifications:req.notifications
    })
});



exports.royalGamingPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const data = await promotionModel.find();
    let games = await gameModel.find({provider_name:"RG"});
    let userLog
    if(user){
        userLog = await loginLogs.find({user_id:user._id})
    }
    res.status(200).render("./userSideEjs/royalGamingPage/main",{
        title:'Royal Games',
        user,
        verticalMenus,
        data,
        check:"Royal Casino",
        games,
        userLog,
        notifications:req.notifications
    })
});


exports.virtualsPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const data = await promotionModel.find();
    let games = await gameModel.find({status:true});
    let userLog
    if(user){
        userLog = await loginLogs.find({user_id:user._id})
    }
    res.status(200).render("./userSideEjs/virtuals/main",{
        title:'Virtuals Games',
        user,
        verticalMenus,
        data,
        check:"Virtuals",
        games,
        userLog,
        notifications:req.notifications
    })
});


exports.OthersGames = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const data = await promotionModel.find();
    let userLog
    if(user){
        userLog = await loginLogs.find({user_id:user._id})
    }
    res.status(200).render("./userSideEjs/others/main",{
        title:'Others Games',
        user,
        verticalMenus,
        data,
        check:"Other",
        userLog,
        notifications:req.notifications
    })
});


exports.getLiveCasinoPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const data = await promotionModel.find();
    let games = await gameModel.find({status:true});
    let userLog
    let gamesFe = []
    if(user){
        userLog = await loginLogs.find({user_id:user._id})
        let gamesfev = await casinoFevorite.findOne({userId:user._id})
        if(gamesfev){
            gamesFe = gamesfev.gameId
        }
    }
    res.status(200).render("./userSideEjs/liveCasino/main", {
        title:'Live Casino',
        user,
        verticalMenus,
        data,
        check:"Live Casino",
        games,
        userLog,
        notifications:req.notifications,
        gamesFe
    })
});


exports.getMyBetsPageUser = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const data = await promotionModel.find();
    let games = await gameModel.find({status:true});
    // console.log(user._id)
    let userLog = await loginLogs.find({user_id:user.id})
    let bets = await betModel.find({userId:user._id}).sort({date:-1}).limit(20)
    let betsDetails = await betModel.aggregate([
        {
            $match:{
                userId:req.currentUser.id
            }
        },
        {
            $group: {
              _id: null,
              totalReturns: { $sum: '$returns' },
              totalCount: { $sum: 1 }
            }
          }
    ])
    // console.log(betsDetails)
    res.status(200).render("./userSideEjs/myBetsPage/main", {
        title:'Bet Reports',
        user,
        verticalMenus,
        data,
        check:"My Bets",
        games,
        userLog,
        bets,
        notifications:req.notifications,
        betsDetails
    })
});


exports.getGameReportPageUser = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const data = await promotionModel.find();
    let games = await gameModel.find({status:true});
    let userLog = await loginLogs.find({user_id:user._id})
    let bets = await betModel.aggregate([
        {
            $match: {
              userId: `${user._id}` 
            }
          },
        {
            $group: {
              _id: '$event',
              totalData: { $sum: 1 },
              won: { $sum: { $cond: [{ $eq: ['$status', 'WON'] }, 1, 0] } },
              loss: { $sum: { $cond: [{ $eq: ['$status', 'LOSS'] }, 1, 0] } },
              Open: { $sum: { $cond: [{ $eq: ['$status', 'OPEN'] }, 1, 0] } },
              Cancel: { $sum: { $cond: [{ $eq: ['$status', 'CANCEL'] }, 1, 0] } },
              sumOfReturns: { $sum: '$returns' },
              uniqueMarketCount: { $addToSet: '$marketName' } 
            }
          },
          {
            $project: {
              _id: 1,
              totalData: 1,
              won: 1,
              loss: 1,
              Open: 1,
              Cancel: 1,
              sumOfReturns: 1,
              uniqueMarketCount: { $size: '$uniqueMarketCount' } 
            }
          },
          {
            $sort: { totalData: -1 , _id: 1}
          },
          {
            $limit: 20 
          }
      ])
    //   console.log(bets)
    res.status(200).render("./userSideEjs/gameReportPage/main",{
        title:'Game Reports',
        user,
        verticalMenus,
        data,
        check:"My game",
        games,
        bets,
        userLog,
        notifications:req.notifications
    })
})

exports.getGameReportInPageUser = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const data = await promotionModel.find();
    let games = await gameModel.find({status:true});
    let userLog = await loginLogs.find({user_id:user._id})
    let result = await betModel.aggregate([
        {
          $match: {
            event: req.query.eventname,
            userId:user.id
          }
        },
        {
            $group: {
              _id: {
                match: '$match',
                event: '$event'
              },
              totalData: { $sum: 1 },
              win: { $sum: { $cond: [{ $eq: ['$status', 'WON'] }, 1, 0] } },
              loss: { $sum: { $cond: [{ $eq: ['$status', 'LOSS'] }, 1, 0] } },
              cancel: { $sum: { $cond: [{ $eq: ['$status', 'CANCEL'] }, 1, 0] } },
              open: { $sum: { $cond: [{ $eq: ['$status', 'OPEN'] }, 1, 0] } },
              totalSumOfReturns: { $sum: '$returns' }
            }
          },
          {
            $project: {
              _id: 0,
              match: '$_id.match',
              event: '$_id.event',
              totalData: 1,
              win: 1,
              loss: 1,
              cancel: 1,
              open: 1,
              totalSumOfReturns: 1
            }
          },
        {
            $sort: { totalData: -1 , _id: 1}
          },
          {
            $limit: 20 
          }
      ]);
      
    res.status(200).render("./userSideEjs/gameReportEvent/main",{
        title:'Game Reports',
        user,
        verticalMenus,
        data,
        check:"My game",
        games,
        userLog,
        result,
        notifications:req.notifications
    })
})

exports.getGameReportInINPageUser = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const data = await promotionModel.find();
    let games = await gameModel.find({status:true});
    let userLog = await loginLogs.find({user_id:user._id})
    // console.log(req.query)
    let result = await betModel.find({event:req.query.eventName, match:req.query.matchName, userId:user.id}).limit(20)
    //   console.log(result)
    res.status(200).render("./userSideEjs/gameReportmatch/main",{
        title:'Game Reports',
        user,
        verticalMenus,
        data,
        check:"My game",
        games,
        userLog,
        result,
        notifications:req.notifications
    })
});

exports.getMyProfileUser = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const data = await promotionModel.find();
    let games = await gameModel.find({status:true});
    let userLog = await loginLogs.find({user_id:user._id})
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    let userProfileContent = await betModel.aggregate([
        {
            $match: {
              userId:user.id,
              date: {
                $gte: currentDate,
                $lt: nextDate,
              }
            }
          },
          {
            $group: {
              _id: null,
              totalReturns: { $sum: "$returns" },
              totalReturns1: {
                $sum: {
                  $cond: [{ $ne: ["$betType", "Casino"] }, "$returns", 0]
                }
              },
              totalReturns3: {
                $sum: {
                  $cond: [{ $eq: ["$betType", "Casino"] }, "$returns", 0]
                }
              },
            },
          },
          {
            $project: {
              _id: 0,
              totalReturns: 1,
              totalReturns1: 1,
              totalReturns3: 1,
            },
          },
    ])
    // console.log(userProfileContent)
    res.status(200).render("./userSideEjs/userProfile/main",{
        title:'My Profile',
        user,
        verticalMenus,
        data,
        check:"userP",
        games,
        userLog,
        notifications:req.notifications,
        userProfileContent
    })
});


exports.gameRulesPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let pages = await pagesModel.find()
    let verticalMenus = await verticalMenuModel.find().sort({num:1})
    let hosriZontalMenu = await horizontalMenuModel.find().sort({Number:1})
    let banner = await bannerModel.find()
    let sliders = await sliderModel.find().sort({Number:1})
    let rules = await gamrRuleModel.find()
    res.status(200).render("./Cms/ruleManager",{
        title:"Rules Management",
        user,
        me:user,
        currentUser:user,
        verticalMenus,
        hosriZontalMenu,
        banner,
        pages,
        sliders,
        rules
    })
});


exports.getMyKycPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const data = await promotionModel.find();
    let games = await gameModel.find({status:true});
    let userLog = await loginLogs.find({user_id:user._id})
    res.status(200).render("./userSideEjs/Kyc/main",{
        title:'KYC',
        user,
        verticalMenus,
        data,
        check:"Kyc",
        games,
        userLog,
        notifications:req.notifications
    })
});

exports.getSettlementPageIn = catchAsync(async(req, res, next) => {
    let me = req.currentUser
    let inprogressData = await InprogreshModel.find({eventId:req.query.id})
    console.log(inprogressData, "<=== inprogressData")
    let childrenUsername = []
    if(req.currentUser.roleName == 'Operator'){
        let children = await User.find({parentUsers:req.currentUser.parent_id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
    }else{
        let children = await User.find({parentUsers:req.currentUser._id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
    }
    let betsEventWiseOpen = await betModel.aggregate([
        {
            $match: {
                status:"OPEN",
                eventId:req.query.id,
                userName:{$in:childrenUsername}
            }
        },
        {
            $group: {
              _id: "$marketName",
              count: { $sum: 1 },
              marketId: { $first: "$marketId" },
              match: { $first: "$match" },
              date: {$first:'$date'}
            }
          },
          {
            $project: {
              _id: 0,
              marketName: "$_id",
              marketId: 1,
              count: 1,
              match : 1,
              date:1
            }
          }
    ])

    let betsEventWiseMap = await betModel.aggregate([
        {
            $match: {
                status:"MAP",
                eventId:req.query.id,
                userName:{$in:childrenUsername}
            }
        },
        {
            $group: {
              _id: "$marketName",
              count: { $sum: 1 },
              marketId: { $first: "$marketId" },
              match: { $first: "$match" },
              date: {$first:'$date'},
              result:{$first : '$result'}
            }
          },
          {
            $project: {
              _id: 0,
              marketName: "$_id",
              marketId: 1,
              count: 1,
              match : 1,
              date:1,
              result : 1
            }
          }
    ])

    let betsEventWiseCancel = await betModel.aggregate([
        {
            $match: {
                status:"CANCEL",
                eventId:req.query.id,
                userName:{$in:childrenUsername}
            }
        },
        {
            $group: {
              _id: "$marketName",
              count: { $sum: 1 },
              marketId: { $first: "$marketId" },
              match: { $first: "$match" },
              date: {$first:'$date'},
            }
          },
          {
            $project: {
              _id: 0,
              marketName: "$_id",
              marketId: 1,
              count: 1,
              match : 1,
              date:1,
            }
          }
    ])

    let betsEventWiseSettel = await betModel.aggregate([
        {
            $match: {
                status:{$nin: ["OPEN", "CANCEL", "MAP"]},
                eventId:req.query.id,
                userName:{$in:childrenUsername}
            }
        },
        {
            $group: {
              _id: "$marketName",
              count: { $sum: 1 },
              marketId: { $first: "$marketId" },
              match: { $first: "$match" },
              date: {$first:'$date'},
              result : {$first : '$result'}
            }
          },
          {
            $project: {
              _id: 0,
              marketName: "$_id",
              marketId: 1,
              count: 1,
              match : 1,
              date:1,
              result : 1
            }
          }
    ])

    let data = await betModel.findOne({eventId:req.query.id})
    res.status(200).render("./sattlementInPage/main",{
        title:"Settlements",
        me,
        currentUser:me,
        betsEventWiseOpen,
        data,
        betsEventWiseMap,
        betsEventWiseCancel,
        betsEventWiseSettel,
        inprogressData
    })
} )

exports.getSettlementHistoryPage = catchAsync(async(req, res, next) => {
    let me = req.currentUser
    let limit = 10
    // console.log(me)
    // let History
    // if(me.roleName === "Admin"){
    //     History = await settlementHisory.find().sort({ date: -1 }).limit(limit)
    // }else{
    //     History = await settlementHisory.find({userId:me._id}).sort({ date: -1 }).limit(limit)
    // }
    let filter = {}
    if(me.roleName === "Admin"){
        filter = {}
    }else{
        filter = {
            userId:me._id
        }
    }

    let History2 = await settlementHisory.aggregate([
        {
            $match:filter
        },
        {
            $addFields: {
              userIdObjectId: { $toObjectId: '$userId' } 
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userIdObjectId",
                foreignField: '_id',
                as: "user"
              }
        },
        {
            $sort:{
                date:-1
            }
        },
        {
            $limit:limit
        }
    ])
    console.log(History2[0].user)
    res.status(200).render("./settlemetHistory/settlemetHistory",{
        title:"Settlements",
        me,
        currentUser:me,
        History:History2
    })
} )



exports.getCommissionReport = catchAsync(async(req, res, next) => {
    let me = req.currentUser
    let childrenUsername = []
    // if()
    // console.log(req.currentUser)
    if(req.currentUser.roleName == 'Operator'){
        let children = await User.find({parentUsers:req.currentUser.parent_id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
    }else{
        let children = await User.find({parentUsers:req.currentUser._id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
    }
    
    let eventWiseData = await commissionNewModel.aggregate([
        {
            $match: {
              eventDate: {
                $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) 
              },
              userName:{$in:childrenUsername}
            }
          },
          {
              $group: {
                  _id: "$eventName",
              totalCommission: { $sum: "$commission" },
              eventDate: { $first: "$eventDate" }
            }
        },
        {
          $sort:{
              eventDate : -1,
              totalCommission : 1,
              _id : 1
          }
        },
          {
            $limit:10
          }
    ])

    let userWiseData = await commissionNewModel.aggregate([
        {
            $match: {
              eventDate: {
                $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) 
              },
              userName:{$in:childrenUsername}
            }
          },
          {
              $group: {
                  _id: "$userName",
                  totalCommission: { $sum: "$commission" },
                  totalUPline: { $sum: "$upline" },
                }
            },
            {
              $sort:{
                _id : 1,
                totalCommission : 1,
                totalUPline : 1
              }
            },
          {
            $limit:10
          }
    ])

    let accStatements = await accountStatement.aggregate([
        {
            $match:{
                date: {
                    $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) 
                  },
                // userName:req.currentUser.userName,
                description:{
                    $regex: /^Claim Commisiion/i
                },
                userName:{$in:childrenUsername}
            }
        },
        {
            $sort:{
                date : -1,
                userName : 1
            }
        },
        {
          $limit:10
        }
    ])
    res.status(200).render("./commissionPage/commissionPage",{
        title:"Commission Report",
        me,
        currentUser:me,
        eventWiseData,
        userWiseData,
        accStatements
    })
})

exports.getCatalogControllerPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    const sportList =[
        {sport_name:"baseball",sportId:30},
        {sport_name:"basketball",sportId:10}	,
        {sport_name:"Cricket",sportId:4}	,
        {sport_name:"Greyhound Racing",sportId:20}	,
        {sport_name:"Horse racing",sportId:77}	,
        {sport_name:"Football",sportId:1}	,
        {sport_name:"Tennis",sportId:2}
    ]
   
    res.status(200).render("./catalogController/catalogcontroller", {
        title:"Catalog Controller",
        data:sportList,
        me: user,
        currentUser: user
    })
    
})

exports.getCatalogCompetationControllerPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    const sportId = req.query.sportId
    // console.log(sportId)
    const sportListData = await getCrkAndAllData()
    let series;
    let seriesObjList = []
    let seriesList = []
    let breadcumArr = []
    const sportList =[
        {sport_name:"baseball",sportId:30},
        {sport_name:"basketball",sportId:10}	,
        {sport_name:"Cricket",sportId:4}	,
        {sport_name:"Greyhound Racing",sportId:20}	,
        {sport_name:"Horse racing",sportId:77}	,
        {sport_name:"Football",sportId:1}	,
        {sport_name:"Tennis",sportId:2}
    ]
    sportList.map(item => {
        if(item.sportId == sportId){
            breadcumArr.push({name:item.sport_name,id:sportId})
        }
    })
    if(sportId == 4){
        series = sportListData[0].gameList[0]
    }else{
        series = sportListData[1].gameList.find(item => item.sportId == sportId)
    }
    if(series){
        let seriesPromise = series.eventList.map(async(item)=>{
            if(!seriesList.includes(item.eventData.compId)){
                seriesList.push(item.eventData.compId)
                let status = await catalogController.findOne({Id:item.eventData.compId})
                // if(!status){
                //     await catalogController.create({
                //         Id:item.eventData.compId,
                //         name:item.eventData.league,
                //         type:"league"
                //     })
                //     seriesObjList.push({name:item.eventData.league,compId:item.eventData.compId,status:true,sportId:sportId})
                // }else{
                    if(status){
                        seriesObjList.push({name:item.eventData.league,compId:item.eventData.compId,status:false,sportId})

                    }else{
                        seriesObjList.push({name:item.eventData.league,compId:item.eventData.compId,status:true,sportId})
                    }
                // }
            }
        })
        Promise.all(seriesPromise).then(()=>{
            return res.status(200).render("./catalogController/compitition", {
                title:"Catalog Controller",
                data:seriesObjList,
                me: user,
                currentUser: user,
                breadcumArr
            })
        })
    }else{
        return res.status(200).render("./catalogController/compitition", {
            title:"Catalog Controller",
            data:seriesObjList,
            me: user,
            currentUser: user,
            breadcumArr
        })
    }
   
    
})

exports.getCatalogeventsControllerPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    const compId = req.query.compId
    const sportId = req.query.sportId
    const sportListData = await getCrkAndAllData()
    let breadcumArr = []
    let nameArr = []
    let series;
    let seriesObjList = []
    if(sportId == 4){
        series = sportListData[0].gameList[0]
        breadcumArr.push({id:sportId,name:series.sport_name})

    }else{
        series = sportListData[1].gameList.find(item => item.sportId == sportId)
        breadcumArr.push({id:sportId,name:series.sport_name})


    }

    if(series){
        nameArr.push(series.sport_name)
        let eventListPromis = series.eventList.map(async(item) => {
            if(item.eventData.compId == compId){
                if(!nameArr.includes(item.eventData.league)){
                    breadcumArr.push({id:compId,name:item.eventData.league,sportId:sportId})
                    nameArr.push(item.eventData.league)
                }
                let status = await catalogController.findOne({Id:item.eventData.eventId})
                let count = 0;
                if(!status){
                    // await catalogController.create({
                    //     Id:item.eventData.eventId,
                    //     name:item.eventData.name,
                    //     type:"event"
                    // })
                    count = await betModel.count({eventId:item.eventData.eventId,status:"OPEN"})
                    seriesObjList.push({name:item.eventData.name,created_on:item.eventData.time,status:true,count,eventId:item.eventData.eventId})
                    
                }else{
                    count = await betModel.count({eventId:item.eventData.eventId,status:"OPEN"})
                    seriesObjList.push({name:item.eventData.name,created_on:item.eventData.time,status:status.status,count,eventId:item.eventData.eventId})

                }
            }
            
        })
        console.log(seriesObjList)
        Promise.all(eventListPromis).then(()=>{
            return res.status(200).render("./catalogController/events", {
                title:"Catalog Controller",
                data:seriesObjList,
                me: user,
                currentUser: user,
                breadcumArr
            })
        })
    }else{
        return res.status(200).render("./catalogController/events", {
            title:"Catalog Controller",
            data:seriesObjList,
            me: user,
            currentUser: user,
            breadcumArr
        })
    }
})

exports.getEventControllerPage = catchAsync(async(req,res,next)=>{
    let user = req.currentUser
    const sportListData = await getCrkAndAllData()
    let cricketEvents;
    let footballEvents;
    let tennisEvents;
    
    let count;
    let data = {};

    let cricketList = sportListData[0].gameList[0]
    let footballList = sportListData[1].gameList.find(item => item.sportId == 1)
    let tennisList = sportListData[1].gameList.find(item => item.sportId == 2)

    let newcricketEvents = cricketList.eventList.map(async(item) => {
         let status = await catalogController.findOne({Id:item.eventData.eventId})
         let featureStatus = await FeatureventModel.findOne({Id:item.eventData.eventId})
         count = await betModel.count({eventId:item.eventData.eventId,status:"OPEN"})
         if(!status){
            item.eventData.status = true
         }else{
            item.eventData.status = false
        }
        if(!featureStatus){
            item.eventData.featureStatus = false
        }else{
            item.eventData.featureStatus = true
        }
        item.eventData.count = count

         return item
    })
    let newfootballEvents =  footballList.eventList.map(async(item) => {
         let status = await catalogController.findOne({Id:item.eventData.eventId})
         let featureStatus = await FeatureventModel.findOne({Id:item.eventData.eventId})

         count = await betModel.count({eventId:item.eventData.eventId,status:"OPEN"})
         if(!status){
            item.eventData.status = true
         }else{
            item.eventData.status = false
        }
        if(!featureStatus){
            item.eventData.featureStatus = false
        }else{
            item.eventData.featureStatus = true
        }
        item.eventData.count = count

         return item
    })
    let newtennisEvents = tennisList.eventList.map(async(item) => {
         let status = await catalogController.findOne({Id:item.eventData.eventId})
         let featureStatus = await FeatureventModel.findOne({Id:item.eventData.eventId})
         count = await betModel.count({eventId:item.eventData.eventId,status:"OPEN"})
         if(!status){
            item.eventData.status = true
         }else{
            item.eventData.status = false
        }
        if(!featureStatus){
            item.eventData.featureStatus = false
        }else{
            item.eventData.featureStatus = true
        }
        item.eventData.count = count

         return item
    })

    cricketEvents = await Promise.all(newcricketEvents);
    footballEvents = await Promise.all(newfootballEvents);
    tennisEvents = await Promise.all(newtennisEvents);
    data = {cricketEvents,footballEvents,tennisEvents}
    console.log(cricketEvents)

    return res.status(200).render("./eventController/eventController", {
        title:"Event Controller",
        data,
        me: user,
        currentUser: user,
    })
})


exports.CommissionMarkets = catchAsync(async(req, res, next) => { 
    
    const me = req.currentUser
    res.status(200).render("./commissionMarket/main",{
        title:"Commission Markets",
        me,
        currentUser:me
    })
});

exports.getCommissionReportUserSide = catchAsync(async(req, res, next) => {
    const me = req.currentUser
    let userLog
    if(req.currentUser){
        userLog = await loginLogs.find({user_id:req.currentUser._id})
    }
    let sumData = await commissionNewModel.aggregate([
        {
            $match:{
                userId: req.currentUser.id,
                commissionStatus: 'Unclaimed'
            }
        },
        {
            $group: {
              _id: null, 
              totalCommission: { $sum: "$commission" } 
            }
          }
    ])
    // console.log(sumData, "sumData")
    let commissionData = await commissionNewModel.aggregate([
        {
            $match:{
                userId: req.currentUser.id
            }
        },
        {
            $group:{
                _id:'$sportId',
                totalCommissionPoints: { $sum: '$commission' }
            }
        }
    ])
    let sum 
    if(sumData.length != 0){
        sum = sumData[0].totalCommission
    }else{
        sum = 0
    }
    // console.log(commissionData, "commissionData")
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    res.status(200).render("./userSideEjs/commissionReport/main", {
        title:"Commission Report",
        user:req.currentUser,
        verticalMenus,
        check:"Comm",
        userLog,
        notifications:req.notifications,
        // data,
        commissionData,
        unclaimCommission:sum
    })
})

exports.getCommissionReporIntUserSide = catchAsync(async(req, res, next) => {
    const me = req.currentUser
    let sportId = req.query.id
    let userLog
    if(req.currentUser){
        userLog = await loginLogs.find({user_id:req.currentUser._id})
    }
    let sumData = await commissionNewModel.aggregate([
        {
            $match:{
                userId: req.currentUser.id,
                commissionStatus: 'Unclaimed'
            }
        },
        {
            $group: {
              _id: null, 
              totalCommission: { $sum: "$commission" } 
            }
          }
    ])
    let sum 
    if(sumData.length != 0){
        sum = sumData[0].totalCommission
    }else{
        sum = 0
    }
    // let data =  await commissionReportModel.aggregate([
    //     {
    //         $match:{
    //             userId: req.currentUser.id,
    //             Sport:sportId
    //         }
    //     },
    //     {
    //         $group: {
    //           _id: '$event',
    //           totalCommissionPoints: { $sum: '$commPoints' }
    //         }
    //     }
    // ])
    let data = await commissionNewModel.aggregate([
        {
            $match:{
                userId: req.currentUser.id,
                sportId:sportId
            }
        },
        {
            $group: {
              _id: '$seriesName',
              totalCommissionPoints: { $sum: '$commission' }
            }
        }
    ])
    // console.log(data2, "commission")
    let sport = sportId
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    res.status(200).render("./userSideEjs/commissionReportsIn/main", {
        title:"Commission Report",
        user:req.currentUser,
        verticalMenus,
        check:"Comm",
        userLog,
        notifications:req.notifications,
        data,
        sport,
        unclaimCommission:sum
    })
})


exports.getCommissionReporEvent = catchAsync(async(req, res, next) => {
    const me = req.currentUser
    let sportId = req.query.id
    let userLog
    if(req.currentUser){
        userLog = await loginLogs.find({user_id:req.currentUser._id})
    }
    // console.log(sportId, "sportIdsportId")
    let sumData = await commissionNewModel.aggregate([
        {
            $match:{
                userId: req.currentUser.id,
                commissionStatus: 'Unclaimed'
            }
        },
        {
            $group: {
              _id: null, 
              totalCommission: { $sum: "$commission" } 
            }
          }
    ])
    let sum 
    if(sumData.length != 0){
        sum = sumData[0].totalCommission
    }else{
        sum = 0
    }
    let data = await commissionNewModel.aggregate([
        {
          $match: {
            userId: req.currentUser.id,
            seriesName: sportId,
          },
        },
        {
          $group: {
            _id: {
              sportId: '$sportId', // Group by sportId
              match: '$eventName',
            },
            totalCommissionPoints: { $sum: '$commission' },
          },
        },
      ]);
    // console.log(data)
    let sport = data[0]._id.sportId
    let event = sportId
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    res.status(200).render("./userSideEjs/commissionReportEventwise/main", {
        title:"Commission Report",
        user:req.currentUser,
        verticalMenus,
        check:"Comm",
        userLog,
        notifications:req.notifications,
        data,
        sport,
        event,
        unclaimCommission:sum
    })
})

exports.getCommissionReporMatch = catchAsync(async(req, res, next) => {
    const me = req.currentUser
    let sportId = req.query.id
    let userLog
    if(req.currentUser){
        userLog = await loginLogs.find({user_id:req.currentUser._id})
    }
    // console.log(sportId, "SPORTID")
    let data =  await commissionNewModel.aggregate([
        {
            $match:{
                userId: req.currentUser.id,
                eventName:sportId
            }
        }
    ])
    

    let sumData = await commissionNewModel.aggregate([
        {
            $match:{
                userId: req.currentUser.id,
                commissionStatus: 'Unclaimed'
            }
        },
        {
            $group: {
              _id: null, 
              totalCommission: { $sum: "$commission" } 
            }
          }
    ])
    let sum 
    if(sumData.length != 0){
        sum = sumData[0].totalCommission
    }else{
        sum = 0
    }
    // console.log(data)
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    res.status(200).render("./userSideEjs/commissionReportMatch/main", {
        title:"Commission Report",
        user:req.currentUser,
        verticalMenus,
        check:"Comm",
        userLog,
        notifications:req.notifications,
        data,
        unclaimCommission:sum
    })
})


exports.RiskAnalysis = catchAsync(async(req, res, next) => {
    let ip = req.ip
    let limit = 10;
    let ipv4
    if (ip.indexOf('::ffff:') === 0) {
        // Extract the IPv4 portion from the IPv6 address
        ipv4 = ip.split('::ffff:')[1];
    }else{
        ipv4 = ip
    }
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const sportData = await getCrkAndAllData()
    const cricket = sportData[0].gameList[0].eventList
    let match = cricket.find(item => item.eventData.eventId == req.query.id);
    if(match === undefined){
        let data1liveCricket = sportData[1].gameList.map(item => item.eventList.find(item1 => item1.eventData.eventId == req.query.id))
        match = data1liveCricket.find(item => item != undefined)
    }
    if(match == undefined){
        res.status(404).json({
            status:"Success",
            message:"This match is no more live"
        })
    }
    let src
    let status = false
    let liveStream
    let StreamData = await streamModel.findOne({eventId:req.query.id})
    if(StreamData){
        if(StreamData.status){
            src = StreamData.url
        }
    }else{
        liveStream = await liveStreameData(match.eventData.channelId, ipv4)
        const src_regex = /src='([^']+)'/;
        let match1
        // let src
        if(liveStream.data){
    
            match1 = liveStream.data.match(src_regex);
            if (match1) {
                src = match1[1];
                status = true
            } else {
                console.log("No 'src' attribute found in the iframe tag.");
            }
            // console.log(src, 123)
        }

    }
    // const src_regex = /src='([^']+)'/;
    // let match1
    // if(liveStream.data){

    //     match1 = liveStream.data.match(src_regex);
    //     if (match1) {
    //         src = match1[1];
    //     } else {
    //         console.log("No 'src' attribute found in the iframe tag.");
    //     }
    //     // console.log(src, 123)
    // }
    const betLimit = await betLimitModel.find()
    // console.log(match.marketList.goals)
    // let session = match.marketList.session.filter(item => {
        //     let date = new Date(item.updated_on);
        //     return date < Date.now() - 1000 * 60 * 60;
        // });
        let childrenUsername = []
        let children = await User.find({parentUsers:req.currentUser._id})
        children.map(ele => {
            childrenUsername.push(ele.userName) 
        })
        let SportLimits = betLimit.find(item => item.type === "Sport")
        let min 
        let max 
        if (SportLimits.min_stake >= 1000) {
            min = (SportLimits.min_stake / 1000) + 'K';
        } else {
            min = SportLimits.min_stake.toString();
        }
        if (SportLimits.max_stake >= 1000) {
            max = (SportLimits.max_stake / 1000) + 'K';
          } else {
            max = SportLimits.max_stake.toString();
        }
        // console.log(SportLimits, min , max)
        let userLog
        let stakeLabledata
        let userMultimarkets
        let Bets = []
        let rules = await gamrRuleModel.find()
        if(req.currentUser){
            userLog = await loginLogs.find({user_id:req.currentUser._id})
            userMultimarkets = await multimarkets.findOne({userId:req.currentUser._id})
            stakeLabledata = await stakeLable.findOne({userId:req.currentUser._id})
            if(stakeLabledata === null){
                stakeLabledata = await stakeLable.findOne({userId:"6492fd6cd09db28e00761691"})
            }
            Bets = await betModel.aggregate([
               
                {
                    $match: {
                        status: "OPEN" ,
                        eventId: req.query.id,
                        userName:{$in:childrenUsername}
                    }
                },
                {
                    $sort:{"date":-1}
                },
                {
                     $limit:limit
                }
                 
            ])
        }else{
            stakeLabledata = await stakeLable.findOne({userId:"6492fd6cd09db28e00761691"})
        }
        res.status(200).render("./mainRiskAnalysis/main",{
            title:"Risk Analysis",
            user: req.currentUser,
            verticalMenus,
            check:"ExchangeIn",
            match,
            SportLimits,
            liveStream,
            userLog,
            notifications:req.notifications,
            stakeLabledata,
            Bets,
            rules,
            src,
            userMultimarkets,
            min,
            max,
            currentUser:req.currentUser
    })
});


exports.marketBets = catchAsync(async(req, res, next) => {
    console.log(req.query.id)
    let limit = 10;
    let page = 0;
    let childrenUsername = []
    let children = await User.find({parentUsers:req.currentUser._id})
    children.map(ele => {
        childrenUsername.push(ele.userName) 
    })
    let bets = await betModel.find({marketId:req.query.id,userName:{$in:childrenUsername} ,status: 'OPEN'}).sort({'date':-1}).skip(limit * page).limit(limit)
    console.log(bets)
        res.status(200).render("./riskMarketsBets/main",{
            title:"Risk Analysis",
            user: req.currentUser,
            currentUser:req.currentUser,
            bets
    })
});


exports.getSportBetLimit = catchAsync(async(req, res, next) => {
    const me = req.currentUser
    const betLimit = await betLimitModel.find();
    // const sportListData = await getCrkAndAllData()
    // let cricketList = sportListData[0].gameList[0]
    // let footballList = sportListData[1].gameList.find(item => item.sportId == 1)
    // let tennisList = sportListData[1].gameList.find(item => item.sportId == 2) 
    console.log(betLimit)
    res.status(200).render("./betSportLimit/main.ejs", {
        title:"Bet Limits",
        betLimit,
        me,
        currentUser:me
    })
});



exports.getBetLimitSportWise = catchAsync(async(req, res, next) => {
    const me = req.currentUser
    console.log(req.query.game)
    const betLimit = await betLimitModel.find();
    const sportListData = await getCrkAndAllData()
    let cricketList = sportListData[0].gameList[0]
    let footballList = sportListData[1].gameList.find(item => item.sportId == 1)
    let tennisList = sportListData[1].gameList.find(item => item.sportId == 2)
    let gameData = []
    if(req.query.game === "cricket"){
        gameData = cricketList.eventList
    }else if (req.query.game === "football"){
        gameData = footballList.eventList
    }else if (req.query.game === "tennis"){
        gameData = tennisList.eventList
    }
    let series = []
    gameData.forEach(match => {
        let seriesIndex = series.findIndex(series => series.series === match.eventData.league);
        if (seriesIndex === -1) {
            series.push({ series: match.eventData.league, matchdata: [match] });
        } else {
            series[seriesIndex].matchdata.push(match);
        }
    });
    console.log(series)
    res.status(200).render("./betSportWise/main.ejs", {
        title:"Bet Limits",
        betLimit,
        me,
        currentUser:me,
        gameData,
        series,
        gameName:req.query.game
    })
})



exports.getBetLimitMatchWise = catchAsync(async(req, res, next) => {
    const me = req.currentUser
    const betLimit = await betLimitModel.find();
    const sportListData = await getCrkAndAllData()
    let cricketList = sportListData[0].gameList[0].eventList
    let footballList = sportListData[1].gameList.find(item => item.sportId == 1)
    footballList = footballList.eventList
    let tennisList = sportListData[1].gameList.find(item => item.sportId == 2)
    tennisList = tennisList.eventList
    let allData = cricketList.concat(footballList, tennisList)
    let series = req.query.event
    let seriesMatch = allData.filter(item => item.eventData.league == series)
    // console.log(seriesMatch)
    res.status(200).render("./betLimitMatchWise/main.ejs", {
        title:"Bet Limits",
        betLimit,
        me,
        currentUser:me,
        seriesMatch
    })
});


exports.getBetLimitMatch = catchAsync(async(req, res, next) => {
    const me = req.currentUser
    const betLimit = await betLimitModel.find();
    const sportListData = await getCrkAndAllData()
    let cricketList = sportListData[0].gameList[0].eventList
    let footballList = sportListData[1].gameList.find(item => item.sportId == 1)
    footballList = footballList.eventList
    let tennisList = sportListData[1].gameList.find(item => item.sportId == 2)
    tennisList = tennisList.eventList
    let allData = cricketList.concat(footballList, tennisList)
    let series = req.query.match
    let seriesMatch = allData.filter(item => item.eventData.name == series)
    let betLimitMatchWise = await betLimitMatchWisemodel.findOne({matchTitle:series})
    
    // console.log(seriesMatch)
    res.status(200).render("./betLimitMatch/main.ejs", {
        title:"Bet Limits",
        betLimit,
        me,
        currentUser:me,
        seriesMatch,
        series,
        betLimitMatchWise
    })
});


exports.getcommissionMarketWise1 = catchAsync(async(req, res, next) => {
    const me = req.currentUser
    let match = req.query.event
    let childrenUsername = []
    let children = await User.find({parentUsers:req.currentUser._id})
    children.map(ele => {
        childrenUsername.push(ele.userName) 
    })
    console.log(req.originalUrl, "URL")
    if(req.query.market){
        let market 
        let marketName 
        if(req.query.market.toLowerCase().startsWith('book')){
            market =  {
                $regex: /^book/i
              }
              marketName = 'BOOKMAKER'
        }else{
            market = req.query.market
            marketName = req.query.market
        }
        // console.log(market)
        let thatMarketData = await commissionNewModel.aggregate([
            {
                $match: {
                eventDate: {
                    $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) 
                },
                userName:{$in:childrenUsername},
                eventName:match,
                marketName:market
                }
            },
            {
                $group: {
                _id: "$userName",
                totalCommission: { $sum: "$commission" },
                netupline: { $sum: "$upline" }
                }
            }
        ])
        // console.log(thatMarketData, "thatMarketData")
        res.status(200).render('./commissionMarketWise/commissionMarketWise2/commissionMarketWise2.ejs', {
            title:"Commission Report",
            me,
            currentUser:me,
            thatMarketData,
            match,
            marketName
        })
    }else{
        let marketWiseData = await commissionNewModel.aggregate([
            {
                $match: {
                eventDate: {
                    $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) 
                },
                userName:{$in:childrenUsername},
                eventName:match
                }
            },
            {
                $group: {
                _id: "$marketName",
                totalCommission: { $sum: "$commission" },
                eventDate: { $first: "$eventDate" }
                }
            }
        ])
        console.log(marketWiseData, "marketWiseData")
        res.status(200).render('./commissionMarketWise/commissionMarketWise1/commissionMarketWise1.ejs', {
            title:"Commission Report",
            me,
            currentUser:me,
            marketWiseData,
            match,
        })
    }
});


exports.getcommissionUser = catchAsync(async(req, res, next) => {
    const me = req.currentUser
    let user = req.query.User
    // console.log(req.query.event)
    if(req.query.event){
        let eventData = await commissionNewModel.aggregate([
            {
                $match:{
                    eventDate: {
                        $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) 
                    },
                    userName:user,
                    eventName:req.query.event
                }
            }
        ])
        res.status(200).render('./commissionUser/commissionUser2.ejs', {
            title:"Commission Report",
            me,
            currentUser:me,
            user,
            eventName:req.query.event,
            eventData
        })
    }else{

        let Userdata = await commissionNewModel.aggregate([
                {
                    $match: {
                    eventDate: {
                        $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) 
                    },
                    userName:user
                    }
                },
                {
                    $group: {
                    _id: "$eventName",
                    totalCommission: { $sum: "$commission" },
                    eventDate: { $first: "$eventDate" }
                    }
                }
        ])
        res.status(200).render('./commissionUser/commissionUser.ejs', {
            title:"Commission Report",
            me,
            currentUser:me,
            user,
            Userdata
        })
    }
})