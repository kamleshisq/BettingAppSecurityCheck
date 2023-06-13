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
const fetch = require("node-fetch")
const whiteLabel = require('../model/whitelableModel');
const mongoose = require("mongoose");
const SHA256 = require("../utils/sha256");
const fs = require('fs');
const path = require('path');
const { all } = require('axios');

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
                url:`http://127.0.0.1:8000/api/v1/users/getOwnChild?id=${id}`,
                name:'user'
            },
            {
                url:`http://127.0.0.1:8000/api/v1/role/getAuthROle`,
                name:'role'
            }
        ]
    }
    else{
        urls = [
            {
                url:`http://127.0.0.1:8000/api/v1/users/getOwnChild`,
                name:'user'
            },
            {
                url:`http://127.0.0.1:8000/api/v1/role/getAuthROle`,
                name:'role'
            }
        ]
    }
    // console.log(fullUrl)
    let requests = urls.map(item => fetch(item.url, {
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ` + req.token, // notice the Bearer before your token
        }
    }).then(data => data.json()));
    const data = await Promise.all(requests)
    const users = data[0].child;
    const roles = data[1].roles;
    const currentUser = global._User
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

   
});

exports.login = catchAsync(async(req, res, next) => {
    // console.log("1")
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
            url:`http://127.0.0.1:8000/api/v1/users/getUser?id=${req.query.id}`,
            name:'user'
        },
        {
            url:`http://127.0.0.1:8000/api/v1/role/getAuthROle`,
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
        // console.log(result.dashboard.users)
        const currentUser = global._User
        res.status(200).render('./adminSideDashboard/dashboard',{
            title:"Dashboard",
            data:result,
            me:currentUser
        })
    })
});


exports.inactiveUser = catchAsync(async(req, res, next) => {
    const roles = await Role.find({role_level: {$gt:req.currentUser.role.role_level}});
    let role_type =[]
    for(let i = 0; i < roles.length; i++){
        role_type.push(roles[i].role_type)
    }
    const currentUser = global._User
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
    const roles = await Role.find({role_level: {$gt:req.currentUser.role.role_level}});
    let role_type =[]
    for(let i = 0; i < roles.length; i++){
        role_type.push(roles[i].role_type)
    }
    const currentUser = global._User
    let users
    if(currentUser.role_type == 1){
        users = await User.find({is_Online:true})
    }else{
        users = await User.find({role_type:{$in:role_type},is_Online:true , whiteLabel:currentUser.whiteLabel})
    }
    let me = global._User
    res.status(200).render('./onlineUsers/onlineUsers',{
        title:"Online Users",
        users,
        currentUser,
        me
    })
});


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
    // console.log(user)
    res.status(200).render("./user/userDashboard",{
        user
    })
})

exports.edit = catchAsync(async(req, res, next) => {
    const user = global._User;
    res.status(200).render('./user/edit',{
        user
    })
})

