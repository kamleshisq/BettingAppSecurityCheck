// const { use } = require('../routes/userRoutes');
const User = require('./../model/userModel');
const Login = require('../model/loginLogs');
const Role = require('../model/roleModel');
const whiteLabel = require('../model/whitelableModel');
const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');
const { array } = require('joi');
// const { use } = require('../routes/userRoutes')

exports.createUser = catchAsync(async(req, res, next)=>{
    const user_type = await Role.findById(req.body.role);
    // console.log(user_type)
    // console.log(req.currentUser)
    if(req.currentUser.role_type != 1){
        req.body.whiteLabel = req.currentUser.whiteLabel
    }else if(req.currentUser.role_type == 1){
        req.body.whiteLabel = "betbhai"
    }
    const count = await whiteLabel.find({whiteLabelName:req.body.whiteLabel})
    if(count.length == 0){
        // console.log(req.body.whiteLabel)
        await whiteLabel.create({whiteLabelName:req.body.whiteLabel})
    }
    if(user_type.role_level < req.currentUser.role.role_level){
        return next(new AppError("You do not have permission to perform this action because user role type is higher", 404))
    }
    if(!req.currentUser.role.userAuthorization.includes(user_type.role_type)){
        return next(new AppError("You do not have permission to perform this action", 404))
    }
    if(!req.body.whiteLabel){
        return next(new AppError("please provide a white lable for user", 404))
    }
    req.body.role_type = user_type.role_type
    req.body.roleName = user_type.roleName
    req.body.parent_id = req.currentUser.id
    req.body.parent_user_type_id = req.currentUser.user_type_id
    req.body.parentUsers = []
    if(req.currentUser.parentUsers){
        req.body.parentUsers = req.currentUser.parentUsers
    }
    req.body.parentUsers.push(req.currentUser._id)
    // console.log(req.body)
    const newUser = await User.create(req.body);
    res.status(200).json({
        status:'success',
        User: newUser
    })
})

exports.deletUser = catchAsync(async(req, res, next) =>{
    let user
    if(req.currentUser.role.role_level == 1){
        user = await User.findById(req.body.id)
    }else{
        user = await User.findOne({_id:req.body.id, whiteLabel:req.currentUser.whiteLabel})
    }
    if(!user){
        return next(new AppError("There is no user with that id", 404))
    }
    // console.log(user.role.role_type)
    // console.log(req.currentUser.role.role_type)
    if(req.currentUser.role.role_type > user.role.role_type){
        return next(new AppError("You do not have permission to perform this action because user role type is higher", 404))
    }
    const deleteuser = await User.findByIdAndDelete(req.body.id)
    if(!deleteuser){
        res.status(404).json({
            status:'error',
            data:"Something went wrong"
        })
    }else{
        res.status(200).json({
            status:'success',
            data:null
        })
    }
})


exports.updateUserStatusCodeInactive = catchAsync(async(req, res, next) => {
    let user
    if(req.currentUser.role.role_level == 1){
        user = await User.findById(req.body.id)
    }else{
        user = await User.findOne({_id:req.body.id, whiteLabel:req.currentUser.whiteLabel})
    }
    if(!user){
        return next(new AppError("There is no user with taht id", 404))
    }
    
    // console.log(user.role.role_type)
    // console.log(req.currentUser.role.role_type)
    if(req.currentUser.role.role_type > user.role.role_type){
        return next(new AppError("You do not have permission to perform this action because user role type is higher", 404))
    }
    if(!user.isActive){
        res.status(200).json({
            status:"success",
            message:"user is already inactive"
        })
    }else{
        const userDetails = await User.findByIdAndUpdate(req.body.id, {isActive : false});

        if(!userDetails){
            res.status(404).json({
                status:'error',
                data:'Something went wrong'
            })
        }else{
            res.status(200).json({
                status:'success',
                user:userDetails
            })
        }
    }
})

