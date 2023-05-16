const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');
const User = require('../model/userModel');
const Role = require('../model/roleModel');
const fetch = require("node-fetch")
const whiteLabel = require('../model/whitelableModel');
const mongoose = require("mongoose");

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
    var fullUrl = req.protocol + '://' + req.get('host') + '/api/v1/role/getAuthROle'
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
    res.status(200).render('onlineUser',{
        title:"Inavtive Users",
        users,
        currentUser
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
    res.status(200).render("./user/userDashboard")
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
            'Signature':'MIICXgIBAAKBgQDO4DWZQtAl3KEJ9kHcKlaQxBN6qZz1NB5XDu+eFWRjIxPC9P+yswF679bCsph90kw45Lx1m9c6mW+Vzafcq6Zl5+wDgA6ujTv2Jq5+3Qv2Ag/n+VL06OTq4RcvPf76nSPUycS2oaDe5XhnaaqbluBZ5VXsLJAPFhdg+3ltssdV3wIDAQABAoGBAKCMlmwr0vgfQodFqxUfcnEFCoz+hwYw/X7Y45NOzMq3VUXO94YKsBJlgck162xyQZ9BvRSU7jLXEycyJJz4RbiZLRwXfFZgy6FHk1cKpOBoV+wpykD/XAKMdSY5FY0udkf3lqWBJFNYPbJ7bjme9BKC9PYvxP+yZWWfU1OYPeGRAkEA7NXc1H3ffdQ9Y86EfrGZrWrhnxIxK2tLNB3r21/LElV+7x4H/zMxov6oydHy5veflVQ1/7ZLYMD/+/VHwVB+uQJBAN+duOuoanLHMD3FQMJ8gvNDYXoyiVXancu/u+HDyBzBSW1vVdKQH1eZqEVQOGXUhEJt7rSxs69uz4GVJ/5z7VcCQE+cfET5ovzbMV+xdhxYev4uZXVhWiHsSTVVsYjmpI6fKrIaeDmy7caKsBZXer1lE8HQsu4oSyJU/jel9d7nvhECQQC5eQKmQ/x20wwKUA+UwN2ElADH8B7FHR0AoDlf2pmicBdNM6lFitDUQdi2FQGSRKCm0LPLIBFfk1N9sY+Il/LlAkEA12A1toJ2ph0YWqe/DBczW/66xAvBxVVvTMiqMae+Kmh6ax71yDPDRGvTnjwo/RbL8Ac7KwZhMUmy7UoemCL62A==' 
            },
        body:{
            "clientIp": "122.170.115.53",
            "operatorId": "sheldon",
            "partnerId": "SHPID01",
            "platformId": "DESKTOP",
            "userId": `6438f3b5d2eb67c8f67fe065`,
            "username": "use1"
           }

    }).then(res => console.log(res))
    // .then(result => {

    //     console.log(result)
    //     res.status(200).json({
    //         status:"success",
    //         result
    //     })
    // }
    // )
})