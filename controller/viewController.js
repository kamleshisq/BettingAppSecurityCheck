const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');
const User = require('../model/userModel');
const loginLogs = require("../model/loginLogs");
const Role = require('../model/roleModel');
const betModel = require("../model/betmodel");
const Stream = require('../model/streammanagement')
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
// const sportList = require("../utils/getSportList");
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
const InPlayEvent = require('./../model/inPlayModel')
const commissionReportModel = require("../model/commissionReport");
const betLimitMatchWisemodel = require('../model/betLimitMatchWise');
const streamModel = require('../model/streammanagement');
const InprogreshModel = require('../model/InprogressModel');
const commissionMarketModel = require('../model/CommissionMarketsModel')
let eventNotification = require('../model/eventNotification');
const commissionNewModel = require('../model/commissioNNModel');
const resumeSuspendModel = require('../model/resumeSuspendMarket');
const PaymentMethodModel = require('../model/paymentmethodmodel')
const paymentReportModel = require('../model/paymentreport');
const runnerData = require('../model/runnersData');
const manageAccountUser = require('../model/paymentMethodUserSide');
const withdrawalRequestModel = require('../model/withdrowReqModel');
const globalSettingModel = require('../model/globalSetting');
const colorCodeModel = require('../model/colorcodeModel');
const bycrypt = require('bcrypt');
const footerInfoModel = require('../model/footerInfoModel');
const { consoleBodyAndURL } = require('./walletController');
const socialinfomodel = require('../model/socialMediaLinks');
const findvisible = require('../utils/findvisible');
const { ObjectId } = require('mongodb');

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

const whiteLabelcheck = (req) => {
    let hostname = req.headers.host
    // console.log(hostname,'==>hostname')
    let whiteLabel = process.env.whiteLabelName
    if(!req.currentUser || req.currentUser.roleName == "DemoLogin"){
        whiteLabel = hostname
    }else{
        if(req.currentUser.role_type == 1){
            whiteLabel = "1"
        }else{
            whiteLabel = req.currentUser.whiteLabel
        }
    }
    // console.log(whiteLabel)
    return whiteLabel
}


exports.userTable = catchAsync(async(req, res, next) => {
    // await User.updateMany({passcode:await bycrypt.hash('123456', 12)})
    var WhiteLabel = await whiteLabel.find()
    let id = req.query.id;
    let page = req.query.page;
    let urls;
    let roles1 = []
    let operationparentId;
    if(req.currentUser.roleName == 'Operator'){
        let parentUser = await User.findById(req.currentUser.parent_id)
        roles1 = await Role.find({role_level:{$gt:parentUser.role.role_type}}).sort({role_level:1});
        operationparentId = parentUser.parent_id
    }else{
        let parentUser = await User.findById(req.currentUser._id.toString())
        let rolesABC = await Role.find().sort({role_level:1});
        for(let i = 0; i < rolesABC.length; i++){
            if(rolesABC[i].role_level === 5){
                roles1.push(rolesABC[i])
            }else if(rolesABC[i].role_level > parentUser.role.role_level){
                roles1.push(rolesABC[i])
            }
        }
        operationparentId = req.currentUser.parent_id

    }
    // let games = await gameModel.find({whiteLabelName:"1"})

    // let newgames = []
    // games.map(ele => {
    //     newgames.push({
    //         game_name:ele.game_name,
    //         provider_name:ele.provider_name,
    //         sub_provider_name:ele.sub_provider_name,
    //         category:ele.category,
    //         status:true,
    //         game_id:ele.game_id,
    //         game_code:ele.game_code,
    //         url_thumb:ele.url_thumb,
    //         whiteLabelName:'dev.ollscores.com'
    //     })
    // })
    // await gameModel.insertMany(newgames)

    if(req.currentUser.roleName === "Super-Duper-Admin"){
        roles1 = roles1.filter(item => item.roleName !== 'DemoLogin')
    }else{
        const rolesToRemove = ['DemoLogin', 'Operator'];
        roles1 = roles1.filter(item => !rolesToRemove.includes(item.roleName));
    }
    // console.log(roles1, "roles1roles1roles1roles1")
    if(id && id != operationparentId){
        var isValid = mongoose.Types.ObjectId.isValid(id)

        if(!isValid){
            return res.redirect('/admin/userManagement')
        }
        urls = [
            {
                url:`http://127.0.0.1:${process.env.port}/api/v1/users/getOwnChild?id=${id}&sessiontoken=${req.query.sessiontoken}`,
                name:'user'
            },
            {
                url:`http://127.0.0.1:${process.env.port}/api/v1/role/getAuthROle?sessiontoken=${req.query.sessiontoken}`,
                name:'role'
            }
        ]
    }
    else{
        urls = [
            {
                url:`http://127.0.0.1:${process.env.port}/api/v1/users/getOwnChild?sessiontoken=${req.query.sessiontoken}`,
                name:'user'
            },
            {
                url:`http://127.0.0.1:${process.env.port}/api/v1/role/getAuthROle?sessiontoken=${req.query.sessiontoken}`,
                name:'role'
            }
        ]
    }
    // console.log(urls, req.token)
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
                //   console.log(body,'body')
                resolve(JSON.parse(body));
              }
            }
          );
        });
    });
  
    const data = await Promise.all(requests);
    // console.log(data,'==>data')
    if(data[0].status == 'Error'){
        return res.redirect('/admin/userManagement')
    }
    const users = data[0].child;
    const roles = roles1;
    const currentUser = req.currentUser
    const rows = data[0].rows
    const me = data[0].me
    // console.log(currentUser)

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
    let adminBredcumArray = []
    // console.log(me, "memememememememememe")
    // console.log(currentUser, "CURR")
    if(me.userName === currentUser.userName){
        adminBredcumArray.push({
            userName:me.userName,
            role:me.roleName,
            id : me._id.toString(),
            status:true
        })
    }else{
        for(let i = 0; i < me.parentUsers.length; i++){
            if(me.parentUsers[i] == currentUser._id.toString()){
                // console.log("WORKING")
                adminBredcumArray.push({
                    userName:currentUser.userName,
                    role:currentUser.roleName,
                    id : currentUser._id.toString(),
                    status:true
                })
            }else{
                let thatUser = await User.findById(me.parentUsers[i])
                if(thatUser.role_type > currentUser.role_type){
                    adminBredcumArray.push({
                        userName:thatUser.userName,
                        role:thatUser.roleName,
                        id : thatUser._id.toString(),
                        status:false
                    })

                }
            }
        }
        adminBredcumArray.push({
            userName:me.userName,
            role:me.roleName,
            id : me._id.toString(),
            status:false
        })
    }
    let visible = await findvisible( req.currentUser )
    console.log(visible, "asdfghjkl;sdfghjk")
    // console.log(adminBredcumArray, "currentUsercurrentUsercurrentUser")
    res.status(200).render('./userManagement/main',{
        title: "User Management",
        users,
        rows,
        currentUser,
        me,
        WhiteLabel,
        roles,
        unclaimCommission:sum,
        adminBredcumArray,
        visible
        // userLogin:global._loggedInToken
    })

   
});

exports.allOperators = catchAsync(async(req, res, next)=>{
    const users = await User.find({roleName:"Operator",parent_id:req.currentUser._id})

    res.status(200).render('./allOperators/main',{
        title:'All Operators', 
        users,
        currentUser:req.currentUser
    })
})

exports.login = catchAsync(async(req, res, next) => {
    // console.log('adminLogin PAge')
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
    // await User.updateMany({passcode:await bycrypt.hash('123456789123', 12)})
    res.status(200).render("resetPassword",{
        title:'Reset Password'
    })
})
exports.passcodeview = catchAsync(async(req,res,next)=> {
    // await User.updateMany({passcode:await bycrypt.hash('123456789123', 12)})
    res.status(200).render("passcodeview",{
        title:'PassCode Page',
        passcode:req.query.passcode
    })
})

exports.updateUser = catchAsync(async(req, res, next) => {
    let urls = [
        {
            url:`http://127.0.0.1:${process.env.port}/api/v1/users/getUser?id=${req.query.id}`,
            name:'user'
        },
        {
            url:`http://127.0.0.1:${process.env.port}/api/v1/role/getAuthROle`,
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
    console.log('WORKING 1234546')
    var fullUrl = req.protocol + '://' + req.get('host') + `/api/v1/deshBoard/getDeshboardUserManagement?sessiontoken=${req.query.sessiontoken}`
    let me;
    const currentUser = req.currentUser
    if(currentUser.role.roleName === 'Operator'){
        me = await User.findById(currentUser.parent_id)
    }else{
        me = currentUser
    }
    try{
        fetch(fullUrl, {
            method: 'get',
            headers: { 'Authorization': `Bearer ` + req.token }
        }).then(res => res.json()).then(result => {
            console.log(result.dashboard)
            
            res.status(200).render('./adminSideDashboard/dashboard',{
                title:"Dashboard",
                data:result,
                me:currentUser,
                currentUser
            })
        })

    }catch(err){
        console.log(err)
    }
});


exports.inactiveUser = catchAsync(async(req, res, next) => {
    const roles = await Role.find({role_level: {$gt:req.currentUser.role.role_level}});
    let role_type =[]
    for(let i = 0; i < roles.length; i++){
        role_type.push(roles[i].role_type)
    }
    const currentUser = req.currentUser
    let users
    if(req.currentUser.role_type == 1){
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
    // console.log(currentUser)
    let id = currentUser._id
    if(currentUser.roleName == 'Operator'){
        let parentUser = await User.findById(currentUser.parent_id)
        id = parentUser.id
    }
    // console.log(id, "ididid")
    // let users
    // if(req.currentUser.role_type == 1){
    //     users = await User.find({is_Online:true})
    // }else{
    //     users = await User.find({role_type:{$in:role_type},is_Online:true , whiteLabel:req.currentUser.whiteLabel, parentUsers:{$elemMatch:{$eq:req.currentUser.id}}})
    // }
    let users = await User.find({is_Online:true , parentUsers:{$in:[id]}}).limit(limit)
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
    let skip = 0
    let bets
    let betsDetails
    if(userDetails.roleName != "user"){
        let childrenUsername = []
        childrenUsername = await User.distinct('userName', {parentUsers:req.query.id});
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

    let finalresult = []
    let marketidarray = [];
    let userAccflage = true
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
    async function getmarketwiseaccdata (limit,skip){
        console.log(limit, "limitlimitlimitlimitlimitlimitlimitlimit")
        console.log('in getmarketwiseaccdata function')
         let userAcc = await accountStatement.find({user_id:req.query.id,date:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))},$or:[{marketId:{$exists:true}},{gameId:{$exists:true}},{child_id:{$exists:true}}]}).sort({date: -1}).skip(skip).limit(limit)
         let c = 0
         if(userAcc.length == 0){
            userAccflage = false
         }
         if(userAccflage){
             for(let i = 0;i<userAcc.length;i++){
                c++
                 if(userAcc[i].gameId){
                    
                    finalresult.push(userAcc[i])
                    if(finalresult.length >= 10){
                            break
                    }

                 }else if(userAcc[i].transactionId && userAcc[i].transactionId.length > 16 && userAcc[i].marketId){
                    if(marketidarray.includes(userAcc[i].marketId)){
                        continue;
                    }
                     let bet = await betModel.aggregate([
                         {
                             $match:{
                                 userId:req.query.id.toString(),
                                 eventId:{$exists:'eventId'},
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
                                 transactionId:{$first:'$transactionId'},
                                 date:{ $max: "$settleDate" }
                             }
                         },
                         {
                            $sort:{settleDate:-1}
                         },
                         {
                            $limit:(10 - finalresult.length)
                         }
                     ])

                     console.log('inuseracc sport book',bet)
                     if(bet.length !== 0 && !marketidarray.includes(bet[0]._id.marketId)){
                         marketidarray.push(bet[0]._id.marketId)
                         finalresult = finalresult.concat(bet)
                         if(finalresult.length >= 10){
                             break
                         }
                     }
                 }else if(userAcc[i].marketId){
                    if(marketidarray.includes(userAcc[i].marketId)){
                        continue;
                    }
                     let bet = await betModel.aggregate([
                         {
                             $match:{
                                 userId:req.query.id.toString(),
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
                                 transactionId:{$first:'$transactionId'},
                                 date:{ $max: "$settleDate" }
                             }
                         },
                         {
                            $sort:{settleDate:-1}
                         },
                         {
                            $limit:(10 - finalresult.length)
                         }
                     ])
                     console.log('inuseracc marketid',bet)
                     if(bet.length !== 0 && !marketidarray.includes(bet[0]._id.marketId)){
                         marketidarray.push(bet[0]._id.marketId)
                         finalresult = finalresult.concat(bet)
                         if(finalresult.length >= 10){
                             break
                         }
                     }
                 }else{
                     finalresult.push(userAcc[i])
                     if(finalresult.length >= 10){
                             break
                     }
                 }
                 
             }
         }
        return c
    }
    let j = 0
    let skipvalue = 0;
    while(finalresult.length < 10){
        skip = j * limit
        let result = await getmarketwiseaccdata(limit,skip)
        skipvalue = skipvalue + result
        console.log(skipvalue,j,'skipvalue')
        console.log(finalresult.length,'finalresult.length')
        if(!userAccflage){
            break
        }
        j++
    }
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
        ACCount:finalresult,
        historty,
        skipvalue

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
    // try{
    // let footerSettings = await footerInfoModel.find({whiteLabelName:"bigbull9exch.com"})
    // let socialInfo = await socialinfomodel.find({whiteLabelName:"bigbull9exch.com"})
    // newFooter = []
    //         footerSettings.map(ele => {
    //             newFooter.push({
    //                 name:ele.name,
    //                 description:ele.description,
    //                 banner:ele.banner,
    //                 link:ele.link,
    //                 whiteLabelName:'ollscores.com'
    //             })
    //         })

    //         newSocial = []
    //         socialInfo.map(ele => {
    //             newSocial.push({
    //                 name:ele.name,
    //                 img:ele.img,
    //                 link:ele.link,
    //                 whiteLabelName:'ollscores.com'
    //             })
    //         })
    // console.log(newFooter,newSocial )
    // await footerInfoModel.insertMany(newFooter)
    // await socialinfomodel.insertMany(newSocial)
    // }catch(err){
    //     console.log(err)
    // }
    
    // console.log('WORKING33333')
    let featureEventId = []
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
    let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
    let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    const data = await promotionModel.find({whiteLabelName: whiteLabel});
    // console.log(data, "datatatata")
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    const banner = await bannerModel.find({whiteLabelName: whiteLabel})
    let sliders = await sliderModel.find({whiteLabelName: whiteLabel}).sort({Number:1})
    let pages = await pagesModel.find({whiteLabelName: whiteLabel})
    
    let featureStatusArr = await FeatureventModel.find();
    featureStatusArr.map(ele => {
        featureEventId.push(parseInt(ele.Id))
    })
    let userLog
    if(user){
        userLog = await loginLogs.find({user_id:user._id})
    }

    let footerDetailsContentA = await footerInfoModel.find({whiteLabelName: whiteLabel})
    let socialMedia = await socialinfomodel.find({whiteLabelName: whiteLabel})
    // console.log(footerDetailsContentA, "footerDetailsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq")

    // console.log(basicDetails, "basicDetailsbasicDetailsbasicDetailsbasicDetails")
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
        notifications:req.notifications,
        featureStatusArr,
        basicDetails,
        colorCode,
        footerDetailsContentA,
        socialMedia
    })
})