exports.updateUserStatusCodeActive = catchAsync(async(req, res, next)=>{
    // const userDetails = await User.findById(req.body.id);
    let userDetails
    if(req.currentUser.role.role_level == 1){
        userDetails = await User.findById(req.body.id)
    }else{
        userDetails = await User.findOne({_id:req.body.id, whiteLabel:req.currentUser.whiteLabel})
    }
    if(!userDetails){
        return next(new AppError("There is no user with taht id", 404))
    }

    if(req.currentUser.role.role_type > userDetails.role.role_type){
        return next(new AppError("You do not have permission to perform this action because user role type is higher", 404))
    }
    if(userDetails.isActive){
        res.status(200).json({
            status:"success",
            message:"User is already active"
        })
    }else{
        const user = await User.findByIdAndUpdate(req.body.id, {isActive:true})
        if(!user){
            res.status(404).json({
                status:'error',
                message:"Ops, something went wrong please try again"
            })
        }else{
            res.status(200).json({
                status:"success",
                user
            })
        }
    }
})

exports.getAllUser = catchAsync(async(req, res, next) => {
    // console.log(req.currentUser)
    const roles = await Role.find({role_level: {$gt:req.currentUser.role.role_level}});
    let role_type =[]
    for(let i = 0; i < roles.length; i++){
        role_type.push(roles[i].role_type)
    }
    // console.log(req.currentUser.role.role_level)
    let users
    if(req.currentUser.role.role_level == 1){
        users = await User.find()
        // console.log(users)
    }else{
        users = await User.find({role_type:{$in:role_type}, whiteLabel:req.currentUser.whiteLabel})
    }
    // console.log(users)
    // const users = await User.find({role_type:{$in:role_type}})
    res.status(200).json({
        status:"success",
        result:users.length,
        users
    })
})

exports.updateUserStatusBattingLock = catchAsync(async(req, res, next) => {
    // const user1 = await User.findById(req.body.id)
    let user1
    if(req.currentUser.role.role_level == 1){
        user1 = await User.findById(req.body.id)
    }else{
        user1 = await User.findOne({_id:req.body.id, whiteLabel:req.currentUser.whiteLabel})
    }

    if(!user1){
        return next(new AppError("User not found", 404))
    }
    if(req.currentUser.role.role_type > user1.role.role_type){
        return next(new AppError("You do not have permission to perform this action because user role type is higher", 404))
    }
    if(user1.betLock){
        return res.status(200).json({
            status:"success",
            message:"User betting already unlocked."
        })
    }else{
        const user = await User.findByIdAndUpdate(req.body.id, {betLock:true},{
            new:true
        })
        res.status(200).json({
            status:"success",
            message:'User locked successfully',
            user
        })
    }
});

exports.updateUserStatusBattingUnlock = catchAsync(async(req, res, next) => {
    // const user1 = await User.findById(req.body.id)
    let user1
    if(req.currentUser.role.role_level == 1){
        user1 = await User.findById(req.body.id)
    }else{
        user1 = await User.findOne({_id:req.body.id, whiteLabel:req.currentUser.whiteLabel})
    }
    // console.log(req.body)
    if(!user1){
        return next(new AppError("User not found", 404))
    }
    if(req.currentUser.role.role_type > user1.role.role_type){
        return next(new AppError("You do not have permission to perform this action because user role type is higher", 404))
    }
    if(!user1.betLock){
        return res.status(200).json({
            status:"success",
            message:"User betting already locked."
        })
    }else{
    const user = await User.findByIdAndUpdate(req.body.id, {betLock:false},{
        new:true
    })
    res.status(200).json({
        status:"success",
        message:'User unlocked successfully',
        user
    })
}
});


exports.changePassword = catchAsync(async(req, res, next) => {
    // const user = await User.findById(req.body.id).select('+password')
    console.log(req.body)
    let user
    if(req.currentUser.role.role_level == 1){
        user = await User.findById(req.body.id).select('+password')
    }else{
        user = await User.findOne({_id:req.body.id, whiteLabel:req.currentUser.whiteLabel}).select('+password')
    }
    // // console.log(req.body.password)
    if(!user){
        return next(new AppError("User not found", 404))
    }
    if(req.currentUser.role.role_type > user.role.role_type){
        return next(new AppError("You do not have permission to perform this action because user role type is higher", 404))
    }
    
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save();
    res.status(200).json({
        status:'success',
        user
    })
});

