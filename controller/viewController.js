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
    res.status(200).render('userTable',{
        title: "User table",
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
        res.status(200).render('dashboard',{
            data:result
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
    var fullUrl = 'https://stage-api.mysportsfeed.io/api/v1/feed/login';
    fetch(fullUrl, {
        method: 'POST',
        headers: { 
    'Signature':'TUlJQ1hnSUJBQUtCZ1FETzREV1pRdEFsM0tFSjlrSGNLbGFReEJONnFaejFOQjVYRHUrZUZXUmpJeFBDOVAreQpzd0Y2NzliQ3NwaDkwa3c0NUx4MW05YzZtVytWemFmY3E2Wmw1K3dEZ0E2dWpUdjJKcTUrM1F2MkFnL24rVkwwCjZPVHE0UmN2UGY3Nm5TUFV5Y1Myb2FEZTVYaG5hYXFibHVCWjVWWHNMSkFQRmhkZyszbHRzc2RWM3dJREFRQUIKQW9HQkFLQ01sbXdyMHZnZlFvZEZxeFVmY25FRkNveitod1l3L1g3WTQ1Tk96TXEzVlVYTzk0WUtzQkpsZ2NrMQo2Mnh5UVo5QnZSU1U3akxYRXljeUpKejRSYmlaTFJ3WGZGWmd5NkZIazFjS3BPQm9WK3dweWtEL1hBS01kU1k1CkZZMHVka2YzbHFXQkpGTllQYko3YmptZTlCS0M5UFl2eFAreVpXV2ZVMU9ZUGVHUkFrRUE3TlhjMUgzZmZkUTkKWTg2RWZyR1pyV3JobnhJeEsydExOQjNyMjEvTEVsVis3eDRIL3pNeG92Nm95ZEh5NXZlZmxWUTEvN1pMWU1ELworL1ZId1ZCK3VRSkJBTitkdU91b2FuTEhNRDNGUU1KOGd2TkRZWG95aVZYYW5jdS91K0hEeUJ6QlNXMXZWZEtRCkgxZVpxRVZRT0dYVWhFSnQ3clN4czY5dXo0R1ZKLzV6N1ZjQ1FFK2NmRVQ1b3Z6Yk1WK3hkaHhZZXY0dVpYVmgKV2lIc1NUVlZzWWptcEk2ZktySWFlRG15N2NhS3NCWlhlcjFsRThIUXN1NG9TeUpVL2plbDlkN252aEVDUVFDNQplUUttUS94MjB3d0tVQStVd04yRWxBREg4QjdGSFIwQW9EbGYycG1pY0JkTk02bEZpdERVUWRpMkZRR1NSS0NtCjBMUExJQkZmazFOOXNZK0lsL0xsQWtFQTEyQTF0b0oycGgwWVdxZS9EQmN6Vy82NnhBdkJ4VlZ2VE1pcU1hZSsKS21oNmF4NzF5RFBEUkd2VG5qd28vUmJMOEFjN0t3WmhNVW15N1VvZW1DTDYyQT09' },
        body:{
            "clientIp": "46.101.225.192",
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