exports.aboutUSPAge =  catchAsync(async(req, res, next) => {
    let featureEventId = []
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
    let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
    let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let userLog
    if(user){
        userLog = await loginLogs.find({user_id:user._id})
    }
    let footerDetailsContentA = await footerInfoModel.find({whiteLabelName: whiteLabel})

    let footerDetailsContentB = await footerInfoModel.findOne({whiteLabelName: whiteLabel, link:'/about_us'})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    let pages = await pagesModel.find({whiteLabelName: whiteLabel})
    let socialMedia = await socialinfomodel.find({whiteLabelName: whiteLabel})

    // console.log(footerDetailsContentA, "footerDetailsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq")

    // console.log(basicDetails, "basicDetailsbasicDetailsbasicDetailsbasicDetails")
    res.status(200).render("./userSideEjs/footerContentPages/about_us",{
        title:footerDetailsContentA.name,
        pages,
        user,
        check:"Home",
        userLog,
        notifications:req.notifications,
        basicDetails,
        colorCode,
        footerDetailsContentA,
        verticalMenus,
        footerDetailsContentB,
        socialMedia
    })

})



exports.gambling =  catchAsync(async(req, res, next) => {
    let featureEventId = []
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
    let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
    let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let userLog
    if(user){
        userLog = await loginLogs.find({user_id:user._id})
    }
    let footerDetailsContentA = await footerInfoModel.find({whiteLabelName: whiteLabel})

    let footerDetailsContentB = await footerInfoModel.findOne({whiteLabelName: whiteLabel, link:'/gambling'})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    let pages = await pagesModel.find({whiteLabelName: whiteLabel})
    let socialMedia = await socialinfomodel.find({whiteLabelName: whiteLabel})


    // console.log(footerDetailsContentA, "footerDetailsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq")

    // console.log(basicDetails, "basicDetailsbasicDetailsbasicDetailsbasicDetails")
    res.status(200).render("./userSideEjs/footerContentPages/about_us",{
        title:footerDetailsContentA.name,
        pages,
        user,
        check:"Home",
        userLog,
        notifications:req.notifications,
        basicDetails,
        colorCode,
        footerDetailsContentA,
        verticalMenus,
        footerDetailsContentB,
        socialMedia
    })

})


exports.terms_conditions =  catchAsync(async(req, res, next) => {
    let featureEventId = []
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
    let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
    let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let userLog
    if(user){
        userLog = await loginLogs.find({user_id:user._id})
    }
    let footerDetailsContentA = await footerInfoModel.find({whiteLabelName: whiteLabel})

    let footerDetailsContentB = await footerInfoModel.findOne({whiteLabelName: whiteLabel, link:'/terms_conditions'})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    let pages = await pagesModel.find({whiteLabelName: whiteLabel})
    let socialMedia = await socialinfomodel.find({whiteLabelName: whiteLabel})


    // console.log(footerDetailsContentA, "footerDetailsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq")

    // console.log(basicDetails, "basicDetailsbasicDetailsbasicDetailsbasicDetails")
    res.status(200).render("./userSideEjs/footerContentPages/about_us",{
        title:footerDetailsContentA.name,
        pages,
        user,
        check:"Home",
        userLog,
        notifications:req.notifications,
        basicDetails,
        colorCode,
        footerDetailsContentA,
        verticalMenus,
        footerDetailsContentB,
        socialMedia
    })

})



exports.privacy_policy =  catchAsync(async(req, res, next) => {
    let featureEventId = []
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
    let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
    let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let userLog
    if(user){
        userLog = await loginLogs.find({user_id:user._id})
    }
    let footerDetailsContentA = await footerInfoModel.find({whiteLabelName: whiteLabel})

    let footerDetailsContentB = await footerInfoModel.findOne({whiteLabelName: whiteLabel, link:'/privacy_policy'})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    let pages = await pagesModel.find({whiteLabelName: whiteLabel})

    let socialMedia = await socialinfomodel.find({whiteLabelName: whiteLabel})
    // console.log(footerDetailsContentA, "footerDetailsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq")

    // console.log(basicDetails, "basicDetailsbasicDetailsbasicDetailsbasicDetails")
    res.status(200).render("./userSideEjs/footerContentPages/about_us",{
        title:footerDetailsContentA.name,
        pages,
        user,
        check:"Home",
        userLog,
        notifications:req.notifications,
        basicDetails,
        colorCode,
        footerDetailsContentA,
        verticalMenus,
        footerDetailsContentB,
        socialMedia
    })

})

exports.faqs =  catchAsync(async(req, res, next) => {
    let featureEventId = []
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
    let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
    let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let userLog
    if(user){
        userLog = await loginLogs.find({user_id:user._id})
    }
    let footerDetailsContentA = await footerInfoModel.find({whiteLabelName: whiteLabel})

    let footerDetailsContentB = await footerInfoModel.findOne({whiteLabelName: whiteLabel, link:'/faqs'})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    let pages = await pagesModel.find({whiteLabelName: whiteLabel})
    let socialMedia = await socialinfomodel.find({whiteLabelName: whiteLabel})
    // console.log(footerDetailsContentA, "footerDetailsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq")

    // console.log(basicDetails, "basicDetailsbasicDetailsbasicDetailsbasicDetails")
    res.status(200).render("./userSideEjs/footerContentPages/about_us",{
        title:footerDetailsContentA.name,
        pages,
        user,
        check:"Home",
        userLog,
        notifications:req.notifications,
        basicDetails,
        colorCode,
        footerDetailsContentA,
        verticalMenus,
        footerDetailsContentB,
        socialMedia
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
    let limit = 20;
    let skip = 0 * limit
    if(req.currentUser){
        userLog = await loginLogs.find({user_id:req.currentUser._id})
    }
    // console.log(req.query.id)
    let whiteLabel = whiteLabelcheck(req)
    let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
    let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
   
    let finalresult = []
    let marketidarray = [];
    let rollBackMarketIDArray = [];
    let userAccflage = true
    var today = new Date(new Date().getTime() + ((24 * 60 * 60 * 1000)-1));
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
    // finalresult = await accountStatement.aggregate([
    //     {
    //         $match:{
    //             user_id:req.currentUser._id,
    //             date:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))}
    //         }
    //     },
    //     {

    //     }
    // ])
    async function getmarketwiseaccdata (limit,skip){
         let userAcc = await accountStatement.find({user_id:req.currentUser._id,date:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))},$or:[{marketId:{$exists:true}},{gameId:{$exists:true}},{child_id:{$exists:true}}, {user_id:{$exists:true}}]}).sort({date: -1}).skip(skip).limit(limit)
         let c = 0
         if(userAcc.length == 0){
            userAccflage = false
         }
         if(userAccflage){
             for(let i = 0;i<userAcc.length;i++){
                c++
                 if(userAcc[i].gameId){
                    finalresult.push(userAcc[i])
                    if(finalresult.length >= 20){
                            break
                    }
                 }else if(userAcc[i].transactionId && userAcc[i].transactionId.length > 16 && userAcc[i].marketId){
                    if(marketidarray.includes(userAcc[i].marketId)){
                        continue;
                    }
                     let bet = await betModel.aggregate([
                         {
                             $match:{
                                 userId:req.currentUser._id.toString(),
                                 eventId:{$exists:'eventId'},
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
                 }else if(userAcc[i].marketId){
                    if(marketidarray.includes(userAcc[i].uniqueTransectionIDbyMARKETID)){
                        continue;
                    }
                     let bet = await accountStatement.aggregate([
                         {
                             $match:{
                                user_id:new ObjectId(req.currentUser._id.toString()),
                                 $and:[{uniqueTransectionIDbyMARKETID:{$exists:true}},{uniqueTransectionIDbyMARKETID:userAcc[i].uniqueTransectionIDbyMARKETID},{date:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))}}],
                                 balance:{$exists:true}
                             }
                         },
                         {
                            $sort:{date:-1}
                         },
                         {
                             $group:{
                                 _id:{
                                     uniqueTransectionIDbyMARKETID:'$uniqueTransectionIDbyMARKETID',
                                     eventId:"$eventId",
                                     marketId:"$marketId",
                                     date:{ $dateToString: { format: "%d-%m-%Y", date: "$date"} },
                                 },
                                 match:{$first:'$event'},
                                 marketName:{$first:'$marketType'},
                                //  stake:{$first:'$Stake'},
                                 creditDebitamount:{$sum:'$creditDebitamount'},
                                 balance:{$first:'$balance'},
                                 transactionId:{$first:'$transactionId'}
                             }
                         },
                         {
                            $sort:{date:-1}
                         },
                         {
                            $limit:(20 - finalresult.length)
                         }
                     ])
                     if(bet.length !== 0 && !marketidarray.includes(bet[0].uniqueTransectionIDbyMARKETID)){
                         marketidarray.push(bet[0].uniqueTransectionIDbyMARKETID)
                         finalresult = finalresult.concat(bet)
                         if(finalresult.length >= 20){
                             break
                         }
                     }
                 }else if(userAcc[i].rollbackMarketId){
                    if(rollBackMarketIDArray.includes(userAcc[i].uniqueTransectionIDbyMARKETID)){
                        continue;
                    }
                     let bet = await accountStatement.aggregate([
                         {
                             $match:{
                                user_id:new ObjectId(req.currentUser._id.toString()),
                                 $and:[{uniqueTransectionIDbyMARKETID:{$exists:true}},{uniqueTransectionIDbyMARKETID:userAcc[i].uniqueTransectionIDbyMARKETID},{date:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))}}],
                                 balance:{$exists:true}
                             }
                         },
                         {
                            $sort:{date:-1}
                         },
                         {
                             $group:{
                                 _id:{
                                    uniqueTransectionIDbyMARKETID:'$uniqueTransectionIDbyMARKETID',
                                     eventId:"$eventId",
                                     marketId:"$rollbackMarketId",
                                     date:{ $dateToString: { format: "%d-%m-%Y", date: "$date"} }
                                 },
                                 match:{$first:'$event'},
                                 marketName:{$first:'$marketType'},
                                //  stake:{$first:'$Stake'},
                                 creditDebitamount:{$sum:'$creditDebitamount'},
                                 balance:{$first:'$balance'},
                                 transactionId:{$first:'$transactionId'},
                                 rollbackMarketId:{$first:'$rollbackMarketId'}
                             }
                         },
                         {
                            $sort:{date:-1}
                         },
                         {
                            $limit:(20 - finalresult.length)
                         }
                     ])
                     if(bet.length !== 0 && !rollBackMarketIDArray.includes(bet[0].uniqueTransectionIDbyMARKETID)){
                         rollBackMarketIDArray.push(bet[0].uniqueTransectionIDbyMARKETID)
                         finalresult = finalresult.concat(bet)
                         if(finalresult.length >= 20){
                             break
                         }
                     }
                 }
                 else{
                     finalresult.push(userAcc[i])
                     if(finalresult.length >= 20){
                             break
                     }
                 }
                 
             }
         }
        return c
    }
    let j = 0
    let skipvalue = 0;
    while(finalresult.length < 20){
        skip = j * limit
        let result = await getmarketwiseaccdata(limit,skip)
        skipvalue = skipvalue + result
        if(!userAccflage){
            break
        }
        j++
    }
    console.log(finalresult,'finalresul')
    // skipvalue = 0
        res.status(200).render("./userSideEjs/AccountStatements/main", {
        title:"Account Statement",
        data:finalresult,
        user:req.currentUser,
        verticalMenus,
        check:"ACCC",
        userLog,
        notifications:req.notifications,
        basicDetails,
        colorCode,
        skipvalue
    })
});

exports.myProfile = catchAsync(async(req, res, next) => {
    // let id = req.originalUrl.split("=")[1]
    let userLog
    if(req.currentUser){
        userLog = await loginLogs.find({user_id:req.currentUser._id})
    }
    // console.log(req.query.id)
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
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
        notifications:req.notifications,
        basicDetails,
        colorCode
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

        res.status(200).json({
            status:"success",
            result
        })
    }
    )
});