exports.onLineUsers = catchAsync(async(req, res, next) => {
    let onlineuser
    if(req.currentUser.role.role_level == 1){
        onlineuser = await User.find({is_Online:true})
    }else{
        onlineuser = await User.find({is_Online:true, whiteLabel:req.currentUser.whiteLabel})
    }
    // const onlineuser = await User.find({is_Online:true})
    let users = []
    for(let i = 0; i < onlineuser.length; i++){
        if(req.currentUser.role.role_type < onlineuser[i].role.role_type){
            users.push(onlineuser[i])
        }
    }
    res.status(200).json({
        status:"success",
        users:users
    })
});

exports.searchUser = catchAsync(async (req, res, next) => {
    const search = req.query.search;
    if(!search){
        const users = await User.find({parent_id: req.currentUser._id});
        return res.status(200).json({
            status:'success',
            result:users.length,
            users
        })
    }
    const roles = await Role.find({role_level: {$gt:req.currentUser.role.role_level}});
    let role_type =[]
    for(let i = 0; i < roles.length; i++){
        role_type.push(roles[i].role_type)
    }
    // const users = await User.find({userName:new RegExp(search,"i"),role_type:{$in:role_type}})
    let users
    if(req.currentUser.role.role_level == 1){
        users = await User.find({userName:new RegExp(search,"i")})
    }else{
        users = await User.find({userName:new RegExp(search,"i"),role_type:{$in:role_type}, whiteLabel:req.currentUser.whiteLabel})
    }
    // const user = await User.find({role_type:{$in:role_type}})
    // console.log(users)
    // let Users=[]
    // for(let i = 0; i < users.length; i++){
    //     if(users[i].role.role_type > req.currentUser.role.role_type){
    //         Users.push(users[i])
    //     }
    // }
    // // console.log(Users)
    res.status(200).json({
        status:'success',
        result:users.length,
        users
    })
});

// exports.getOwnChild = catchAsync(async(req, res, next) => {
//     let child;
//     let Rows;
//     let me;
//     if(req.query.id == 0){
//         return next(new AppError('You do not have permission to perform this action',400))
//     }
//     if(req.query.id){
//         Rows = await User.count({parent_id: req.query.id,isActive:true})
//         child = await User.find({parent_id: req.query.id,isActive:true}).skip(0 * 100).limit(100);
//         me = await User.findById(req.query.id)
//     }else{
//         Rows = await User.count({parent_id: req.currentUser._id,isActive:true})
//         child = await User.find({parent_id: req.currentUser._id,isActive:true}).skip(0 * 100).limit(100);
//         me = await User.findById(req.currentUser._id)
//     }
//     res.status(200).json({
//         status:'success',
//         result:child.length,
//         rows:Rows / 100,
//         child,
//         me
//     })
// });

exports.getUserLoginLog = catchAsync(async(req, res, next) => {
    let loginlogs
    if(req.body.id){
        // console.log(req.body)
        loginlogs = await Login.find({user_id:req.body.id});
    }else{
        loginlogs = await Login.find();
        // console.log(loginlogs)
    }
    res.status(200).json({
        status:"success",
        results:loginlogs.length,
        loginlogs
    })
});

exports.getUser = catchAsync(async(req, res, next) => {
    const user = await User.findById(req.query.id);
    if(!user){
        return(next(new AppError('user not find with this id',400)))
    }
    if(user.role.role_level < req.currentUser.role.role_level){
        return(next(new AppError('You do not have permission to perform this action',400)))
    }

    res.status(200).json({
        status:'success',
        user
    })
})