exports.myAccountStatment = catchAsync(async(req, res, next) => {
    // let id = req.originalUrl.split("=")[1]
    // console.log(req.query.id)
    var fullUrl = req.protocol + '://' + req.get('host') + '/api/v1/Account/getMyAccStatement'
    fetch(fullUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ` + req.token }
    }).then(res => res.json())
    .then(json => res.status(200).render("./user/accountStatement", {
        title:"Account Statement",
        data:json.userAcc
    }));
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
    const currentUser = global._User
    const role_type = []
    const roles = await Role.find({role_type: {$gt:currentUser.role_type}});
    // let role_type =[]
    for(let i = 0; i < roles.length; i++){
        role_type.push(roles[i].role_type)
    }
    const bets = await betModel.find({role_type:{$in:role_type}, status:{$ne:"OPEN"}}).limit(10)
    res.status(200).render('./reports/reports',{
        title:"Reports",
        me:currentUser,
        bets
    })
})

exports.gameReportPage = catchAsync(async(req, res, next) => {
    const currentUser = global._User
    let roles
    if(currentUser.role_type == 1){
        roles = await Role.find();
    }else{
        roles = await Role.find({role_level: {$gt:req.currentUser.role.role_level}});
    }
        let role_type =[]
        for(let i = 0; i < roles.length; i++){
            role_type.push(roles[i].role_type)
        }
    const games = await betModel.aggregate([
        {
            $match:{
                role_type:{$in:role_type}
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
            $skip:0
        },
        {
            $limit:10
        }
    ])
    // console.log(games)
    res.status(200).render('./gamereports/gamereport',{
        title:"gameReports",
        me:currentUser,
        games
    })
})

exports.useracount = catchAsync(async(req, res, next) => {
    const currentUser = global._User
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
        data
    })
});

    
})

exports.userhistoryreport = catchAsync(async(req, res, next) => {
    // const currentUser = global._User
    const currentUser = global._User
    const roles = await Role.find({role_level: {$gt:req.currentUser.role.role_level}});
    let role_type =[]
    for(let i = 0; i < roles.length; i++){
        role_type.push(roles[i].role_type)
    }
    // console.log(role_type)
    let Logs
    if(currentUser.role_type == 1){
        Logs = await loginLogs.find().limit(10)
    }else{
        Logs = await loginLogs.find({role_Type:{$in:role_type}}).limit(10)
    }
    res.status(200).render('./userHistory/userhistoryreport',{
        title:"UserHistory",
        me:currentUser,
        Logs
    })
})

exports.plreport = catchAsync(async(req, res, next) => {
    const roles = await Role.find({role_level: {$gt:req.currentUser.role.role_level}});
    let role_type =[]
    for(let i = 0; i < roles.length; i++){
        role_type.push(roles[i].role_type)
    }
    // console.log(role_type)
    const currentUser = global._User
    let users
    if(currentUser.role_type == 1){
        users = await User.find({isActive:true}).limit(10)
    }else{
        users = await User.find({role_type:{$in:role_type},isActive:true , whiteLabel:currentUser.whiteLabel}).limit(10)
    }
        // console.log(users)
    res.status(200).render('./PL_Report/plreport',{
        title:"P/L Report",
        me:currentUser,
        users:users
    })
    
    
});

exports.roleManagement = catchAsync(async(req, res, next) => {
    const currentUser = global._User
    const roles = await Role.find().sort({role_level:1})
    const Auth = await roleAuth.find()
    // console.log(Auth[0].UserControll);
    res.status(200).render("./roleManagement/roleManagement", {
        title:"Role Management",
        me:currentUser,
        roles,
        roleAuth:Auth[0]
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
    res.status(200).render("./promotion/promotion",{
        title:"Promotion",
        data
    })
});

exports.getoperationsPage = catchAsync(async(req, res, next) => {
    const me = global._User
    res.status(200).render("./operations/operation",{
        title:"House Management",
        me
    })
})

exports.getSettlementPage = catchAsync(async(req, res, next) => {
    const me = global._User
    res.status(200).render("./sattelment/setalment",{
        title:"Setalment",
        me
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
                whiteLabel:fWhitlabel
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
    const me = global._User
    // console.log(whiteLabelWise)
    res.status(200).render("./whiteLableAnalysis/whiteLableAnalysis",{
        title:"whiteLableAnalysis",
        whiteLabelWise,
        me
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

    const me = global._User
    res.status(200).render("./gameAnalysis/gameanalysis",{
        title:"Game Analysis",
        gameAnalist,
        me
    })
})

exports.getStreamManagementPage = catchAsync(async(req, res, next) => {
    const me = global._User
    res.status(200).render("./streamManagement/streammanagement",{
        title:"Streammanagement",
        me
    })
})

exports.getNotificationsPage = catchAsync(async(req, res, next) => {
    const me = global._User
    res.status(200).render("./Notifications/Notification",{
        title:"Notification",
        me
    })
})

exports.getBetMoniterPage = catchAsync(async(req, res, next) => {
    // console.log(req.currentUser)
    const roles = await Role.find({role_level: {$gt:req.currentUser.role.role_level}});
    let role_type =[]
    for(let i = 0; i < roles.length; i++){
        role_type.push(roles[i].role_type)
    }
    // console.log(await betModel.find({status:'OPEN'}).limit(10))
    let bets
    if(req.currentUser.role.role_level == 1){
        bets = await betModel.find({status:'OPEN'}).limit(10)
    }else{
        bets = await betModel.find({role_type:{$in:role_type},status:'OPEN'}).limit(10)
    }
    const me = global._User
    res.status(200).render("./betMonitering/betmoniter",{
        title:"Betmoniter",
        bets,
        me
    })
})

// exports.getBetMoniterPage = catchAsync(async(req, res, next) => {
//     res.status(200).render("./alertBet/betmoniter")
// })

exports.getCasinoControllerPage = catchAsync(async(req, res, next) => {
    let data;
    let RG;
    data = await gameModel.find({game_name:new RegExp("32 Cards","i")})
    RG = await gameModel.find({sub_provider_name:"Royal Gaming"})
    // console.log(RG.length)
    res.status(200).render("./casinoController/casinocontrol", {
        title:"casinoController",
        data:data,
        RG
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
    const roles = await Role.find({role_level: {$gt:req.currentUser.role.role_level}});
    let role_type =[]
    for(let i = 0; i < roles.length; i++){
        role_type.push(roles[i].role_type)
    }
    // console.log(await betModel.find({status:'OPEN'}).limit(10))
    let bets
    if(req.currentUser.role.role_level == 1){
        bets = await betModel.find({status:'CANCEL'}).limit(10)
    }else{
        bets = await betModel.find({role_type:{$in:role_type},status:'CANCEL'}).limit(10)
    }
    let me = global._User
    res.status(200).render("./voidBet/voidBet",{
        title:"Void Bets",
        bets,
        me
    })
});


exports.getBetLimitPage = catchAsync(async(req, res, next) => {
    const me = global._User
    const betLimit = await betLimitModel.find()
    res.status(200).render("./betLimit/betLimit", {
        title:"Bet Limits",
        betLimit,
        me
    })
});

exports.getSportList = catchAsync(async(req, res, next) => {
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
})