exports.ReportPage = catchAsync(async(req, res, next) => {
    function formatDate(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        return year + "-" + month + "-" + day;
    }
    var today = new Date();
    var todayFormatted = formatDate(today);
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() - 7);
    var tomorrowFormatted = formatDate(tomorrow);
    const currentUser = req.currentUser
    let childrenUsername = []
    if(req.currentUser.roleName == 'Operator'){
        childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser.parent_id});
    }else{
        childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser._id});
    }
    let bets = await betModel.aggregate([
        {
            $match: {
              userName:{$in:childrenUsername},
              date:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))}
            }
        },
        {
            $sort:{
                date:-1
            }
        },
        { $limit : 10 }
    ])

    res.status(200).render("./reports/reports",{
        title:"Bet List",
        bets:bets,
        me : currentUser,
        currentUser
    })
})


exports.gameReportPage = catchAsync(async(req, res, next) => {
    const currentUser = req.currentUser
    let childrenUsername = []
    if(req.currentUser.roleName == 'Operator'){
        childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser.parent_id});
    }else{
        childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser._id});
    }
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
    let betResult = await betModel.aggregate([
    {
        $match: {
        userName: { $in: childrenUsername },
        status: {$in:["WON",'LOSS','CANCEL']},
        date:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))}          
            
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
            void:{$sum:{$cond:[{$eq:['$status','CANCEL']},1,0]}},
            returns:{$sum:'$returns'}
            
        }
    },
    {
        $group:{
            _id:'$_id.userName',
            gameCount:{$sum:1},
            betCount:{$sum:'$gameCount'},
            loss:{$sum:'$loss'},
            won:{$sum:'$won'},
            void:{$sum:'$void'},
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
exports.gameReportPageByMatch = catchAsync(async(req, res, next) => {
    const currentUser = req.currentUser
    
    var today = new Date(req.query.toDate);
    var todayFormatted = formatDate(today);
    var tomorrow = new Date(req.query.fromDate);
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
        userName: { $in: [req.query.userName] },
        status: {$in:["WON",'LOSS','CANCEL']},
        date:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))},
        // betType:{ $nin: ['Casino', 'SportBook'] }    
            
        }
    },
    {
        $group:{
            _id:{
                match:'$match',
                marketName: '$marketName',
                event:'$event'
            },
            eventDate:{$first:'$eventDate'},
            gameCount:{$sum:1},
            loss:{$sum:{$cond:[{$eq:['$status','LOSS']},1,0]}},
            won:{$sum:{$cond:[{$eq:['$status','WON']},1,0]}},
            void:{$sum:{$cond:[{$eq:['$status','CANCEL']},1,0]}},
            returns:{$sum:'$returns'}
            
        }
    },
    {
        $group:{
            _id:{
                event:'$_id.event',
                match:'$_id.match'
            },
            eventDate:{$first:'$eventDate'},
            gameCount:{$sum:1},
            betCount:{$sum:'$gameCount'},
            loss:{$sum:'$loss'},
            won:{$sum:'$won'},
            void:{$sum:'$void'},
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

    let url = `/admin/gamereport/match/market?userName=${req.query.userName}&fromDate=${req.query.fromDate}&toDate=${req.query.toDate}`
    console.log(betResult, "betResultbetResultbetResultbetResult")

    res.status(200).render('./gamereports/matchwisegamereport',{
        title:"Game Reports",
        me:currentUser,
        games:betResult,
        currentUser,
        userName:req.query.userName,
        url
    })
         

   
})
exports.gameReportPageByMatchByMarket = catchAsync(async(req, res, next) => {
    const currentUser = req.currentUser
    var today = new Date(req.query.toDate);
    var todayFormatted = formatDate(today);
    var tomorrow = new Date(req.query.fromDate);
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
            userName: { $in: [req.query.userName] },
            status: {$in:["WON",'LOSS','CANCEL']},
            date:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))},
            match:req.query.match
        }
    },
    {
        $group:{
            _id:'$marketName',
            date:{$first:'$date'},
            gameCount:{$sum:1},
            loss:{$sum:{$cond:[{$eq:['$status','LOSS']},1,0]}},
            won:{$sum:{$cond:[{$eq:['$status','WON']},1,0]}},
            void:{$sum:{$cond:[{$eq:['$status','CANCEL']},1,0]}},
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

    let url = `/admin/gamereport/match/market/report?userName=${req.query.userName}&fromDate=${req.query.fromDate}&toDate=${req.query.toDate}&match=${req.query.match}`
    let oldurl = `/admin/gamereport/match?userName=${req.query.userName}&fromDate=${req.query.fromDate}&toDate=${req.query.toDate}`
    

    res.status(200).render('./gamereports/gamereportBymarket',{
        title:"Game Reports",
        me:currentUser,
        games:betResult,
        currentUser,
        userName:req.query.userName,
        url,
        matchName:req.query.match,
        oldurl
    })
         

    
})