exports.updateUser = catchAsync(async(req, res, next) => {
    // console.log(req.body)
    const user = await User.findById(req.body.id)
    const role = await Role.findById(req.body.role)
    if(!user){
        return(next(new AppError('user not find with this id',400)))
    }
    if(user.role.role_level < req.currentUser.role.role_level || role.role_level < req.currentUser.role.role_level){
        return(next(new AppError('You do not have permission to perform this action',400)))
    }
    let data = {
        name:req.body.name,
        userName:req.body.userName,
        role_type:role.role_type,
        role:req.body.role,
        roleName:role.roleName,
        exposureLimit:req.body.exposureLimit
    }

    const updatedUser = await User.findByIdAndUpdate(req.body.id,data,{new:true})
    // console.log(updatedUser)
    res.status(200).json({
        status:'success',
        user:updatedUser

    })
});

exports.createUser10000 = catchAsync(async(req, res, next) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    function generateString(length) {
        let result = "";
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }
    // console.log();

    // console.log('working')
    let array = []
    array.push("648193f1cb86f71eede0b201")
    // console.log(array)
    for(let i = 0; i < 15000; i++){
        let x = generateString(7)
        // console.log(x)
        let data = {
            userName : x,
            name : x,
            password : "123456789",
            passwordConfirm : "123456789",
            role : "648193c3cb86f71eede0b1fd",
            whiteLabel : "betbhaiTest",
            role_type : 5,
            roleName : "user",
            parent_id : "648193f1cb86f71eede0b201",
            parent_user_type_id : 1,
            parentUsers : array
        }
        
        await User.create(data)
    }
    res.status(200).json({
        status:"success"
    })
});

exports.currentUserPasswordupdate = catchAsync(async(req, res, next) => {
    const user = await User.findById(req.currentUser._id).select('+password')
    if(!await user.correctPassword(req.body.oldPass,user.password)){
        return next(new AppError('your old password is wrong',400))
    }
    // console.log(user)
    if(user.password === req.body.newPass){
        return next(new AppError("Please Provide a new password"))
    }
    user.password = req.body.newPass
    user.passwordConfirm = req.body.confPass
    if(req.body.newPass != req.body.confPass){
        return next(new AppError("Please Provide a same passwords"))
    }
    await user.save();
    res.status(200).json({
        status:'success',
        user
    })
});

exports.getOwnChild = catchAsync(async(req, res, next) => {
    let child;
    let Rows;
    let me;
    let page = req.query.page;
    if(!page){
        page = 0;
    }
    let limit = 10;
    // console.log(req.query)

    if(page < 0){
        return next(new AppError('page should positive',404))
    }
    if(req.query.id == 0){
        return next(new AppError('You do not have permission to perform this action',400))
    }
    if(req.query.id){
        me = await User.findById(req.query.id)
        if(!me){
            return next(new AppError('user not find',400))
        }
        if(me.role.role_level < req.currentUser.role.role_level){
            return next(new AppError('You do not have permission to perform this action',400))
        }
        Rows = await User.count({parent_id: req.query.id,isActive:true})
        child = await User.find({parent_id: req.query.id,isActive:true}).skip(page * limit).limit(limit);
    }else{
        Rows = await User.count({parent_id: req.currentUser._id,isActive:true})
        child = await User.find({parent_id: req.currentUser._id,isActive:true}).skip(page * limit).limit(limit);
        me = await User.findById(req.currentUser._id)
    }
    res.status(200).json({
        status:'success',
        result:child.length,
        rows:Rows / limit,
        child,
        me
    })
});


//for user
exports.edit = catchAsync(async(req, res, next) => {
   
    // console.log(req.body)
    const user = await User.findById(req.body.id)
    if(!user){
        return(next(new AppError('user not find with this id',400)))
    }
    let data = {
        name:req.body.name,
        userName:req.body.userName,
    }
    // console.log(data)
    const updatedUser = await User.findByIdAndUpdate(req.body.id,data,{new:true})
    res.status(200).json({
        status:'success',
        user:updatedUser

    })
})