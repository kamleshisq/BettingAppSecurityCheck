const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');
const User = require('../model/userModel');
const loginLogs = require("../model/loginLogs");
const Role = require('../model/roleModel');
const betModel = require("../model/betmodel");
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
const catalogController = require("./../model/catalogControllModel")
const commissionReportModel = require("../model/commissionReport");
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
            return next(new AppError('id is not valid'))
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
    let roles1 = await Role.find({role_level:{$in:req.currentUser.role.userAuthorization}}).sort({role_level:1});
    const data = await Promise.all(requests);
    // console.log(data)
    const users = data[0].child;
    const roles = roles1;
    const currentUser = req.currentUser
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
    // console.log("1")
    console.log(req.currentUser)
    if(req.currentUser){
        if(req.currentUser.role_type < 5){
            var WhiteLabel = await whiteLabel.find()
            let urls = [
                {
                    url:`http://172.105.58.243/api/v1/users/getOwnChild?id=${req.currentUser.id}`,
                    name:'user'
                },
                {
                    url:`http://172.105.58.243/api/v1/role/getAuthROle`,
                    name:'role'
                }
            ]
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
            let roles1 = await Role.find({role_level:{$in:req.currentUser.role.userAuthorization}}).sort({role_level:1});
            const data = await Promise.all(requests);
            // console.log(data)
            const users = data[0].child;
            const roles = roles1;
            const currentUser = req.currentUser
            const rows = data[0].rows
            const me = data[0].me
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
        }
    }
    res.status(200).render('loginPage', {
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
    let users = await User.find({is_Online:true , parentUsers:{$in:[currentUser._id]}})
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
    let bets
    let betsDetails
    if(userDetails.roleName != "user"){
        bets = await betModel.aggregate([
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
                  "user.parentUsers": { $in: [req.query.id] }
                }
              },
              {
            $sort: {
                date: -1
            }
        },
        {
            $limit: 20
        }
            ])

            betsDetails = await betModel.aggregate([
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
                      "user.parentUsers": { $in: [req.query.id] }
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
        bets = await betModel.find({userId:req.query.id}).sort({date:-1}).limit(20)
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

    let ACCount = await accountStatement.find({user_id:req.query.id}).sort({date: -1}).limit(20)
    let historty = await loginLogs.find({userName:userDetails.userName}).sort({login_time:-1}).limit(20)
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
    let LiveCricket = cricket.filter(item => item.eventData.type === "IN_PLAY")
    let footBall = sportListData[1].gameList.find(item => item.sport_name === "Football")
    let Tennis = sportListData[1].gameList.find(item => item.sport_name === "Tennis")
    footBall = footBall.eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    Tennis = Tennis.eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    let liveFootBall = footBall.filter(item => item.eventData.type === "IN_PLAY");
    let liveTennis = Tennis.filter(item => item.eventData.type === "IN_PLAY")
    let userLog
    if(user){
        userLog = await loginLogs.find({user_id:user._id})
    }
    res.status(200).render("./userSideEjs/home/homePage",{
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
        notifications:req.notifications
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
        title:"Account Statement",
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
    // const role_type = []
    // const roles = await Role.find({role_type: {$gt:currentUser.role_type}});
    // // let role_type =[]
    // for(let i = 0; i < roles.length; i++){
    //     role_type.push(roles[i].role_type)
    // }
    // const bets = await betModel.find({role_type:{$in:role_type}, status:{$ne:"OPEN"}}).limit(10)
    User.aggregate([
        {
          $match: {
            parentUsers: { $elemMatch: { $eq: req.currentUser.id } }
          }
        },
        {
          $group: {
            _id: null,
            userIds: { $push: '$_id' } 
          }
        }
      ])
        .then((userResult) => {
          const userIds = userResult.length > 0 ? userResult[0].userIds.map(id => id.toString()) : [];
      
          betModel.aggregate([
            {
              $match: {
                userId: { $in: userIds },
                status: {$ne:"OPEN"}
              }
            },
            { $limit : 10 }
          ])
            .then((betResult) => {
            //   socket.emit("aggreat", betResult)
                res.status(200).render("./reports/reports",{
                    title:"Reports",
                    bets:betResult,
                    me : currentUser,
                    currentUser
                })
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    // res.status(200).render('./reports/reports',{
    //     title:"Reports",
    //     me:currentUser,
    //     bets
    // })
})

exports.gameReportPage = catchAsync(async(req, res, next) => {
    const currentUser = req.currentUser

    User.aggregate([
        {
          $match: {
            parentUsers: { $elemMatch: { $eq: req.currentUser.id } }
          }
        },
        {
          $group: {
            _id: null,
            userIds: { $push: '$userName' } 
          }
        }
      ])
        .then((userResult) => {
          const userIds = userResult.length > 0 ? userResult[0].userIds : [];
      
          betModel.aggregate([
            {
              $match: {
                userName: { $in: userIds },
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
            .then((betResult) => {
            //   socket.emit("aggreat", betResult)
            res.status(200).render('./gamereports/gamereport',{
                title:"gameReports",
                me:currentUser,
                games:betResult,
                currentUser
            })
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });    

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

exports.useracount = catchAsync(async(req, res, next) => {
    const currentUser = req.currentUser
    // console.log(currentUser)
    var fullUrl = req.protocol + '://' + req.get('host') + '/api/v1/Account/getUserAccStatement?id=' + currentUser._id 
    fetch(fullUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ` + req.token }
    }).then(res => res.json())
    .then(json =>{ 
        // console.log(json)
        const data = json.userAcc
        res.status(200).render('./userAccountStatement/useracount',{
        title:"UserAccountStatement",
        me:currentUser,
        data,
        currentUser
    })
});

    
})

exports.userhistoryreport = catchAsync(async(req, res, next) => {
    // const currentUser = global._User
    const currentUser = req.currentUser
    // const roles = await Role.find({role_level: {$gt:req.currentUser.role.role_level}});
    // let role_type =[]
    // for(let i = 0; i < roles.length; i++){
    //     role_type.push(roles[i].role_type)
    // }
    // // console.log(role_type)
    // let Logs
    // if(currentUser.role_type == 1){
    //     Logs = await loginLogs.find().limit(10)
    // }else{
    //     Logs = await loginLogs.find({ parentUsers:{$elemMatch:{$eq:req.currentUser.id}}}).limit(10)
    // }
    // console.log(Logs)
    User.aggregate([
        {
          $match: {
            parentUsers: { $elemMatch: { $eq: req.currentUser.id } }
          }
        },
        {
          $group: {
            _id: null,
            userIds: { $push: '$_id' } 
          }
        }
      ])
        .then((userResult) => {
          const userIds = userResult.length > 0 ? userResult[0].userIds : [];
        loginLogs.aggregate([
            {
              $match:{
                user_id:{$in:userIds}
              }
            },{
                $sort:{
                    login_time:-1
                }
            },
            {
                $limit:10
            }
          ])
            .then((Logs) => {
            //   socket.emit("aggreat", betResult)
            res.status(200).render('./userHistory/userhistoryreport',{
                title:"UserHistory",
                me:currentUser,
                Logs,
                currentUser
            })
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    })

exports.plreport = catchAsync(async(req, res, next) => {
    const roles = await Role.find({role_level: {$gt:req.currentUser.role.role_level}});
    let role_type =[]
    for(let i = 0; i < roles.length; i++){
        role_type.push(roles[i].role_type)
    }
    // console.log(role_type)
    const currentUser = req.currentUser
    let users
    if(currentUser.role_type == 1){
        users = await User.find({isActive:true}).limit(10)
    }else{
        users = await User.find({role_type:{$in:role_type},isActive:true , parentUsers:{$elemMatch:{$eq:req.currentUser.id}}}).limit(10)
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
    const fundList = await houseFundModel.find({userId:me.id})
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
              series: {$first: "$event"} 
            }
          },
          {
            $project: {
              _id: 0,
              matchName: "$_id",
              eventdate: 1,
              eventid: 1,
              series:1,
              count: 1
            }
          }
    ])
    // let users = await User.find({roleName:"Super-Duper-Admin"})
    // for(let i = 0; i < users.length; i++){
    //     await commissionModel.create({userId:users[i].id})
    //     // let settlement = await sattlementModel.findOne({userId:users[i].id})
    //     // if(settlement === null){
    //     //     await sattlementModel.create({userId:users[i].id})
    //     // }

    // }
    // let sportData = await getCrkAndAllData()
    // const cricket1 = sportData[0].gameList[0].eventList
    // console.log(cricket1)
    // console.log(betsEventWise)
    res.status(200).render("./sattelment/setalment",{
        title:"SETTLEMENTS",
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
        }
    ])
    const me = req.currentUser
    // console.log(whiteLabelWise)
    res.status(200).render("./whiteLableAnalysis/whiteLableAnalysis",{
        title:"whiteLableAnalysis",
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
    const gameAnalist = await betModel.aggregate([
        {
            $lookup:{
                from:'users',
                localField:'userName',
                foreignField:'userName',
                as:'userDetails'
            }
        },
        {
            $unwind:'$userDetails'
        },
        {
            $match:{
                'userDetails.isActive':true,
                'userDetails.roleName':{$ne:'Admin'},
                'userDetails.role_type':{$in:role_type},
                'userDetails.parentUsers':{$elemMatch:{$eq:req.currentUser.id}},
                'userDetails.whiteLabel':fWhitlabel
            }
        },
        {
            $group:{
                _id:{
                    event:'$event',
                    userName:'$userName'
                },
                betCount:{$sum:1},
                loss:{$sum:{$cond:[{$eq:['$status','LOSS']},1,0]}},
                won:{$sum:{$cond:[{$eq:['$status','WON']},1,0]}},
                open:{$sum:{$cond:[{$eq:['$status','OPEN']},1,0]}},
                returns:{$sum:{$cond:[{$in:['$status',['LOSS','OPEN']]},'$returns',{ "$subtract": [ "$returns", "$Stake" ] }]}}
                
            }
        },
        {
            $group:{
                _id:'$_id.event',
                Total_User:{$sum:1},
                betcount:{$sum:'$betCount'},
                loss:{$sum:'$loss'},
                won:{$sum:'$won'},
                open:{$sum:'$open'},
                returns:{$sum:'$returns'}
            }
        }
    ])
    // console.log(gameAnalist)

    const me = req.currentUser
    res.status(200).render("./gameAnalysis/gameanalysis",{
        title:"Game Analysis",
        gameAnalist,
        me,
        currentUser:me
    })
})

exports.getStreamManagementPage = catchAsync(async(req, res, next) => {
    const me = req.currentUser
    res.status(200).render("./streamManagement/streammanagement",{
        title:"Streammanagement",
        me,
        currentUser:me
    })
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
    User.aggregate([
        {
          $match: {
            parentUsers: { $elemMatch: { $eq: req.currentUser.id } }
          }
        },
        {
          $group: {
            _id: null,
            userIds: { $push: '$_id' } 
          }
        }
      ])
        .then((userResult) => {
          const userIds = userResult.length > 0 ? userResult[0].userIds.map(id => id.toString()) : [];
      
          betModel.aggregate([
            {
              $match: {
                userId: { $in: userIds },
                status: 'OPEN'
              }
            },
            { $limit : 10 }
          ])
            .then((betResult) => {
            //   socket.emit("aggreat", betResult)
              let me = req.currentUser
                res.status(200).render("./betMonitering/betmoniter",{
                    title:"Betmoniter",
                    bets:betResult,
                    me,
                    currentUser:me
                })
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    // const me = global._User
    // res.status(200).render("./betMonitering/betmoniter",{
    //     title:"Betmoniter",
    //     bets,
    //     me
    // })
})

exports.getBetAlertPage = catchAsync(async(req, res, next) => {
    User.aggregate([
        {
          $match: {
            parentUsers: { $elemMatch: { $eq: req.currentUser.id } }
          }
        },
        {
          $group: {
            _id: null,
            userIds: { $push: '$_id' } 
          }
        }
      ])
        .then((userResult) => {
          const userIds = userResult.length > 0 ? userResult[0].userIds.map(id => id.toString()) : [];
      
          betModel.aggregate([
            {
              $match: {
                userId: { $in: userIds },
                status: 'Alert'
              }
            },
            { $limit : 10 }
          ])
            .then((betResult) => {
            //   socket.emit("aggreat", betResult)
              let me = req.currentUser
              res.status(200).render("./alertBet/alertbet", {
                title:"Alert Bet",
                bets:betResult,
                me,
                currentUser:me
            })
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        }); 
})

exports.getCasinoControllerPage = catchAsync(async(req, res, next) => {
    let data;
    let RG;
    let currentUser = req.currentUser
    data = await gameModel.find({game_name:new RegExp("32 Cards","i")})
    RG = await gameModel.find({sub_provider_name:"Royal Gaming"})
    // console.log(RG.length)
    res.status(200).render("./casinoController/casinocontrol", {
        title:"casinoController",
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
    const data = await gameModel.find();
    let user = req.currentUser
    res.status(200).render('allCasinoGame', {
        title:"allGame",
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


    User.aggregate([
        {
          $match: {
            parentUsers: { $elemMatch: { $eq: req.currentUser.id } }
          }
        },
        {
          $group: {
            _id: null,
            userIds: { $push: '$_id' } 
          }
        }
      ])
        .then((userResult) => {
          const userIds = userResult.length > 0 ? userResult[0].userIds.map(id => id.toString()) : [];
      
          betModel.aggregate([
            {
              $match: {
                userId: { $in: userIds },
                status: 'CANCEL'
              }
            },
            { $limit : 10 }
          ])
            .then((betResult) => {
            //   socket.emit("aggreat", betResult)
              let me = req.currentUser
                res.status(200).render("./voidBet/voidBet",{
                    title:"Void Bets",
                    bets:betResult,
                    me,
                    currentUser:me
                })
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
});


exports.getBetLimitPage = catchAsync(async(req, res, next) => {
    const me = req.currentUser
    const betLimit = await betLimitModel.find()
    res.status(200).render("./betLimit/betLimit", {
        title:"Bet Limits",
        betLimit,
        me,
        currentUser:me
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
    let body = JSON.stringify(["4.2042765376-F2", "4.689323283-F2"]);
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
        console.log(result)
        res.status(200).json({
            result
        })
    })
});


exports.getMarketResult = catchAsync(async(req, res, next) => {
    let body = JSON.stringify(["1.216954411"]);
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
    let liveCricket = cricket.filter(item => item.eventData.type === "IN_PLAY");
    const footBall = sportData[1].gameList.find(item => item.sport_name === "Football");
    const Tennis = sportData[1].gameList.find(item => item.sport_name === "Tennis");
    let liveFootBall = footBall.eventList.filter(item => item.eventData.type === "IN_PLAY");
    let liveTennis = Tennis.eventList.filter(item => item.eventData.type === "IN_PLAY")
    let currentUser =  req.currentUser
    console.log(req.currentUser)
    let openBet = topGames = await betModel.aggregate([
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
        //   {
        //     $group: {
        //         _id: "$betType",
        //         details: {
        //             $push: {
        //                 id: "$marketId",
        //                 marketName: "$marketName",
        //                 match:"$match",
        //                 date:'$date'
        //                 // Add other fields you want here
        //             }
        //         }
        //     }
        // },
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
        },
        // {
        //     $unwind: "$details"
        // },
        // {
        //     $match: {
        //         "details.shortMarketName": {
        //             $in: ["mat", "boo", "tos"]
        //         }
        //     }
        // },
        // {
        //     $project: {
        //         _id: 0,
        //         bettype: "$_id",
        //         details: 1
        //     }
        // }
        // {
        //     $group: {
        //         _id: {
        //             betType: "$_id.betType",
        //             marketId: "$_id.marketId"
        //         },
        //         details: {
        //             $push: {
        //                 id: "$_id.marketId",
        //                 marketName: "$marketName",
        //                 match: "$match",
        //                 date: "$date",
        //                 stake: "$stake",
        //                 beton: "$_id.beton"
        //             }
        //         }
        //     }
        // },
        // {
        //     $group: {
        //         _id: "$_id.betType",
        //         details: { $push: "$details" }
        //     }
        // },
        // {
        //     $project: {
        //         _id: 0,
        //         bettype: "$_id",
        //         details: 1
        //     }
        // },
        // {
        //     $project: {
        //         _id: 0,
        //         bettype: "$_id",
        //         details: 1
        //     }
        // }
        // {
        //     $project: {
        //         _id: 0,
        //         bettype: "$_id",
        //         details: {
        //             $filter: {
        //                 input: "$details",
        //                 as: "detail",
        //                 cond: {
        //                     $in: [
        //                         { $substrCP: [{ $toLower: "$$detail.marketName" }, 0, 3] },
        //                         ["mat", "boo", "tos"]
        //                     ]
        //                 }
        //             }
        //         }
        //     }
        // }
    ])
    console.log(openBet, "openBet")
    console.log(openBet[0].details[0][0], "openBet")
    // console.log(liveFootBall)
    // console.log(liveTennis)
    // console.log(liveCricket)
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
        title:"CMS",
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
    const sportListData = await getCrkAndAllData()
    const cricket = sportListData[0].gameList[0].eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    let LiveCricket = cricket.filter(item => item.eventData.type === "IN_PLAY")
    let footBall = sportListData[1].gameList.find(item => item.sport_name === "Football")
    let Tennis = sportListData[1].gameList.find(item => item.sport_name === "Tennis")
    footBall = footBall.eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    Tennis = Tennis.eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    let liveFootBall = footBall.filter(item => item.eventData.type === "IN_PLAY");
    let liveTennis = Tennis.filter(item => item.eventData.type === "IN_PLAY")
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
        catalog
        
    })
})


exports.inplayMatches = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    const sportListData = await getCrkAndAllData()
    const cricket = sportListData[0].gameList[0].eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    let LiveCricket = cricket.filter(item => item.eventData.type === "IN_PLAY")
    let footBall = sportListData[1].gameList.find(item => item.sport_name === "Football")
    let Tennis = sportListData[1].gameList.find(item => item.sport_name === "Tennis")
    footBall = footBall.eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    Tennis = Tennis.eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    let liveFootBall = footBall.filter(item => item.eventData.type === "IN_PLAY");
    let liveTennis = Tennis.filter(item => item.eventData.type === "IN_PLAY")
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
        user,
        verticalMenus,
        check:"In-Play",
        data,
        liveFootBall,
        liveTennis,
        LiveCricket,
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
    let LiveCricket = cricket.filter(item => item.eventData.type === "IN_PLAY")
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
    let games = await gameModel.find();
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
    let liveFootBall = footBall.filter(item => item.eventData.type === "IN_PLAY");
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
        catalog
    })
})

exports.TennisPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    const sportListData = await getCrkAndAllData()
    let Tennis = sportListData[1].gameList.find(item => item.sport_name === "Tennis")
    Tennis = Tennis.eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    let liveTennis = Tennis.filter(item => item.eventData.type === "IN_PLAY")
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
    const liveStream = await liveStreameData(match.eventData.channelId, ipv4)
    const src_regex = /src='([^']+)'/;
    let match1
    let src
    if(liveStream.data){

        match1 = liveStream.data.match(src_regex);
        if (match1) {
            src = match1[1];
        } else {
            console.log("No 'src' attribute found in the iframe tag.");
        }
        // console.log(src, 123)
    }
    const betLimit = await betLimitModel.find()
    // console.log(match.marketList.goals)
    // let session = match.marketList.session.filter(item => {
        //     let date = new Date(item.updated_on);
        //     return date < Date.now() - 1000 * 60 * 60;
        // });
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
        console.log(SportLimits, min , max)
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
        res.status(200).render("./userSideEjs/userMatchDetails/main",{
            user: req.currentUser,
            verticalMenus,
            check:"ExchangeIn",
            match,
            SportLimits,
            liveStream,
            userLog,
            notifications:req.notifications,
            stakeLabledata,
            betsOnthisMatch,
            rules,
            src,
            userMultimarkets,
            min,
            max
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
    let SportLimits = betLimit.find(item => item.type === "Sport")
    if (SportLimits.min_stake >= 1000) {
        SportLimits.min_stake = ( SportLimits.min_stake / 1000).toFixed(1) + 'K';
      } else {
        SportLimits.min_stake =  SportLimits.min_stake.toString();
    }
    if (SportLimits.max_stake >= 1000) {
        SportLimits.max_stake = ( SportLimits.max_stake / 1000).toFixed(1) + 'K';
      } else {
        SportLimits.max_stake =  SportLimits.max_stake.toString();
    }
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
    // console.log(multimarket)
    res.status(200).render("./userSideEjs/multimarkets/main",{
        user: req.currentUser,
        verticalMenus,
        check:"Multi Markets",
        SportLimits,
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
    let games = await gameModel.find();
    let userLog
    if(user){
        userLog = await loginLogs.find({user_id:user._id})
    }
    res.status(200).render("./userSideEjs/virtuals/main",{
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
    let games = await gameModel.find();
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
    let games = await gameModel.find();
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
    let games = await gameModel.find();
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
    let games = await gameModel.find();
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
    let games = await gameModel.find();
    let userLog = await loginLogs.find({user_id:user._id})
    // console.log(req.query)
    let result = await betModel.find({event:req.query.eventName, match:req.query.matchName, userId:user.id}).limit(20)
    //   console.log(result)
    res.status(200).render("./userSideEjs/gameReportmatch/main",{
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
    let games = await gameModel.find();
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
        title:"CMS",
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
    let games = await gameModel.find();
    let userLog = await loginLogs.find({user_id:user._id})
    res.status(200).render("./userSideEjs/Kyc/main",{
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
    // console.log("working")
    // console.log(req.query.id)
    let betsEventWise = await betModel.aggregate([
        {
            $match: {
                status:"OPEN",
                eventId:req.query.id
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
              _id: "$marketName",
              count: { $sum: 1 },
              marketId: { $first: "$marketId" },
              match: { $first: "$match" },
            }
          },
          {
            $project: {
              _id: 0,
              marketName: "$_id",
              marketId: 1,
              count: 1,
              match : 1
            }
          }
    ])
    res.status(200).render("./sattlementInPage/main",{
        title:"SETTLEMENTS",
        me,
        currentUser:me,
        betsEventWise
    })
} )

exports.getSettlementHistoryPage = catchAsync(async(req, res, next) => {
    let me = req.currentUser
    // console.log(me)
    let History
    if(me.roleName === "Admin"){
        History = await settlementHisory.find()
    }else{
        History = await settlementHisory.find({userId:me._id})
    }
    res.status(200).render("./settlemetHistory/settlemetHistory",{
        title:"SETTLEMENTS",
        me,
        currentUser:me,
        History
    })
} )



exports.getCommissionReport = catchAsync(async(req, res, next) => {
    let me = req.currentUser
    let data = await accountStatement.find({user_id:me._id,description: { $regex: /^commission for/ } }).sort({date:-1}).limit(20)
    // console.log(data)
    res.status(200).render("./commissionPage/commissionPage",{
        title:"Commission",
        me,
        currentUser:me,
        data
    })
} )

exports.getCatalogControllerPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    // const sportListData = await getCrkAndAllData()
    // const sportList = sportListData[1].gameList
    const sportList =[
        {sport_name:"baseball",sportId:30},
        {sport_name:"basketball",sportId:10}	,
        {sport_name:"cricket",sportId:4}	,
        {sport_name:"Greyhound Racing",sportId:20}	,
        {sport_name:"Horse Racing",sportId:77}	,
        {sport_name:"Football",sportId:1}	,
        {sport_name:"tennis",sportId:2}
    ]
    console.log(sportList)
    // const cricket = sportListData[0].gameList[0].eventList
    // let LiveCricket = cricket.filter(item => item.eventData.type === "IN_PLAY")
    // const footBall = sportListData[1].gameList.find(item => item.sport_name === "Football");
    // const Tennis = sportListData[1].gameList.find(item => item.sport_name === "Tennis");
    // let liveFootBall = footBall.eventList.filter(item => item.eventData.type === "IN_PLAY");
    // let liveTennis = Tennis.eventList.filter(item => item.eventData.type === "IN_PLAY")
    // console.log(liveTennis.length != 0)
    console.log("liveFootBall")
    res.status(200).render("./catalogController/catalogcontroller", {
        title:"catalogController",
        data:sportList,
        me: user,
        currentUser: user
    })
    // res.status(200).json({
    //     data:sportList
    // })
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
        {sport_name:"cricket",sportId:4}	,
        {sport_name:"Greyhound Racing",sportId:20}	,
        {sport_name:"Horse Racing",sportId:77}	,
        {sport_name:"Football",sportId:1}	,
        {sport_name:"tennis",sportId:2}
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
                title:"catalogController",
                data:seriesObjList,
                me: user,
                currentUser: user,
                breadcumArr
            })
        })
    }else{
        return res.status(200).render("./catalogController/compitition", {
            title:"catalogController",
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
        let = eventListPromis = series.eventList.map(async(item) => {
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
                    seriesObjList.push({name:item.eventData.name,created_on:item.eventData.created_on,status:true,count,eventId:item.eventData.eventId})
                    
                }else{
                    count = await betModel.count({eventId:item.eventData.eventId,status:"OPEN"})
                    seriesObjList.push({name:item.eventData.name,created_on:item.eventData.created_on,status:status.status,count,eventId:item.eventData.eventId})

                }
            }
            
        })
        console.log(seriesObjList)
        Promise.all(eventListPromis).then(()=>{
            return res.status(200).render("./catalogController/events", {
                title:"catalogController",
                data:seriesObjList,
                me: user,
                currentUser: user,
                breadcumArr
            })
        })
    }else{
        return res.status(200).render("./catalogController/events", {
            title:"catalogController",
            data:seriesObjList,
            me: user,
            currentUser: user,
            breadcumArr
        })
    }
})


exports.CommissionMarkets = catchAsync(async(req, res, next) => {
    
    const me = req.currentUser
    res.status(200).render("./commissionMarket/main",{
        title:"CommiSSion Markets",
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
    let data =  await commissionReportModel.aggregate([
        {
            $match:{
                userId: req.currentUser.id
            }
        },
        {
            $group: {
              _id: '$Sport',
              totalCommissionPoints: { $sum: '$commPoints' }
            }
        }
    ])
    console.log(data)
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    res.status(200).render("./userSideEjs/commissionReport/main", {
        title:"Commission Report",
        user:req.currentUser,
        verticalMenus,
        check:"Comm",
        userLog,
        notifications:req.notifications,
        data
    })
})

exports.getCommissionReporIntUserSide = catchAsync(async(req, res, next) => {
    const me = req.currentUser
    let sportId = req.query.id
    let userLog
    if(req.currentUser){
        userLog = await loginLogs.find({user_id:req.currentUser._id})
    }
    let data =  await commissionReportModel.aggregate([
        {
            $match:{
                userId: req.currentUser.id,
                Sport:sportId
            }
        },
        {
            $group: {
              _id: '$event',
              totalCommissionPoints: { $sum: '$commPoints' }
            }
        }
    ])
    console.log(data)
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    res.status(200).render("./userSideEjs/commissionReportsIn/main", {
        title:"Commission Report",
        user:req.currentUser,
        verticalMenus,
        check:"Comm",
        userLog,
        notifications:req.notifications,
        data
    })
})


exports.getCommissionReporEvent = catchAsync(async(req, res, next) => {
    const me = req.currentUser
    let sportId = req.query.id
    let userLog
    if(req.currentUser){
        userLog = await loginLogs.find({user_id:req.currentUser._id})
    }
    console.log(sportId)
    let data =  await commissionReportModel.aggregate([
        {
            $match:{
                userId: req.currentUser.id,
                event:sportId
            }
        },
        {
            $group: {
              _id: '$match',
              totalCommissionPoints: { $sum: '$commPoints' }
            }
        }
    ])
    console.log(data)
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    res.status(200).render("./userSideEjs/commissionReportEventwise/main", {
        title:"Commission Report",
        user:req.currentUser,
        verticalMenus,
        check:"Comm",
        userLog,
        notifications:req.notifications,
        data
    })
})

exports.getCommissionReporMatch = catchAsync(async(req, res, next) => {
    const me = req.currentUser
    let sportId = req.query.id
    let userLog
    if(req.currentUser){
        userLog = await loginLogs.find({user_id:req.currentUser._id})
    }
    console.log(sportId)
    let data =  await commissionReportModel.aggregate([
        {
            $match:{
                userId: req.currentUser.id,
                match:sportId
            }
        }
    ])
    console.log(data)
    let verticalMenus = await verticalMenuModel.find().sort({num:1});
    res.status(200).render("./userSideEjs/commissionReportMatch/main", {
        title:"Commission Report",
        user:req.currentUser,
        verticalMenus,
        check:"Comm",
        userLog,
        notifications:req.notifications,
        data
    })
})


exports.RiskAnalysis = catchAsync(async(req, res, next) => {
    let ip = req.ip
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
    const liveStream = await liveStreameData(match.eventData.channelId, ipv4)
    const src_regex = /src='([^']+)'/;
    let match1
    let src
    if(liveStream.data){

        match1 = liveStream.data.match(src_regex);
        if (match1) {
            src = match1[1];
        } else {
            console.log("No 'src' attribute found in the iframe tag.");
        }
        // console.log(src, 123)
    }
    const betLimit = await betLimitModel.find()
    // console.log(match.marketList.goals)
    // let session = match.marketList.session.filter(item => {
        //     let date = new Date(item.updated_on);
        //     return date < Date.now() - 1000 * 60 * 60;
        // });
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
        console.log(SportLimits, min , max)
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
        res.status(200).render("./mainRiskAnalysis/main",{
            user: req.currentUser,
            verticalMenus,
            check:"ExchangeIn",
            match,
            SportLimits,
            liveStream,
            userLog,
            notifications:req.notifications,
            stakeLabledata,
            betsOnthisMatch,
            rules,
            src,
            userMultimarkets,
            min,
            max
    })
});