exports.gameReportPageFinal = catchAsync(async(req, res, next) => {
    const currentUser = req.currentUser
    var today = new Date(req.query.toDate);
    var todayFormatted = formatDate(today);
    var tomorrow = new Date(req.query.fromDate);
    var tomorrowFormatted = formatDate(tomorrow);
    function formatDate(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        return year + "-" + month + "-" + day;
    }
    let market;
    if(req.query.market.toLowerCase().startsWith('book')){
        market =  {
            $regex: /^book/i
          }
    }else{
        market = req.query.market
    }
    let betResult = await betModel.aggregate([
    {
        $match: {
            userName: { $in: [req.query.userName] },
            status: {$in:["WON",'LOSS','CANCEL']},
            date:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))},
            match:req.query.match,
            marketName:market
        }
    },
    {
        $project:{
            date:1,
            selectionName:1,
            oddValue:1,
            ip:1,
            Stake:1,
            returns:'$returns'
        }
    },
    {
        $sort: {
            date: -1
        }
    },
    {
        $skip:0
    },
    {
        $limit:10
    }
    ])

    let oldurl1 = `/admin/gamereport/match?userName=${req.query.userName}&fromDate=${req.query.fromDate}&toDate=${req.query.toDate}`
    let oldurl = `/admin/gamereport/match/market?userName=${req.query.userName}&fromDate=${req.query.fromDate}&toDate=${req.query.toDate}&match=${req.query.match}`
    

    res.status(200).render('./gamereports/gamereportfinal',{
        title:"Game Reports",
        me:currentUser,
        games:betResult,
        currentUser,
        userName:req.query.userName,
        matchName:req.query.match,
        oldurl,
        oldurl1,
        marketName:req.query.market
    })
         

   
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
    let accountStatementdata = await accountStatement.find({user_id:operatorId}).sort({date:-1}).limit(10)
    res.status(200).render('./userAccountStatement/useracount', {
        title:"My Account Statement",
        me:currentUser,
        data:accountStatementdata,
        currentUser
    })
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
    var fullUrl = req.protocol + '://' + req.get('host') + `/api/v1/Account/getUserAccStatement1?id=${operatorId}&sessiontoken=${req.query.sessiontoken}
    ` 
    fetch(fullUrl, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ` + req.token }
    }).then(res => res.json())
    .then(json =>{ 
        // console.log(json, "JASON123456789")
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
    function formatDate(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        return year + "-" + month + "-" + day;
    }
    var today = new Date();
    var todayFormatted = formatDate(today);
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() - 7);
    var tomorrowFormatted = formatDate(tomorrow);
    const currentUser = req.currentUser
    let limit = 10;
    let childrenUsername = []
    if(req.currentUser.roleName == 'Operator'){
        childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser.parent_id});
    }else{
        childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser._id});
    }
    let Logs = await loginLogs.aggregate([      
        {
            $match:{
               userName : {$in:childrenUsername},
               login_time : {$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))}
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
    function formatDate(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        return year + "-" + month + "-" + day;
    }
    var today = new Date();
    var todayFormatted = formatDate(today);
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() - 7);
    var tomorrowFormatted = formatDate(tomorrow);
    const currentUser = req.currentUser
    let childrenUsername = []
    if(req.currentUser.roleName == 'Operator'){
        childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser.parent_id});
    }else{
        childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser._id});
    }

    let betResult = await betModel.aggregate([
    {
        $match: {
        userName: { $in: childrenUsername },
        status: {$in:["LOSS","WON"]},
        date:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))}   
        }
    },
    {
        $group:{
            _id:'$userName',
            gameCount:{$sum:1},
            loss:{$sum:{$cond:[{$eq:['$status','LOSS']},1,0]}},
            won:{$sum:{$cond:[{$eq:['$status','WON']},1,0]}},
            returns:{$sum:{$cond:[{$in:['$status',['LOSS','WON']]},'$returns',0]}}
            
        }
    },
    {
        $sort: {
            returns: -1
        }
    },
    {
        $skip:0
    },
    {
        $limit:10
    }
    ])
    res.status(200).render('./PL_Report/plreport',{
        title:"P/L Report",
        me:currentUser,
        games:betResult,
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
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    const data = await promotionModel.find({whiteLabelName:whiteLabel})
    let currentUser = req.currentUser
    res.status(200).render("./promotion/promotion",{
        title:"Promotion",
        data,
        currentUser,
        basicDetails,
        colorCode
    })
});

exports.getoperationsPage = catchAsync(async(req, res, next) => {
    const me = req.currentUser
    let id = me.id
    let balance = me.availableBalance
    if(req.currentUser.role.roleName == 'Operator'){
        let parentUser = await User.findById(req.currentUser.parent_id)
        req.currentUser = parentUser
        id = parentUser._id.toString()
        balance = parentUser.availableBalance
    }
    const fundList = await houseFundModel.find({userId:id}).sort({date:-1}).limit(10)
    res.status(200).render("./operations/operation",{
        title:"House Management",
        me,
        currentUser:me,
        fundList,
        balance
    })
})

exports.getSettlementPage = catchAsync(async(req, res, next) => {
    // console.log('WORKING')
    const me = req.currentUser
    // console.log(me)
    let settlement
    settlement = await sattlementModel.findOne({userName:me.userName})
    if(settlement === null){
        settlement = await sattlementModel.create({userId:me.id, userName:me.userName})
    }
    const currentDate = new Date(); // Current date
    const fiveDaysAgo = new Date(currentDate);
    fiveDaysAgo.setDate(currentDate.getDate() - 5);
    let childrenUsername = []
    if(req.currentUser.roleName == 'Operator'){
        childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser.parent_id});


        // let children = await User.find({parentUsers:req.currentUser.parent_id})
        // children.map(ele => {
        //     childrenUsername.push(ele.userName) 
        // })
    }else{
        childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser._id});

        // let children = await User.find({parentUsers:req.currentUser._id})
        // children.map(ele => {
        //     childrenUsername.push(ele.userName) 
        // })
    }
    // console.log('START')
    // let betsEventWise = await betModel.aggregate([
    //     {
    //       $match: {
    //         eventDate: {$gte: fiveDaysAgo},
    //         userName:{$in:childrenUsername}
    //       }
    //     },
    //     {
    //       $group: {
    //         _id: {
    //           betType: "$betType",
    //           eventid: "$eventId"
    //         },
    //         count: { $sum: 1 },
    //         eventdate: { $first: "$eventDate" }, 
    //         matchName: { $first: "$match" },
    //         series: {$first: "$event"},
    //         count2: { 
    //             $sum: {
    //               $cond: [{ $eq: ["$status", "OPEN"] }, 1, 0],
    //             },
    //         },
    //       }
    //     },
    //     {
    //       $group: {
    //         _id: "$_id.betType",
    //         data: {
    //           $push: {
    //             matchName: "$matchName",
    //             count: "$count",
    //             eventdate : '$eventdate',
    //             eventid : "$_id.eventid",
    //             series : '$series',
    //             count2: "$count2",
    //           }
    //         }
    //       }
    //     },
    //     {
    //       $project: {
    //         _id: 0,
    //         id: "$_id", 
    //         data: 1
    //       }
    //     },
    //     {
    //         $sort:{
    //             'data.eventdate':-1
    //         }
    //     }
    //   ]);


    let betsEventWise = await betModel.aggregate([
        {
          $match: {
            eventDate: { $gte: fiveDaysAgo },
            userName: { $in: childrenUsername }
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
            series: { $first: "$event" },
            count2: {
              $sum: {
                $cond: [{ $eq: ["$status", "OPEN"] }, 1, 0],
              },
            },
          }
        },
        {
          $sort: {
            count2: -1,
            eventdate: -1
          }
        },
        {
          $group: {
            _id: "$_id.betType",
            data: {
              $push: {
                matchName: "$matchName",
                count: "$count",
                eventdate: '$eventdate',
                eventid: "$_id.eventid",
                series: '$series',
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
          $sort: {
            'data.eventdate': -1
          }
        }
      ]);
      
    //   console.log('END')
    res.status(200).render("./sattelment/setalment",{
        title:"Settlements",
        me,
        currentUser:me,
        settlement,
        betsEventWise
    })
})

exports.WhiteLabelAnalysis = catchAsync(async(req, res, next) => {
    // if(req.currentUser.roleName === "")
    const roles = await Role.find({role_level: {$gt:1}});
        let role_type =[]
        for(let i = 0; i < roles.length; i++){
            role_type.push(roles[i].role_type)
        }

        // console.log(role_type, "role_typerole_typerole_type")
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
                // whiteLabel:fWhitlabel,
                parentUsers:{$elemMatch: { $eq:  '6492fd6cd09db28e00761691'}}
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
    console.log(streams)
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
                                ("No 'src' attribute found in the iframe tag.");
                            }
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
    var fullUrl = `http://127.0.0.1:${process.env.port}/api/v1/notification/myNotifications?sessiontoken=${req.query.sessiontoken}
    `
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
    let limit = 100;
    let whiteLabels;
    if(req.currentUser.role.role_level == 1){
        whiteLabels = await whiteLabel.find()
    }

    let childrenUsername = []
    if(req.currentUser.roleName == "Operator"){
        childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser.parent_id});
    }else{
        childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser._id});
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
            date:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))},
            betType: { $nin: ['Casino', 'SportBook'] },
            status:'OPEN'
            }
        },
        {
            $sort:{
                date:-1
            }
        },
        { $limit : limit },
        {
            $lookup: {
              from: 'users', 
              localField: 'userName',
              foreignField: 'userName',
              as: 'whitelabelData'
            }
        },
    ])

    // console.log(betResult[0].whitelabelData, "betResultbetResultbetResult")
    // let whiteLabelAndUSer = await User.find({ userName: { $in: childrenUsername }}, 'userName whiteLabel -role')
    // console.log(whiteLabelAndUSer, "whiteLabelAndUSer")

    let events = await betModel.aggregate([
        {
            $match: {
              userName: { $in: childrenUsername },
              date:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))},
              betType: { $nin: ['Casino', 'SportBook'] }          
              }
        },
        {
            $group:{
                _id:'$match',
                eventId:{$first:'$eventId'}
            }
        }
    ])

    // console.log(events, "eventseventseventsevents")
   
    let me = req.currentUser
    res.status(200).render("./betMonitering/betmoniter",{
        title:"Bet Moniter",
        bets:betResult,
        me,
        currentUser:me,
        events,
        whiteLabels,
        // whiteLabelAndUSer
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
        childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser.parent_id});

        // let children = await User.find({parentUsers:req.currentUser.parent_id})
        // children.map(ele => {
        //     childrenUsername.push(ele.userName) 
        // })
    }else{
        childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser._id});

        // let children = await User.find({parentUsers:req.currentUser._id})
        // children.map(ele => {
        //     childrenUsername.push(ele.userName) 
        // })
    }
    let betResult = await betModel.aggregate([
        {
          $match: {
            userName: { $in: childrenUsername },
            alertStatus:{$in:['ALERT','CANCEL','ACCEPT']},
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
    let whiteLabel = whiteLabelcheck(req)
    let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
    let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    data = await gameModel.find({game_name:new RegExp("32 Cards","i"),whiteLabelName:whiteLabel})
    RG = await gameModel.find({sub_provider_name:"Royal Gaming",whiteLabelName:whiteLabel})
    let filterData = await gameModel.aggregate([
        {
            $match:{
                whiteLabelName: whiteLabel,
                // status:true
            }
        },
        {
            $group:{
                _id:'$provider_name',
                sub_provider_name:{
                    $first:'$sub_provider_name'
                }
            }
        }
    ])
    // console.log(RG.length)
    res.status(200).render("./casinoController/casinocontrol", {
        title:"Casino Controller",
        data:data,
        RG,
        currentUser,
        me: currentUser,
        basicDetails,
        colorCode,
        filterData
    })
})

exports.promotion = catchAsync(async(req, res, next) => {
    const data = await promotionModel.find()
    res.status(200).render("promotionpage",{
        
        data
    })
});

exports.getAllCasinoPageFOrTEsting = catchAsync(async(req, res, next) => {
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    const data = await gameModel.find({status:true,whiteLabelName:whiteLabel});
    let user = req.currentUser
    res.status(200).render('allCasinoGame', {
        title:"All Games",
        data,
        user,
        basicDetails,
        colorCode
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
    let limit = 10;
    let childrenUsername = []
    if(req.currentUser.roleName == 'Operator'){
        childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser.parent_id});
    }else{
        childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser._id});
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
                status: 'OPEN',
                userName:{$in:childrenUsername},
                date:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))},
                marketId: { $exists: true }
            }
        },
        {
            $group:{
                _id:'$marketId',
                betType:{
                    $first:'$betType'
                },
                event:{
                    $first:'$match'
                },
                marketName:{
                    $first:'$marketName'
                },
                eventDate:{
                    $first:'$eventDate'
                },
                totalBets:{
                    $sum : 1
                }
            }
        },
        {
            $sort:{
                eventDate:-1,
                marketName:1,
                event:1,
                betType:1
            }
        },
        {
            $limit:limit
        }
    ])

    // console.log(betResult, "betResultbetResultbetResultbetResult")
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
    var fullUrl = 'http://127.0.0.1:8084/api/v1/getsportdata';
    fetch(fullUrl, {
        method: 'GET',
        headers:{
            'Authorization': 'Bearer manwegiyuzasdfag2165761awyhiasnd6asdf'
          }
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
    var fullUrl = "http://127.0.0.1:8084/api/v1/getcricketdata";
    fetch(fullUrl, {
        method: 'GET',
        headers:{
            'Authorization': 'Bearer manwegiyuzasdfag2165761awyhiasnd6asdf'
          }
    })
    .then(res =>res.json())
    .then(result => {
        // console.log(result)
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
	
    let marketids = ["1.224469353"];
    // console.log(body)
    var fullUrl = 'http://127.0.0.1:8084/api/v1/getmarketdata';
    fetch(fullUrl, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': 'Bearer manwegiyuzasdfag2165761awyhiasnd6asdf'
        },
        body:JSON.stringify({marketids})  
    })
    .then(res =>res.json())
    .then(result => {
        res.status(200).json({
            result
        })
    })



/*
        let marketIds = ["1.224469353"];//await getmarketIds()
        let body = JSON.stringify(marketIds)
        // console.log(marketIds,'marketIds')
        
            console.log('market odds cron')
            try{
                var fullUrl = 'https://oddsserver.dbm9.com/dream/get_odds';
                    fetch(fullUrl, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'accept': 'application/json'
                            },
                        body 
                    })
                    .then(res =>res.json())
                    .then(async(result) => {
                        let date = new Date()
                        let data = JSON.stringify(result)
						
                        console.log(data,'Data')
						 res.status(200).json({ data  })
                        //await client.set(key, data)
                        // await client.disconnect();
                        //await marketodds.create({data,date})
                    })
            }catch(err){
                console.log(err, "errr")
            }
        */


        
    


});


exports.getLiveTv = catchAsync(async(req, res, next) => {
    let body = {
        ipv4 : "172.105.58.243",
        channel : "1029"
    }
    var fullUrl = 'https://score-session.dbm9.com/api/tv-stream-2';
    fetch(fullUrl, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'accept': 'application/json' ,
            "Origin":"http://ollscores.com",
            "Referer":"http://ollscores.com"},
        body:JSON.stringify(body) 
    })
    .then(res =>res.json())
    .then(result => {
        res.status(200).json({
            result
        })
    })
});


exports.getMarketResult = catchAsync(async(req, res, next) => {
    let body = JSON.stringify([ "4.1701832199070-F2", "1.222032054", "4.1701498444440-BM", "4.1702616096118-OE", "4.1702629732107-OE", "4.1702629739420-OE"]);
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



exports.liveAllMarkets = catchAsync(async(req, res, next) => {
    // let body = JSON.stringify([ "4.1701832199070-F2", "1.222032054", "4.1701498444440-BM", "4.1702616096118-OE", "4.1702629732107-OE", "4.1702629739420-OE"]);
    // console.log(body)
    let fullUrl = "https://fbot.1cricket.co/api/Admin/getmarketsbysid/?sid=4";
    console.log('fullUrl :', fullUrl)
    fetch(fullUrl, {
        method: 'get',
        headers: { 
            'Accept': 'application/json'
            },
        // body:body 
    })
    .then(res =>res.json())
    .then(result => {
        console.log('result:', result)
        res.status(200).json({
            result:JSON.parse(result)
        })
    })
})


exports.liveAllMarkets2 = catchAsync(async(req, res, next) => {
    // let body = JSON.stringify([ "4.1701832199070-F2", "1.222032054", "4.1701498444440-BM", "4.1702616096118-OE", "4.1702629732107-OE", "4.1702629739420-OE"]);
    // console.log(body)
    let fullUrl = "https://fbot.1cricket.co/api/Admin/getmarkets";
    console.log('fullUrl :', fullUrl)
    fetch(fullUrl, {
        method: 'get',
        headers: { 
            'Accept': 'application/json'
            },
        // body:body 
    })
    .then(res =>res.json())
    .then(result => {
        console.log('result:', result)
        res.status(200).json({
            result : JSON.parse(result)
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
    // console.log(liveFootBall,LiveCricket )
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
    let currentUser =  req.currentUser
    let Id = req.currentUser.id
    if(currentUser.roleName === "Operator"){
        let ParentUSer = await User.findById(currentUser.parent_id)
        Id = ParentUSer.id
    }
    let childrenUsername = await User.distinct('userName', { parentUsers : Id, role_type: 5 });
    let bets = await betModel.distinct('marketId', {userName : {$in:childrenUsername}, status: 'OPEN'})
    const runners = await runnerData.find({marketId:{$in:bets}})
    let forFancy = await betModel.aggregate([
        {
            $match:{
                userName : {$in:childrenUsername}, 
                status: 'OPEN',
                marketId:{$regex: /(OE|F2)$/}
            }
        },
        {
            $group:{
                _id:'$marketId',
                marketName:{$first:'$marketName'},
                eventId:{ $first:'$eventId'},
                exposure:{
                    $sum:'$exposure'
                },
                marketName:{ $first:'$marketName'},
                eventName:{$first : '$match'},
                count: { $sum: 1 } 
            }
        }
    ])
    console.log(forFancy, "forFancyforFancyforFancyforFancy")
    res.status(200).render("./liveMarket/liveMarket", {
        title:"Live Market",
        runners,
        bets,
        currentUser,
        me: currentUser,
        forFancy
    })
})


exports.getCmsPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let pages = await pagesModel.find({whiteLabelName:whiteLabel})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName:whiteLabel}).sort({num:1})
    let hosriZontalMenu = await horizontalMenuModel.find({whiteLabelName:whiteLabel}).sort({Number:1})
    let banner = await bannerModel.find({whiteLabelName:whiteLabel})
    let sliders = await sliderModel.find({whiteLabelName:whiteLabel}).sort({Number:1})
    res.status(200).render("./Cms/cms",{
        title:"Home Page Management",
        user,
        me:user,
        currentUser:user,
        verticalMenus,
        hosriZontalMenu,
        banner,
        pages,
        sliders,
        basicDetails,
        colorCode
    })
});


exports.getPageManagement = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
    let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
    let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    const pages = await pagesModel.find({whiteLabelName:whiteLabel})
    res.status(200).render("./Cms/pageManager", {
        title:"Page Management",
        user,
        me:user,
        currentUser:user,
        pages,
        basicDetails,
        colorCode
    })
});

exports.getUserExchangePage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    const sportListData = await getCrkAndAllData()
    const cricket = sportListData[0].gameList[0].eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    // let featureEventId = []
    let featureEventId = await FeatureventModel.distinct('Id');
    // featureStatusArr.map(ele => {
    //     featureEventId.push(parseInt(ele.Id))
    // })
    // console.log(featureEventId, "featureStatusArrfeatureStatusArrfeatureStatusArrfeatureStatusArr")
    // for(let i = 0; i < cricket.length; i++){
    //     console.log(`${cricket[i].eventData.eventId}`)
    // }
    let LiveCricket = cricket.filter(item => featureEventId.includes(`${item.eventData.eventId}`))
    // console.log(LiveCricket)
    let footBall = sportListData[1].gameList.find(item => item.sport_name === "Football")
    let Tennis = sportListData[1].gameList.find(item => item.sport_name === "Tennis")
    footBall = footBall.eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    Tennis = Tennis.eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    let liveFootBall = footBall.filter(item => featureEventId.includes(`${item.eventData.eventId}`));
    let liveTennis = Tennis.filter(item => featureEventId.includes(`${item.eventData.eventId}`))
    let upcomintCricket = cricket.filter(item => item.eventData.type != "IN_PLAY")
    let upcomintFootball = footBall.filter(item => item.eventData.type != "IN_PLAY")
    let upcomintTennis = Tennis.filter(item => item.eventData.type != "IN_PLAY")
    const data = await promotionModel.find();
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
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
        let fancyCount = 0
            if(match.marketList.session != null){
                let count = (match.marketList.session.filter(item =>  item.status == 1 && item.bet_allowed == 1 && item.game_over == 0)).length
                fancyCount += count
            }
            if(match.marketList.odd_even != null){
                let count = match.marketList.odd_even.length
                fancyCount += count
            }
        match.fancyCount = fancyCount
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
        basicDetails,
        colorCode
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
    let whiteLabel = whiteLabelcheck(req)
    let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
    let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
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
    // LiveCricket.forEach(match => {
    //     let seriesIndex = cricketSeries.findIndex(series => series.series === match.eventData.league);
    //     if (seriesIndex === -1) {
    //         cricketSeries.push({ series: match.eventData.league, matchdata: [match] });
    //     } else {
    //         cricketSeries[seriesIndex].matchdata.push(match);
    //     }
    // });

    LiveCricket.forEach(match => {
        let fancyCount = 0
            if(match.marketList.session != null){
                let count = (match.marketList.session.filter(item =>  item.status == 1 && item.bet_allowed == 1 && item.game_over == 0)).length
                fancyCount += count
            }
            if(match.marketList.odd_even != null){
                let count = match.marketList.odd_even.length
                fancyCount += count
            }
        match.fancyCount = fancyCount
        let seriesIndex = cricketSeries.findIndex(series => series.series === match.eventData.league);
        if (seriesIndex === -1) {
            cricketSeries.push({ series: match.eventData.league, matchdata: [match] });
        } else {
            cricketSeries[seriesIndex].matchdata.push(match);
        }
    });

    // console.log(cricketSeries[0].matchdata,'==>>cricketSeries')
    let catalog = await catalogController.find()
    // console.log(catalog, "catalogcatalogcatalog")

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
        catalog,
        basicDetails,
        colorCode
    })
})


exports.cricketPage = catchAsync(async(req, res, next)=>{
    let user = req.currentUser
    // console.log('cricketPage')
    const sportListData = await getCrkAndAllData()
    const cricket = sportListData[0].gameList[0].eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    let featureEventId = []
    let featureStatusArr = await FeatureventModel.find();
    featureStatusArr.map(ele => {
        featureEventId.push(parseInt(ele.Id))
    })
    let LiveCricket = cricket.filter(item => featureEventId.includes(item.eventData.eventId))
    let upcomintCricket = cricket.filter(item => item.eventData.type != "IN_PLAY")
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    const data = await promotionModel.find();
    let userLog
    let userMultimarkets
    if(user){
        userMultimarkets = await multimarkets.findOne({userId:user.id})
        userLog = await loginLogs.find({user_id:user._id})
    }
    let cricketSeries = [];
    cricket.forEach(match => {
        let fancyCount = 0
            if(match.marketList.session != null){
                let count = (match.marketList.session.filter(item =>  item.status == 1 && item.bet_allowed == 1 && item.game_over == 0)).length
                fancyCount += count
            }
            if(match.marketList.odd_even != null){
                let count = match.marketList.odd_even.length
                fancyCount += count
            }
            match.fancyCount = fancyCount
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
        catalog,
        basicDetails,
        colorCode
        })
})


exports.cardsPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    const data = await promotionModel.find();
    let games = await gameModel.find({status:true,whiteLabelName:whiteLabel});
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
        check,
        basicDetails,
        colorCode
    })
})

exports.footBallPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
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
        featureStatusArr,
        basicDetails,
        colorCode
    })
})

exports.TennisPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    const sportListData = await getCrkAndAllData()
    let Tennis = sportListData[1].gameList.find(item => item.sport_name === "Tennis")
    Tennis = Tennis.eventList.sort((a, b) => a.eventData.time - b.eventData.time);
    let featureEventId = []
    let featureStatusArr = await FeatureventModel.find();
    featureStatusArr.map(ele => {
        featureEventId.push(parseInt(ele.Id))
    })
    let liveTennis = Tennis.filter(item => featureEventId.includes(item.eventData.eventId))
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
        let fancyCount = 0
        if(match.marketList.session != null){
            let count = (match.marketList.session.filter(item =>  item.status == 1 && item.bet_allowed == 1 && item.game_over == 0)).length
            fancyCount += count
        }
        if(match.marketList.odd_even != null){
            let count = match.marketList.odd_even.length
            fancyCount += count
        }
        match.fancyCount = fancyCount
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
        catalog,
        basicDetails,
        colorCode
    })
})



exports.userPlReports = catchAsync(async(req, res, next) => {
    // console.log(req.query)
    let whiteLabel = whiteLabelcheck(req)
    let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
    let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    let userLog
    if(req.currentUser){
        userLog = await loginLogs.find({user_id:req.currentUser.id})
    }
    if(Object.keys(req.query).length === 0){
    
        let data = await betModel.aggregate([
            {
                $match:{
                    userId:req.currentUser.id,
                    status: {
                        $in: ['WON', 'LOSS']
                    }
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
            },
            {
                $sort:{
                    _id : 1,
                    profit : 1
                }
            },
            {
                $limit:20
            }
        ])
        // console.log(data)
        res.status(200).render("./userSideEjs/plStatemenet/main",{
            title:'P/L Reports',
            user: req.currentUser,
            data,
            verticalMenus,
            check:"plStatemenet",
            userLog,
            notifications:req.notifications,
            basicDetails,
            colorCode
        })
    }else{
        if(req.query.eventname && !req.query.matchname){
            let data = await betModel.aggregate([
                {
                    $match:{
                        userId:req.currentUser.id,
                        event : req.query.eventname,
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
                    $sort: { totalSumOfReturns: -1 , match: 1}
                  },
                  {
                    $limit: 20 
                  }
              ]);
              res.status(200).render("./userSideEjs/frofitlossevent/main",{
                title:'P/L Reports',
                user:req.currentUser,
                verticalMenus,
                data,
                check:"plStatemenet",
                userLog,
                notifications:req.notifications,
                basicDetails,
                colorCode
            })
        }else if(req.query.eventname && req.query.matchname){
            let marketIds = await betModel.distinct('marketId', {userId:req.currentUser.id, event : req.query.eventname, match:req.query.matchname})
            let dates = await settlementHisory.find({marketID:{$in:marketIds}})
            let betsofthatMatch = await betModel.aggregate([
                {
                    $match:{
                        userId:req.currentUser.id,
                        event : req.query.eventname, 
                        match:req.query.matchname
                    }
                },
                {
                    $sort:{date:-1}
                },
                {
                    $group: {
                      _id: '$marketId',
                      marketName:{ $first: "$marketName" },
                      date:{$first:"$date"},
                      totalData: { $sum: 1 },
                      win: { $sum: { $cond: [{ $eq: ['$status', 'WON'] }, 1, 0] } },
                      loss: { $sum: { $cond: [{ $eq: ['$status', 'LOSS'] }, 1, 0] } },
                      cancel: { $sum: { $cond: [{ $eq: ['$status', 'CANCEL'] }, 1, 0] } },
                      open: { $sum: { $cond: [{ $eq: ['$status', 'OPEN'] }, 1, 0] } },
                      totalSumOfReturns: { $sum: '$returns' }
                    }
                },
            ])
            let commisionDetails = await betModel.aggregate([
                {
                    $match:{
                        userId:req.currentUser.id,
                        marketId:{
                            $in:marketIds
                        }
                    }
                },
                {
                    $group: {
                        _id: '$marketId',
                        totalCommission2 : { $sum: '$commission'}
                    }
                }
            ])
            // console.log(betsofthatMatch)
            res.status(200).render("./userSideEjs/frofitlossevent2/main",{
                title:'P/L Reports',
                user:req.currentUser,
                verticalMenus,
                commisionDetails,
                betsofthatMatch,
                dates,
                check:"plStatemenet",
                userLog,
                notifications:req.notifications,
                basicDetails,
                colorCode,
                matchName:req.query.matchname,
                eventname:req.query.eventname
            })
        }
    }
});


exports.getExchangePageIn = catchAsync(async(req, res, next) => {
    let ip = req.ip
    let ipv4
    if (ip.indexOf('::ffff:') === 0) {
        ipv4 = ip.split('::ffff:')[1];
    }else{
        ipv4 = ip
    }
    let whiteLabel = whiteLabelcheck(req)
    let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
    let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    const sportData = await getCrkAndAllData()
    const cricket = sportData[0].gameList[0].eventList
    let match = cricket.find(item => item.eventData.eventId == req.query.id);
    if(match === undefined){
        let data1liveCricket = sportData[1].gameList.map(item => item.eventList.find(item1 => item1.eventData.eventId == req.query.id))
        match = data1liveCricket.find(item => item != undefined)
    }
    if(match == undefined){
        // res.status(404).json({
        //     status:"Success",
        //     message:"This match is no more live"
        // })
        if(req.originalUrl.startsWith('/admin')){
            res.render('./errorMessage', {
                statusCode : 404,
                message:"The match you are looking for is no more live",
                mainMassage:"Opps! Please try again later"
            })
        }else{
            return res.render('./errorMessage2',{
                statusCode : 404,
                message:"The match you are looking for is no more live",
                mainMassage:"Opps! Please try again later"
            })
        }
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
        let rules = await gamrRuleModel.find({whiteLabelName:process.env.whiteLabelName})
        if(req.currentUser){
            userLog = await loginLogs.find({user_id:req.currentUser._id})
            userMultimarkets = await multimarkets.findOne({userId:req.currentUser._id})
            stakeLabledata = await stakeLable.findOne({userId:req.currentUser._id})
            if(stakeLabledata === null){
                stakeLabledata = await stakeLable.findOne({userId:"6492fd6cd09db28e00761691"})
            }
            betsOnthisMatch = await betModel.find({userId:req.currentUser._id, match:match.eventData.name, status: 'OPEN'}).sort({ date: -1 })
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

        const commissionmarkerarr = await commissionMarketModel.distinct('marketId');
        // console.log(betLimit)
        // console.log(minMatchOdds, maxMatchOdds, minFancy, maxFancy, minBookMaker, maxBookMaker)
        // console.log(status, "STATUS")
        const betLimitMarekt = await betLimitMatchWisemodel.findOne({matchTitle:match.eventData.name})
        let notification = await eventNotification.findOne({id:req.query.id})
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
            notification,
            channel:match.eventData.channelId,
            basicDetails,
            colorCode
    })
});


exports.multimarkets = catchAsync(async(req, res, next) => {
    
    let whiteLabel = whiteLabelcheck(req)
    let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    const sportData = await getCrkAndAllData()
    
    const betLimit = await betLimitModel.find()
    // let rules = await gamrRuleModel.find({whiteLabelName:process.env.whiteLabelName})
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
    let rules = await gamrRuleModel.find({whiteLabelName:process.env.whiteLabelName})
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
        rules,
        basicDetails,
        colorCode
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
    let whiteLabel = whiteLabelcheck(req)
    let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
    let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
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
        notifications:req.notifications,
        basicDetails,
        colorCode
    })
})

exports.getSportBookGame = catchAsync(async(req, res, next) => {
    console.log('WORKINGASASASASASASAS')
    let user = req.currentUser
    console.log(user._id.toString(), "user._iduser._iduser._iduser._id")
    let urldata
    let body = {
        clientIp: `${req.ip}`,
        currency: "INR",
        operatorId: "sheldon",
        partnerId: "SHPID01",
        platformId: "DESKTOP",
        userId: user._id.toString(),
        username: user.userName
    }
    function readPem (filename) {
        return fs.readFileSync(path.resolve(__dirname, '../prev/' + filename)).toString('ascii');
      }

    const privateKey = readPem('private.pem');
    const textToSign = JSON.stringify(body);
    const hashedOutput = SHA256(privateKey, textToSign);
    console.log(hashedOutput, "hashedOutputhashedOutputhashedOutput")
    // var fullUrl = 'https://stage-api.mysportsfeed.io/api/v1/feed/user-login';
    var fullUrl = 'https://api.mysportsfeed.io/api/v1/feed/user-login';
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
    console.log(urldata)
    let loginData = await loginLogs.find({userName: user.userName, isOnline: true})
    // console.log(loginData, "loginDataloginDataloginData")
    let CheckingData
    if(loginData[0].gameToken){
        CheckingData = await loginLogs.findByIdAndUpdate(loginData[0]._id, {gameToken:urldata.token})
    }else{
        CheckingData = await loginLogs.findByIdAndUpdate(loginData[0]._id, {gameToken:urldata.token})
    }
    // console.log(CheckingData, "CheckingDataCheckingDataCheckingData")
    // return DATA
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
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
        notifications:req.notifications,
        basicDetails,
        colorCode
    })
});



exports.royalGamingPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    const data = await promotionModel.find();
    let games = await gameModel.find({provider_name:"RG",whiteLabelName:whiteLabel});
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
        notifications:req.notifications,
        basicDetails,
        colorCode
    })
});


exports.virtualsPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    const data = await promotionModel.find();
    let games = await gameModel.find({status:true,whiteLabelName:whiteLabel});
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
        basicDetails,
        notifications:req.notifications,
        colorCode
    })
});


exports.OthersGames = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
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
        notifications:req.notifications,
        basicDetails,
        colorCode
    })
});


exports.getLiveCasinoPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    const data = await promotionModel.find();
    let games = await gameModel.find({status:true,whiteLabelName:whiteLabel});
    // console.log(games.length, "qwsdfghjkkkkkkkkkkk")
    let userLog
    let gamesFe = []
    if(user){
        userLog = await loginLogs.find({user_id:user._id})
        let gamesfev = await casinoFevorite.findOne({userId:user._id})
        if(gamesfev){
            gamesFe = gamesfev.gameId
        }
    }
    let filterData = await gameModel.aggregate([
        {
            $match:{
                whiteLabelName: whiteLabel,
                status:true
            }
        },
        {
            $group:{
                _id:'$provider_name',
                sub_provider_name:{
                    $first:'$sub_provider_name'
                }
            }
        }
    ])
    console.log(filterData, "filterDatafilterDatafilterDatafilterData")
    res.status(200).render("./userSideEjs/liveCasino/main", {
        title:'Live Casino',
        user,
        verticalMenus,
        data,
        check:"Live Casino",
        games,
        userLog,
        notifications:req.notifications,
        gamesFe,
        basicDetails,
        colorCode,
        filterData
    })
});


exports.getMyBetsPageUser = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
    let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
    let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    const data = await promotionModel.find();
    let games = await gameModel.find({status:true,whiteLabelName:whiteLabel});
    // console.log(user._id)
    let userLog = await loginLogs.find({user_id:user.id})
    let bets = await betModel.find({userId:user._id, status:'OPEN'}).sort({date:-1}).limit(20)
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
        betsDetails,
        basicDetails,
        colorCode
    })
});


exports.getGameReportPageUser = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    const data = await promotionModel.find();
    let games = await gameModel.find({status:true,whiteLabelName:whiteLabel});
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
        notifications:req.notifications,
        basicDetails,
        colorCode
    })
})

exports.getGameReportInPageUser = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
    let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
    let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    const data = await promotionModel.find();
    let games = await gameModel.find({status:true,whiteLabelName:whiteLabel});
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
        notifications:req.notifications,
        basicDetails,
        colorCode
    })
})

exports.getGameReportInINPageUser = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    const data = await promotionModel.find();
    let games = await gameModel.find({status:true,whiteLabelName:whiteLabel});
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
        notifications:req.notifications,
        basicDetails,
        colorCode
    })
});

exports.getMyProfileUser = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    const data = await promotionModel.find();
    let games = await gameModel.find({status:true,whiteLabelName:whiteLabel});
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
    
    res.status(200).render("./userSideEjs/userProfile/main",{
        title:'My Profile',
        user,
        verticalMenus,
        data,
        check:"userP",
        games,
        userLog,
        notifications:req.notifications,
        userProfileContent,
        basicDetails,
        colorCode
    })
});


exports.gameRulesPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let rules = await gamrRuleModel.find({whiteLabelName:whiteLabel})
    res.status(200).render("./Cms/ruleManager",{
        title:"Rules Management",
        user,
        me:user,
        currentUser:user,
        rules,
        basicDetails,
        colorCode
    })
});


exports.getMyKycPage = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    const data = await promotionModel.find();
    let games = await gameModel.find({status:true,whiteLabelName:whiteLabel});
    let userLog = await loginLogs.find({user_id:user._id})
    res.status(200).render("./userSideEjs/Kyc/main",{
        title:'KYC',
        user,
        verticalMenus,
        data,
        check:"Kyc",
        games,
        userLog,
        notifications:req.notifications,
        basicDetails,
        colorCode
    })
});

exports.getSettlementPageIn = catchAsync(async(req, res, next) => {
    let me = req.currentUser
    let inprogressData = await InprogreshModel.find({eventId:req.query.id})
    let childrenUsername = []
    if(req.currentUser.roleName == 'Operator'){
        childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser.parent_id});
    }else{
        childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser._id});
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
    // console.log(betsEventWiseMap, "betsEventWiseMapbetsEventWiseMapbetsEventWiseMapbetsEventWiseMap")
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
    let openBetsMarketIds = await betModel.distinct('marketId', {status:"OPEN", eventId:req.query.id, userName:{$in:childrenUsername}})
    let runnersData = await runnerData.find({marketId:{$in:openBetsMarketIds}})
    res.status(200).render("./sattlementInPage/main",{
        title:"Settlements",
        me,
        currentUser:me,
        betsEventWiseOpen,
        data,
        betsEventWiseMap,
        betsEventWiseCancel,
        betsEventWiseSettel,
        inprogressData,
        runnersData
    })
} )

exports.getSettlementHistoryPage = catchAsync(async(req, res, next) => {
    let me = req.currentUser
    let limit = 10
    let operationId;
    let operationroleName;
    if(req.currentUser.roleName == 'Operator'){
        operationId = req.currentUser.parent_id
        let parentUser = await User.findById(operationId)
        operationroleName = parentUser.roleName
    }else{
        operationId = req.currentUser._id
        operationroleName = req.currentUser.roleName

    }
    // console.log(me)
    // let History
    // if(me.roleName === "Admin"){
    //     History = await settlementHisory.find().sort({ date: -1 }).limit(limit)
    // }else{
    //     History = await settlementHisory.find({userId:me._id}).sort({ date: -1 }).limit(limit)
    // }
    let filter = {}
    if(operationroleName == "Admin"){
        filter = {}
    }else{
        filter = {
            userId:operationId
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
    if(req.currentUser.roleName == 'Operator'){
        childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser.parent_id});
    }else{
        childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser._id});
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
                  _id: {
                    eventName:'$eventName',
                    id:'$eventId'
                  },
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
              userName:{$in:childrenUsername},
              loginUserId:{$exists:true},
              parentIdArray:{$exists:true}
            }
        },
        {
            $lookup: {
                from: "commissionnewmodels",
                let: {ud:"$uniqueId",loginId:'$loginUserId',parentArr:'$parentIdArray'},
                pipeline: [
                    {
                      $match: {
                        $expr: { $and: [{ $eq: ["$loginUserId", "$$loginId"] },{ $eq: ["$uniqueId", "$$ud"] }, { $in: ["$userId", "$$parentArr"] }] },
                        loginUserId:{$exists:true},
                        parentIdArray:{$exists:true},
                        $expr: { $ne: ["$commissionStatus", "cancel"] }
                      }
                    }
                  ],
                as: "parentdata"
            }
        },
        {
            $group: {
                _id: "$userName",
                totalCommission: { $sum: "$commission" },
                totalUPline: { $sum:{
                    $reduce:{
                        input:'$parentdata',
                        initialValue:0,
                        in: { $add: ["$$value", "$$this.commission"] }
                    }
                }},
            }
        },
        {
            $sort:{
            _id : -1,
            totalCommission : 1,
            totalUPline : 1
            }
        },
        {
        $limit:10
        }
    ])
    // for(let i = 0; i < userWiseData.length; i++){
    //     console.log(userWiseData[i].parentdata, "userWiseDatauserWiseDatauserWiseDatauserWiseData")
    // }

    // res.status(200).json({
    //     userWiseData
    // })

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
                    count = await betModel.countDocuments({eventId:item.eventData.eventId,status:"OPEN"})
                    seriesObjList.push({name:item.eventData.name,created_on:item.eventData.time,status:true,count,eventId:item.eventData.eventId})
                    
                }else{
                    count = await betModel.countDocuments({eventId:item.eventData.eventId,status:"OPEN"})
                    seriesObjList.push({name:item.eventData.name,created_on:item.eventData.time,status:status.status,count,eventId:item.eventData.eventId})

                }
            }
            
        })
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
    // console.log('START')
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
         let inPlayStatus = await InPlayEvent.findOne({Id:item.eventData.eventId})
         count = await betModel.countDocuments({eventId:item.eventData.eventId,status:"OPEN"})
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
        if(!inPlayStatus){
            item.eventData.inPlayStatus = false
        }else{
            item.eventData.inPlayStatus = true
        }
        item.eventData.count = count

        return item
    })
    let newfootballEvents =  footballList.eventList.map(async(item) => {
         let status = await catalogController.findOne({Id:item.eventData.eventId})
         let featureStatus = await FeatureventModel.findOne({Id:item.eventData.eventId})
         let inPlayStatus = await InPlayEvent.findOne({Id:item.eventData.eventId})


         count = await betModel.countDocuments({eventId:item.eventData.eventId,status:"OPEN"})
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
        if(!inPlayStatus){
            item.eventData.inPlayStatus = false
        }else{
            item.eventData.inPlayStatus = true
        }
        item.eventData.count = count

        return item
    })
    let newtennisEvents = tennisList.eventList.map(async(item) => {
         let status = await catalogController.findOne({Id:item.eventData.eventId})
         let featureStatus = await FeatureventModel.findOne({Id:item.eventData.eventId})
         let inPlayStatus = await InPlayEvent.findOne({Id:item.eventData.eventId})

         count = await betModel.countDocuments({eventId:item.eventData.eventId,status:"OPEN"})
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
        if(!inPlayStatus){
            item.eventData.inPlayStatus = false
        }else{
            item.eventData.inPlayStatus = true
        }
        item.eventData.count = count

        return item
    })

    cricketEvents = await Promise.all(newcricketEvents);
    footballEvents = await Promise.all(newfootballEvents);
    tennisEvents = await Promise.all(newtennisEvents);
    data = {cricketEvents,footballEvents,tennisEvents}
    // console.log(data.footballEvents, "fhdhhfdhfd")
    // data = {}

    return res.status(200).render("./eventController/eventController", {
        title:"Event Controller",
        data,
        me: user,
        currentUser: user,
    })
})


exports.CommissionMarkets = catchAsync(async(req, res, next) => { 
    let cricketData = await getCrkAndAllData()
    const cricket = cricketData[0].gameList[0].eventList
    // console.log(cricket, "cricketcricketcricket")
    const me = req.currentUser
    res.status(200).render("./commissionMarket/main",{
        title:"Commission Markets",
        me,
        currentUser:me,
        cricket
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
                userId: req.currentUser.id,
                commissionStatus: { $ne : 'cancel'}
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
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    res.status(200).render("./userSideEjs/commissionReport/main", {
        title:"Commission Report",
        user:req.currentUser,
        verticalMenus,
        check:"Comm",
        userLog,
        notifications:req.notifications,
        // data,
        commissionData,
        unclaimCommission:sum,
        basicDetails,
        colorCode
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
                sportId:sportId,
                commissionStatus: { $ne : 'cancel'}
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
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    res.status(200).render("./userSideEjs/commissionReportsIn/main", {
        title:"Commission Report",
        user:req.currentUser,
        verticalMenus,
        check:"Comm",
        userLog,
        notifications:req.notifications,
        data,
        sport,
        unclaimCommission:sum,
        basicDetails,
        colorCode
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
            commissionStatus: { $ne : 'cancel'}
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
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
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
        unclaimCommission:sum,
        basicDetails,
        colorCode
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
                eventName:sportId,
                commissionStatus: { $ne : 'cancel'}
            }
        },
        {
            $group:{
                _id:{
                    marketId : '$marketId',
                    commissionType : '$commissionType'
                },
                commission:{$sum:'$commission'},
                eventName:{$first:'$eventName'},
                seriesName:{$first:'$seriesName'},
                sportId:{$first:'$sportId'},
                eventId:{$first:'$eventId'},
                marketName:{$first:'$marketName'}

            }
        },
        {
            $project:{
                _id:0,
                marketId:'$_id.marketId',
                commissionType:'$_id.commissionType',
                commission:'$commission',
                eventName:"$eventName",
                seriesName:'$seriesName',
                sportId:'$sportId',
                eventId:'$eventId',
                marketName:'$marketName'

            }
        }
    ])
    
    // console.log(data, "datadata")

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
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    res.status(200).render("./userSideEjs/commissionReportMatch/main", {
        title:"Commission Report",
        user:req.currentUser,
        verticalMenus,
        check:"Comm",
        userLog,
        notifications:req.notifications,
        data,
        unclaimCommission:sum,
        basicDetails,
        colorCode
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
    let mainId = req.currentUser._id
    if(req.currentUser.role.roleName == 'Operator'){
        let parentUser = await User.findById(req.currentUser.parent_id)
        mainId = parentUser._id.toString()
    }
    let whiteLabel = whiteLabelcheck(req)
    let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
    let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    const sportData = await getCrkAndAllData()
    const cricket = sportData[0].gameList[0].eventList
    let match = cricket.find(item => item.eventData.eventId == req.query.id);
    if(match === undefined){
        let data1liveCricket = sportData[1].gameList.map(item => item.eventList.find(item1 => item1.eventData.eventId == req.query.id))
        match = data1liveCricket.find(item => item != undefined)
    }
    if(match == undefined){
        // res.status(404).json({
        //     status:"Success",
        //     message:"This match is no more live"
        // })
        if(req.originalUrl.startsWith('/admin')){
            res.render('./errorMessage', {
                statusCode : 404,
                message:"The match you are looking for is no more live",
                mainMassage:"Opps! Please try again later"
            })
        }else{
            res.render('./errorMessage2', {
                statusCode : 404,
                message:"The match you are looking for is no more live",
                mainMassage:"Opps! Please try again later"
            })
        }
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
        //     return date < Date.now() - 1000  60  60;
        // });
        let childrenUsername = []
        childrenUsername = await User.distinct('userName', {parentUsers:mainId});

        // let children = await User.find({parentUsers:mainId})
        // children.map(ele => {
        //     childrenUsername.push(ele.userName) 
        // })
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
        let rules = await gamrRuleModel.find({whiteLabelName:process.env.whiteLabelName})
        if(req.currentUser){
            userLog = await loginLogs.find({user_id:mainId})
            userMultimarkets = await multimarkets.findOne({userId:mainId})
            stakeLabledata = await stakeLable.findOne({userId:mainId})
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

        let check = await resumeSuspendModel.aggregate([
            {
                $match:{
                    status:false,
                    whiteLabel:req.currentUser.whiteLabel
                }
            }
        ])
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
            currentUser:req.currentUser,
            suspend:check,
            basicDetails,
            colorCode
    })
});


exports.marketBets = catchAsync(async(req, res, next) => {
    let limit = 10;
    let page = 0;
    let childrenUsername = []
    childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser._id});

    // let children = await User.find({parentUsers:req.currentUser._id})
    // children.map(ele => {
    //     childrenUsername.push(ele.userName) 
    // })
    let bets = await betModel.find({marketId:req.query.id,userName:{$in:childrenUsername} ,status: 'OPEN'}).sort({'date':-1}).skip(limit * page).limit(limit)
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
    res.status(200).render("./betSportLimit/main.ejs", {
        title:"Bet Limits",
        betLimit,
        me,
        currentUser:me
    })
});



exports.getBetLimitSportWise = catchAsync(async(req, res, next) => {
    const me = req.currentUser
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
    let marketList = seriesMatch[0].marketList
    let betLimitMatchWise = await betLimitMatchWisemodel.findOne({matchTitle:series})
    // console.log(marketList)
    let Session
    let onlyOver
    let w_p_market
    let odd_even
    let bookMaker
    if(marketList.session !== null){
        Session = marketList.session.filter(item => item.status == 1 && item.bet_allowed == 1 && item.game_over == 0 && !item.title.startsWith("Only") && item.title.includes("Over"))
        onlyOver = marketList.session.filter(item => item.status == 1 && item.bet_allowed == 1 && item.game_over == 0 && item.title.startsWith("Only"))
        w_p_market = marketList.session.filter(item => item.status == 1 && item.bet_allowed == 1 && item.game_over == 0 && !item.title.includes("Over"))
    }
    if(marketList.odd_even !== null){
        odd_even = marketList.odd_even
    }
    if(marketList.bookmaker !== null){
        bookMaker = marketList.bookmaker
    }
    res.status(200).render("./betLimitMatch/main.ejs", {
        title:"Bet Limits",
        betLimit,
        me,
        currentUser:me,
        seriesMatch,
        series,
        betLimitMatchWise,
        Session,
        onlyOver,
        w_p_market,
        odd_even,
        bookMaker
    })
});


exports.getcommissionMarketWise1 = catchAsync(async(req, res, next) => {
    let limit = 10
    const me = req.currentUser
    let match = req.query.event
    let childrenUsername = []
    childrenUsername = await User.distinct('userName', {parentUsers:req.currentUser._id});

    // let children = await User.find({parentUsers:req.currentUser._id})
    // children.map(ele => {
    //     childrenUsername.push(ele.userName) 
    // })
    if(req.query.market){
        // console.log(req.query.market, "req.query.marketreq.query.marketreq.query.market")
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
        let thatEvent = await commissionNewModel.findOne({eventId:match})
        // console.log(market)
        let thatMarketData = await commissionNewModel.aggregate([
            {
                $match: {
                // eventDate: {
                //     $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) 
                // },
                userName:{$in:childrenUsername},
                eventId:match,
                marketName:market,
                loginUserId:{$exists:true},
                parentIdArray:{$exists:true}
                }
            },
            {
                $lookup: {
                    from: "commissionnewmodels",
                    let: {ud:"$uniqueId",loginId:'$loginUserId',parentArr:'$parentIdArray'},
                    pipeline: [
                        {
                          $match: {
                            $expr: { $and: [{ $eq: ["$loginUserId", "$$loginId"] },{ $eq: ["$uniqueId", "$$ud"] }, { $in: ["$userId", "$$parentArr"] }] },
                            loginUserId:{$exists:true},
                            parentIdArray:{$exists:true}
                          }
                        }
                      ],
                    as: "parentdata"
                }
            },
            {
                $group: {
                    _id: "$userName",
                    totalCommission: { $sum: "$commission" },
                    netupline: { $sum:{
                        $reduce:{
                            input:'$parentdata',
                            initialValue:0,
                            in: { $add: ["$$value", "$$this.commission"] }
                        }
                    }},
                }
            },
            {
                $sort:{
                _id : -1,
                totalCommission : 1,
                netupline : 1
                }
            }
        ])
        // console.log(thatMarketData, "thatMarketData")
        res.status(200).render('./commissionMarketWise/commissionMarketWise2/commissionMarketWise2.ejs', {
            title:"Commission Report",
            me,
            currentUser:me,
            thatMarketData,
            match:thatEvent.eventName,
            eventId:match,
            marketName
        })
    }else{
        let marketWiseData = await commissionNewModel.aggregate([
            {
                $match: {
                // eventDate: {
                //     $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) 
                // },
                userName:{$in:childrenUsername},
                eventId:match
                }
            },
            {
                $group: {
                _id: {
                    marketName : '$marketName',
                    id:'$marketName'
                },
                totalCommission: { $sum: "$commission" },
                eventDate: { $first: "$eventDate" },
                eventName:{ $first: "$eventName" }
                }
            }
        ])
        // console.log(marketWiseData, "marketWiseDatamarketWiseData")
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
                    // eventDate: {
                    //     $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) 
                    // },
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
                    // eventDate: {
                    //     $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) 
                    // },
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

exports.getSportwisedownlinecommreport = catchAsync(async(req, res, next)=>{
    let loginuserid1 = []
    let adminBredcumArray = []
    let me
   let currentUser = req.currentUser
   let limit = 10

   
console.log(req.query.id)
    if(!req.query.id){
        me = req.currentUser
    }else{
        me = await User.findById(req.query.id)
    }  
    let childrens = await User.find({parent_id:me._id}).sort({"userName":1}).limit(limit)
    childrens.map(item =>{
        loginuserid1.push(item.userName)
    })

        if(me.userName === currentUser.userName){
        adminBredcumArray.push({
            userName:me.userName,
            role:me.roleName,
            id : me._id.toString(),
            status:true
        })
    }else{
        for(let i = 0; i < me.parentUsers.length; i++){
            if(me.parentUsers[i] == currentUser._id.toString()){
                // console.log("WORKING")
                adminBredcumArray.push({
                    userName:currentUser.userName,
                    role:currentUser.roleName,
                    id : currentUser._id.toString(),
                    status:true
                })
            }else{
                let thatUser = await User.findById(me.parentUsers[i])
                if(thatUser.role_type > currentUser.role_type){
                    adminBredcumArray.push({
                        userName:thatUser.userName,
                        role:thatUser.roleName,
                        id : thatUser._id.toString(),
                        status:false
                    })

                }
            }
        }
        adminBredcumArray.push({
            userName:me.userName,
            role:me.roleName,
            id : me._id.toString(),
            status:false
        })
    }
async function getcommissionreport (loginuserid1){
    let sportdownlinecomm = await commissionNewModel.aggregate([
        {
            $match:{
                date: {
                    $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) 
                },
                loginUserId:{$exists:true},
                userName:loginuserid1

            }
        },
        {
            $group:{
                _id:"$userName",
                commissionClaim:{$sum:{
                    $cond: [ { $eq: [ "$commissionStatus", 'Claimed' ] }, '$commission', 0 ]
                  }},
                commissionUnclaim:{$sum:{
                    $cond: [ { $eq: [ "$commissionStatus", 'Unclaimed' ] }, '$commission', 0 ]
                  }},
                userid:{$first:"$userId"}
            }
        }
    ])
    return sportdownlinecomm
}

    let resultArray = [];
    for(let i = 0 ;i<loginuserid1.length;i++){
        let result
        let userName = loginuserid1[i]
        let user = await User.findOne({userName:loginuserid1[i]})
        result = await getcommissionreport(userName)
        if(result.length == 0){
            resultArray=resultArray.concat([{
                _id:userName,
                commissionClaim:0,
                commissionUnclaim:0,
                userid:(user._id).toString()
            }])
        }else{
            resultArray=resultArray.concat(result)
        }

    }

    console.log(resultArray,'==>resultArray')
    res.status(200).render('./downlinecommissionreport/userwisedlcr',{
        title:'Downline Commission Report',
        sportdownlinecomm:resultArray,
        currentUser:req.currentUser,
        me:req.currentUser,
        adminBredcumArray
    })
})


exports.getSportwiseuplinecommreport = catchAsync(async(req, res, next)=>{
    let loginuserid1 = req.currentUser._id
    let sporttwisecommittion = await commissionNewModel.aggregate([
        {
            $match:{
                date: {
                    $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) 
                },
                loginUserId:{$exists:true},
                userId:loginuserid1.toString()

            }
        },
        {
            $group:{
                _id:"$sportId",
                commissionClaim:{$sum:{
                    $cond: [ { $eq: [ "$commissionStatus", 'Claimed' ] }, '$commission', 0 ]
                  }},
            }
        },
        {
            $sort:{_id:1}
        }
    ])

    let result = sporttwisecommittion.map(ele=>{
        if(ele['_id'] == '4'){
            ele['sportname'] = 'Cricket'
        }else if(ele['_id'] == '1'){
            ele['sportname'] = 'Football'
        }else if(ele['_id'] == '2'){
            ele['sportname'] = 'Tennis'
        }else if(ele['_id'] == '10'){
            ele['sportname'] = 'Basketball'
        }else if(ele['_id'] == '30'){
            ele['sportname'] = 'Baseball'
        }
        return ele
    })

   

    // console.log(sporttwisecommittion,"==>sporttwisecommittion")

    res.status(200).render('./uplinecommissionreport/uplinecommissionreport',{
        title:'Upline Commission Report',
        sporttwisecommittion:result,
        currentUser:req.currentUser,
        me:req.currentUser
    })
})



exports.getFancyBookDATA = catchAsync(async(req, res, next) => {
    // let userName = req.body.userName
    
        // console.log(data, "FANCYDATA")
        let childrenUsername1 = []
        // let loginUser = await User.findById()
        let forcheck = await betModel.find({marketId: req.body.marketId}) 
        let children = await User.find({parentUsers:req.body.id, role_type: 5})
        children.map(ele1 => {
            childrenUsername1.push(ele1.userName) 
        })
        // let checkBET = await betModel.findOne({marketId:data.marketId})
        if(forcheck.length > 0){
            if(req.body.marketId.slice(-2).startsWith('OE')){
                let betData = await betModel.aggregate([
                    {
                        $match: {
                            status: "OPEN",
                            marketId: req.body.marketId,
                            userName:{$in:childrenUsername1}
                        }
                    },
                    {
                        $group: { 
                            _id: {
                                "secId":"$secId",
                                "userName":"$userName"
                            },
                            parentArray: { $first: "$parentArray" },
                            totalAmount: { 
                                $sum: '$returns'
                            },
                            totalWinAmount:{
                                $sum: { 
                                    $cond : {
                                        if : {$eq: ["$secId", "odd_Even_Yes"]},
                                    then:{
                                        $divide: [{ $multiply: ["$oddValue", "$Stake"] }, 100]
                                    },
                                    else:"$Stake"
                                    }
                                }
                            }
                        }
                    },
                    {
                        $project:{
                            _id:0,
                            userName: "$_id.userName",
                            secId: "$_id.secId",
                            parentArray: "$parentArray",
                            totalAmount1: "$totalAmount",
                            totalWinAmount1: "$totalWinAmount",
                            totalAmount:{
                                $reduce:{
                                    input:'$parentArray',
                                    initialValue: { value: 0, flag: true },
                                    in : { 
                                        $cond:{
                                            if : {
                                                $and: [
                                                  { $ne: ['$$this.parentUSerId', req.body.id] }, 
                                                  { $eq: ['$$value.flag', true] } 
                                                ]
                                              },
                                            then : {
                                                value: { 
                                                    $cond:{
                                                        if:{ $eq: ["$$value.value", 0] },
                                                        then:{
                                                            $multiply: ["$totalAmount", { $divide: ["$$this.uplineShare", 100] }]
                                                        },
                                                        else:{
                                                            $multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]
                                                        }
                                                    }
                                                },
                                                flag: true,
                                                
                                            },
                                            else : {
                                                value: {
                                                    $cond : {
                                                        if : { $eq : ["$$value.value" , 0]},
                                                        then : {
                                                            $subtract : ["$totalAmount",{$multiply: ["$totalAmount", { $divide: ["$$this.uplineShare", 100] }]}]
                                                        },
                                                        else : "$$value.value"
                                                    }
                                                },
                                                flag:false
                                            }
                                        }
                                    }
                                }
                            },
                            totalWinAmount:{
                                $reduce:{
                                    input:'$parentArray',
                                    initialValue: { value: 0, flag: true },
                                    in : { 
                                        $cond:{
                                            if : {
                                                $and: [
                                                  { $ne: ['$$this.parentUSerId', req.body.id] }, 
                                                  { $eq: ['$$value.flag', true] } 
                                                ]
                                              },
                                            then : {
                                                value: { 
                                                    $cond:{
                                                        if:{ $eq: ["$$value.value", 0] },
                                                        then:{
                                                            $multiply: ["$totalWinAmount", { $divide: ["$$this.uplineShare", 100] }]
                                                        },
                                                        else:{
                                                            $multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]
                                                        }
                                                    }
                                                },
                                                flag: true,
                                                
                                            },
                                            else : {
                                                value: {
                                                    $cond : {
                                                        if : { $eq : ["$$value.value" , 0]},
                                                        then : {
                                                            $subtract : ["$totalWinAmount",{$multiply: ["$totalWinAmount", { $divide: ["$$this.uplineShare", 100] }]}]
                                                        },
                                                        else : "$$value.value"
                                                    }
                                                },
                                                flag:false
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        $project:{
                            _id:"$secId",
                            totalAmount:{
                                $sum: '$totalAmount.value'
                            },
                            totalWinAmount:{
                                $sum: '$totalWinAmount.value'
                            },
    
                        }
                    },
                    {
                        $group: {
                          _id: null,
                          data: {
                            $push: {
                              _id: "$_id",
                              totalAmount: {
                                $multiply:["$totalAmount", -1]
                              },
                              totalWinAmount: {
                                $multiply:["$totalWinAmount", -1]
                              }
                            }
                          }
                        }
                      },
                      {
                        $project: {
                          _id: 0,
                          data: {
                            $map: {
                              input: "$data",
                              as: "item",
                              in: {
                                _id: "$$item._id",
                                totalAmount: "$$item.totalAmount",
                                totalWinAmount: "$$item.totalWinAmount",
                                totalWinAmount2: {
                                  $add: ["$$item.totalWinAmount", {
                                    $reduce: { 
                                        input: "$data",
                                        initialValue: 0,
                                        in: {
                                            $cond: {
                                                if: {
                                                    $ne: ["$$this._id", "$$item._id"] 
                                                },
                                                then: { $add: ["$$value", "$$this.totalAmount"] },
                                                else: {
                                                    $add: ["$$value", 0] 
                                                }
                                            }
                                        }
                                    }
                                  }]
                                }
                              }
                            }
                          }
                        }
                      }
                ])
    
                // console.log(betData, "betData")
                // console.log(betData[0].data, "betData[0].databetData[0].databetData[0].data")
                // socket.emit('FANCYBOOK', {betData:betData[0].data, type:'ODD'})
                res.status(200).json({
                    betData:betData[0].data, type:'ODD'
                })
            }else{
                // console.log('WORKING123', data)
                let betData = await betModel.aggregate([
                    {
                        $match: {
                            status: "OPEN",
                            marketId: req.body.marketId,
                            userName:{$in:childrenUsername1}
                        }
                    },
                    {
                        $addFields: {
                          runs: {
                            $toInt: {
                              $arrayElemAt: [
                                { $split: ["$selectionName", "@"] },
                                1 
                              ]
                            }
                          }
                        }
                    },
                    {
                        $group: { 
                            _id: {
                                "secId":"$secId",
                                "userName":"$userName",
                                "runs":"$runs"
                            },
                            // uniqueRuns: { $addToSet: "$runs" },
                            parentArray: { $first: "$parentArray" },
                            totalAmount: { 
                                $sum: '$returns'
                            },
                            totalWinAmount:{
                                $sum: { 
                                    $cond : {
                                        if : {$eq: ["$secId", "odd_Even_Yes"]},
                                    then:{
                                        $divide: [{ $multiply: ["$oddValue", "$Stake"] }, 100]
                                    },
                                    else:"$Stake"
                                    }
                                }
                            }
                        }
                    },
                    {
                        $project:{
                            _id:0,
                            userName: "$_id.userName",
                            secId: "$_id.secId",
                            runs: "$_id.runs",
                            parentArray: "$parentArray",
                            totalAmount1: "$totalAmount",
                            totalWinAmount1: "$totalWinAmount",
                            uniqueRuns:"$uniqueRuns",
                            totalAmount:{
                                $reduce:{
                                    input:'$parentArray',
                                    initialValue: { value: 0, flag: true },
                                    in : { 
                                        $cond:{
                                            if : {
                                                $and: [
                                                  { $ne: ['$$this.parentUSerId', req.body.id] }, 
                                                  { $eq: ['$$value.flag', true] } 
                                                ]
                                              },
                                            then : {
                                                value: { 
                                                    $cond:{
                                                        if:{ $eq: ["$$value.value", 0] },
                                                        then:{
                                                            $multiply: ["$totalAmount", { $divide: ["$$this.uplineShare", 100] }]
                                                        },
                                                        else:{
                                                            $multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]
                                                        }
                                                    }
                                                },
                                                flag: true,
                                                
                                            },
                                            else : {
                                                value: {
                                                    $cond : {
                                                        if : { $eq : ["$$value.value" , 0]},
                                                        then : {
                                                            $subtract : ["$totalAmount",{$multiply: ["$totalAmount", { $divide: ["$$this.uplineShare", 100] }]}]
                                                        },
                                                        else : "$$value.value"
                                                    }
                                                },
                                                flag:false
                                            }
                                        }
                                    }
                                }
                            },
                            totalWinAmount:{
                                $reduce:{
                                    input:'$parentArray',
                                    initialValue: { value: 0, flag: true },
                                    in : { 
                                        $cond:{
                                            if : {
                                                $and: [
                                                  { $ne: ['$$this.parentUSerId', req.body.id] }, 
                                                  { $eq: ['$$value.flag', true] } 
                                                ]
                                              },
                                            then : {
                                                value: { 
                                                    $cond:{
                                                        if:{ $eq: ["$$value.value", 0] },
                                                        then:{
                                                            $multiply: ["$totalWinAmount", { $divide: ["$$this.uplineShare", 100] }]
                                                        },
                                                        else:{
                                                            $multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]
                                                        }
                                                    }
                                                },
                                                flag: true,
                                                
                                            },
                                            else : {
                                                value: {
                                                    $cond : {
                                                        if : { $eq : ["$$value.value" , 0]},
                                                        then : {
                                                            $subtract : ["$totalWinAmount",{$multiply: ["$totalWinAmount", { $divide: ["$$this.uplineShare", 100] }]}]
                                                        },
                                                        else : "$$value.value"
                                                    }
                                                },
                                                flag:false
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        $project:{
                            _id:0,
                            secId: "$secId",
                            runs: "$runs",
                            totalAmount:"$totalAmount.value",
                            totalWinAmount:"$totalWinAmount.value",
                            uniqueRuns:"$uniqueRuns",
                        }
                    },
                    {
                        $group: {
                          _id: null,
                          uniqueRuns: { $addToSet: "$runs" },
                          data: { $push: "$$ROOT" } 
                        }
                      },
                      {
                        $project: {
                          _id: 0, 
                          uniqueRuns: 1,
                          data: 1 
                        }
                      },
                      {
                        $unwind: "$uniqueRuns" 
                      },
                      {
                        $sort: {
                          "uniqueRuns": 1 
                        }
                      },
                      {
                        $group: {
                          _id: null,
                          uniqueRuns: { $push: "$uniqueRuns" },
                          data: { $push: "$data" }
                        }
                      },
                    //   {
                    //     $project:{
                    //         _id:0,
                    //         data:{
                    //             $reduce:{
                    //                 input:'$uniqueRuns',
                    //                 initialValue: { value: 0, flag: true , i:0},
                    //                 in : {

                    //                 }
                    //             }
                    //         }
                    //     }
                    //   }
                   
                    
                    // {
                    //     $addFields: {
                    //       dataTOShow: {
                    //         $cond: {
                    //           if: { $eq: ["$secId", "odd_Even_Yes"] },
                    //           then: { $concat: [ { $toString: "$runs" }, " or more" ] },
                    //           else: { $concat: [ { $toString: "$runs" }, " less than" ] }
                    //         }
                    //       }
                    //     }
                    // },
                    // {
                    //     $project:{
                    //         _id:"$dataTOShow",
                    //         secId: "$secId",
                    //         runs: "$runs",
                    //         totalAmount:"$totalAmount",
                    //         totalWinAmount:"$totalWinAmount",
                    //         uniqueRuns:"$uniqueRuns",
                    //     }
                    // },
                    // {
                    //     $project: {
                    //       _id: "$_id",
                    //       secId: "$secId",
                    //       runs: "$runs",
                    //       totalAmount: "$totalAmount",
                    //       totalWinAmount: "$totalWinAmount",
                    //       uniqueRuns: {
                    //         $setUnion: ["$uniqueRuns"] 
                    //       }
                    //     }
                    //   }
                    
                    
                    
                  ])
                //   console.log(betData[0], "betData")
                // console.log(betData[0].data, "betData")
                betData =  betData[0]
                let dataToshow = []
                for(let i = 0; i < betData.uniqueRuns.length; i++){ 
                    if(betData.uniqueRuns.length === 1){
                        let data1 = {}
                        data1.message = `${betData.uniqueRuns[i] - 1} or less`
                        let sum = 0
                        for(let j = 0; j < betData.data[0].length; j++){
                            if(betData.data[0][j].secId === "odd_Even_No"){
                                sum += betData.data[0][j].totalWinAmount
                            }else{
                                sum += betData.data[0][j].totalAmount
                            }
                        }
                        data1.sum = sum
                        dataToshow.push(data1)
                        let data2 = {}
                        let sum2 = 0
                        data2.message = `${betData.uniqueRuns[i]} or more`
                        for(let j = 0; j < betData.data[0].length; j++){
                            if(betData.data[0][j].secId === "odd_Even_Yes"){
                                sum2 += betData.data[0][j].totalWinAmount
                            }else{
                                sum2 += betData.data[0][j].totalAmount
                            }
                        }
                        data2.sum = sum2
                        dataToshow.push(data2)
                    }else{
                        if(i === 0){
                            let data = {}
                            data.message = `${betData.uniqueRuns[i] - 1} or less`
                            let sum = 0
                            for(let j = 0; j < betData.data[0].length; j++){
                                if(betData.data[0][j].secId === "odd_Even_No" && betData.data[0][j].runs >= (betData.uniqueRuns[i])){
                                    sum += betData.data[0][j].totalWinAmount
                                }else{
                                    sum += betData.data[0][j].totalAmount
                                }
                            }
                            data.sum = sum
                            dataToshow.push(data)
                        }else if (i === (betData.uniqueRuns.length - 1)){
                            let data = {}
                            let data1 = {}
                            data.message = `between ${betData.uniqueRuns[i - 1]} and ${betData.uniqueRuns[i] - 1}`
                            let sum = 0
                            for(let j = 0; j < betData.data[0].length; j++){
                                if(betData.data[0][j].secId === "odd_Even_No" && betData.data[0][j].runs == betData.uniqueRuns[i]){
                                    sum += betData.data[0][j].totalWinAmount
                                }else if (betData.data[0][j].secId === "odd_Even_Yes" && betData.data[0][j].runs == betData.uniqueRuns[i - 1]){
                                    sum += betData.data[0][j].totalWinAmount
                                }
                                else{
                                    sum += betData.data[0][j].totalAmount
                                }
                            }
                            data.sum = sum
                            dataToshow.push(data)
                            let sum2 = 0
                            data1.message = `${betData.uniqueRuns[i]} or more`
                            for(let j = 0; j < betData.data[0].length; j++){
                                if(betData.data[0][j].secId === "odd_Even_Yes" && betData.data[0][j].runs <= betData.uniqueRuns[i]){
                                    sum2 += betData.data[0][j].totalWinAmount
                                }
                                else{
                                    sum2 += betData.data[0][j].totalAmount
                                }
                            }
                            data1.sum = sum2
                            dataToshow.push(data1)
                        }else{
                            let data = {}
                            data.message = `between ${betData.uniqueRuns[i - 1]} and ${betData.uniqueRuns[i] - 1}`
                            let sum = 0
                            for(let j = 0; j < betData.data[0].length; j++){
                                if(betData.data[0][j].secId === "odd_Even_No" && betData.data[0][j].runs == betData.uniqueRuns[i]){
                                    sum += betData.data[0][j].totalWinAmount
                                }else if (betData.data[0][j].secId === "odd_Even_Yes" && betData.data[0][j].runs == betData.uniqueRuns[i - 1]){
                                    sum += betData.data[0][j].totalWinAmount
                                }
                                else{
                                    sum += betData.data[0][j].totalAmount
                                }
                            }
                            data.sum = sum
                            dataToshow.push(data)
                        }
                    }
                }
                // socket.emit('FANCYBOOK', {betData, type:'Fancy'})
                res.status(200).json({
                    betData:dataToshow, type:'Fancy'
                })
            }

        }else{
            // socket.emit('FANCYBOOK', {type:'notFound'})
            res.status(200).json({
                type:'notFound'
            })
        }
})


exports.paymentApprovalPage = catchAsync(async(req, res, next)=>{
    // console.log(res.locals.B2C_Status, 121212212222222121)
    if(!res.locals.B2C_Status){
        return next(new AppError('You do not have permission to perform this action', 404))
    }
    newChilds = await User.distinct('userName', {parentUsers:req.currentUser._id});
    let paymentreq = await paymentReportModel.find({username:{$in:newChilds}}).sort({date:-1}).limit(10)
    res.render('./PaymentApproval/PaymentApproval',{
        title:'Payment Approval',
        currentUser:req.currentUser,
        paymentreq,
        check:"PaymentApp",
    })
})
exports.paymentMethodPage = catchAsync(async(req, res, next)=>{
    if(!res.locals.B2C_Status){
        return next(new AppError('You do not have permission to perform this action', 404))
    }
    let paymentmethod = await PaymentMethodModel.find({userName:req.currentUser.userName});
    res.render('./PaymentMethod/paymentMethod',{
        title:'Payment Method',
        currentUser:req.currentUser,
        paymentmethod,
        check:"PaymentRepo"
    })
})


exports.getManagementAccount = catchAsync(async(req, res, next) => {
    let userLog
    if(!res.locals.B2C_Status){
        return next(new AppError('You do not have permission to perform this action', 404))
    }
    if(req.currentUser){
        userLog = await loginLogs.find({user_id:req.currentUser._id})
    }
    let accounts = await manageAccountUser.find({userName:req.currentUser.userName})
    // console.log(accounts, "accountsaccounts")
    let whiteLabel = whiteLabelcheck(req)
let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    res.status(200).render("./userSideEjs/manageAccounts/main", {
        title:"Manage Accounts",
        user:req.currentUser,
        check:"MNGACC",
        userLog,
        verticalMenus,
        notifications:req.notifications,
        accounts,
        basicDetails,
        colorCode
    })
})



exports.getWithrowReqPage = catchAsync(async(req, res, next) => {
    if(!res.locals.B2C_Status){
        return next(new AppError('You do not have permission to perform this action', 404))
    }
    let data = await withdrawalRequestModel.find({sdmUserName:req.currentUser.userName, reqStatus:'pending'}).sort({reqDate:-1}).limit(10)
    res.render('./withrowalReqAdmin/main',{
        title:'Withdrawal request',
        currentUser:req.currentUser,
        check:"WithdrawalReq",
        data
    })
})



exports.myWithrowReq = catchAsync(async(req, res, next) => {
    let userLog
    if(!res.locals.B2C_Status){
        return next(new AppError('You do not have permission to perform this action', 404))
    }
    if(req.currentUser){
        userLog = await loginLogs.find({user_id:req.currentUser._id})
    }
    let whiteLabel = whiteLabelcheck(req)
    let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
    let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    let withrowReqData = await withdrawalRequestModel.find({userName:req.currentUser.userName}).sort({reqDate:-1}).limit(10)
    res.status(200).render("./userSideEjs/withrowReqPage/main", {
        title:"withdrawal request.",
        user:req.currentUser,
        verticalMenus,
        check:"withdrawal",
        userLog,
        withrowReqData,
        notifications:req.notifications,
        basicDetails,
        colorCode
    })
});


exports.getHTMLSCOREIFRm = catchAsync(async(req, res, next) => {
    res.status(200).render('./forSimpleHtmlOFSports')
})


exports.getGlobalSetting = catchAsync(async(req, res, next) => {
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
    let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
    const colorcode = await colorCodeModel.findOne({whitelabel:whiteLabel })
    let footerContectDetaisl = await footerInfoModel.find({whiteLabelName:whiteLabel})
    let socialMedia = await socialinfomodel.find({whiteLabelName:whiteLabel})
    console.log(footerContectDetaisl, "footerContectDetaislfooterContectDetaislfooterContectDetaisl")
    res.status(200).render("./globalSettings/main",{
        title:"Global settings",
        user,
        me:user,
        currentUser:user,
        basicDetails,
        colorcode,
        footerContectDetaisl,
        socialMedia
    })
});



exports.userdashboard22 = catchAsync(async(req, res, next) => {
    // console.log('WORKING')
    let featureEventId = []
    let user = req.currentUser
    let whiteLabel = whiteLabelcheck(req)
    let basicDetails = await  globalSettingModel.find({whiteLabel:whiteLabel })
    let colorCode = await colorCodeModel.findOne({whitelabel:whiteLabel})
    const data = await promotionModel.find({whiteLabelName: whiteLabel});
    // console.log(data, "datatatata")
    let verticalMenus = await verticalMenuModel.find({whiteLabelName: whiteLabel , status:true}).sort({num:1});
    const banner = await bannerModel.find({whiteLabelName: whiteLabel})
    let sliders = await sliderModel.find({whiteLabelName: whiteLabel}).sort({Number:1})
    let pages = await pagesModel.find({whiteLabelName: whiteLabel})
    
    let featureStatusArr = await FeatureventModel.find();
    featureStatusArr.map(ele => {
        featureEventId.push(parseInt(ele.Id))
    })
    let userLog
    if(user){
        userLog = await loginLogs.find({user_id:user._id})
    }
    let footerDetails = await footerInfoModel.find({whiteLabelName: whiteLabel})
    // console.log(footerDetails, "footerDetailstydewsfsffsffsffsffsffffffff")
    res.status(200).render("./userSideEjs/home/homePage",{
        title:'Home',
        data,
        verticalMenus,
        banner,
        sliders,
        pages,
        check:"Home",
        notifications:req.notifications,
        featureStatusArr,
        basicDetails,
        colorCode,
        footerDetails
    })
})