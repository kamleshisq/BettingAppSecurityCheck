// const { use } = require('../routes/userRoutes');
const User = require('./../model/userModel');
const Login = require('../model/loginLogs');
const Role = require('../model/roleModel');
const whiteLabel = require('../model/whitelableModel');
const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');
const settlementModel = require("../model/sattlementModel");
const accountStatement = require("../model/accountStatementByUserModel");
const Benners = require('../model/bannerModel')
const Promossion = require('../model/promotion')
const PageModel = require('../model/pageModel')
const sliderModel = require('../model/sliderModel')
const verticalMenuModel = require("../model/verticalMenuModel");
const gamerulesModel = require('../model/gamesRulesModel')
const gamemodel = require('../model/gameModel')
const globalSettingModel = require('../model/globalSetting')
const footerInfomodel =  require('../model/footerInfoModel')
const socialInfoModel = require('../model/socialMediaLinks');
const bycrypt = require('bcrypt');

exports.isOperator = catchAsync(async(req, res, next) => {

    // console.log(req.currentUser, "req.currentUserreq.currentUser")
    if(req.currentUser && req.currentUser.roleName ==='Operator'){
        let parentUser = await User.findById(req.currentUser.parent_id)
        req.operator = req.currentUser
        req.currentUser = parentUser
    }
    next()
})

exports.createUser = catchAsync(async(req, res, next)=>{
    // console.log(req.body)
    // console.log(req.body, "req.bodyreq.bodyreq.bodyreq.bodyreq.body")
    const user_type = await Role.findById(req.body.role);
    // console.log(user_type)
    // console.log(req.currentUser)
    // console.log(req.body)
    if(req.currentUser.role_type != 1){
        req.body.whiteLabel = req.currentUser.whiteLabel
    }
    const count = await whiteLabel.find({whiteLabelName:req.body.whiteLabel})
    if(count.length == 0){
        // console.log(req.body.whiteLabel)
        if(req.body.B2C && req.body.B2C === "on"){
            let data = {
                whiteLabelName:req.body.whiteLabel,
                B2C_Status:true
            }
            await whiteLabel.create(data)
        }else{
            await whiteLabel.create({whiteLabelName:req.body.whiteLabel})
        }
            let banners = await Benners.find({whiteLabelName:"1"})
            let promosions = await Promossion.find({whiteLabelName:"1"})
            let pages = await PageModel.find({whiteLabelName:"1"})
            let sliders = await sliderModel.find({whiteLabelName:"1"})
            let verticalMenus = await verticalMenuModel.find({whiteLabelName:"1"})
            let gamerules = await gamerulesModel.find({whiteLabelName:"1"})
            let games = await gamemodel.find({whiteLabelName:"1"})
            let globalsetting = await globalSettingModel.findOne({whiteLabel:"1"})
            let footerSettings = await footerInfomodel.find({whiteLabelName:"1"})
            let socialInfo = await socialInfoModel.find({whiteLabelName:"1"})
            // let promossions = await Pro
            let newbanners = []
            let newpromosions = []
            let newpages = []
            let newsliders = []
            let newverticalMenus = []
            let newgamerules = []
            let newgames = []

            let newglobalsetting = {
                logo1:globalsetting.logo1,
                logo2:globalsetting.logo2,
                contactNumber:globalsetting.contactNumber,
                email:globalsetting.email,
                whiteLabel:req.body.whiteLabel
            }

            banners.map(ele => {
                let newurl;
                let url = ele.url;
                let result = url.match(/\/\/([^/]+)/);
                if (result) {
                    let extractedWord = result[1];
                    newurl = url.replace(extractedWord, req.body.whiteLabel);
                    // console.log(newurl,'==>newurl')
                } else {
                    newurl = ele.url
                    console.log("No match found");
                }
                newbanners.push({
                    bannerName:ele.bannerName,
                    url:newurl,
                    banner:ele.banner,
                    status:ele.status,
                    whiteLabelName:req.body.whiteLabel
                })
            })

            newFooter = []
            footerSettings.map(ele => {
                newFooter.push({
                    name:ele.name,
                    description:ele.description,
                    banner:ele.banner,
                    link:ele.link,
                    whiteLabelName:req.body.whiteLabel
                })
            })

            newSocial = []
            socialInfo.map(ele => {
                newSocial.push({
                    name:ele.name,
                    img:ele.img,
                    link:ele.link,
                    whiteLabelName:req.body.whiteLabel
                })
            })
            promosions.map(ele => {
                newpromosions.push({
                    position:ele.position,
                    Image:ele.Image,
                    status:ele.status,
                    video:ele.video,
                    click:ele.click,
                    link:ele.link,
                    whiteLabelName:req.body.whiteLabel
                })
            })
            pages.map(ele => {
                newpages.push({
                    Name:ele.Name,
                    details:ele.details,
                    heading:ele.heading,
                    whiteLabelName:req.body.whiteLabel
                })
            })
            sliders.map(ele => {
                newsliders.push({
                    name:ele.name,
                    images:ele.images,
                    mainUrl:ele.mainUrl,
                    Number:ele.Number,
                    backGroundImage:ele.backGroundImage,
                    status:ele.status,
                    whiteLabelName:req.body.whiteLabel
                })
            })
            verticalMenus.map(ele => {
                newverticalMenus.push({
                    menuName:ele.menuName,
                    num:ele.num,
                    url:ele.url,
                    page:ele.page,
                    status:ele.status,
                    whiteLabelName:req.body.whiteLabel
                })
            })
            gamerules.map(ele => {
                newgamerules.push({
                    name:ele.name,
                    description:ele.description,
                    whiteLabelName:req.body.whiteLabel
                })
            })
            games.map(ele => {
                newgames.push({
                    game_name:ele.game_name,
                    provider_name:ele.provider_name,
                    sub_provider_name:ele.sub_provider_name,
                    category:ele.category,
                    status:true,
                    game_id:ele.game_id,
                    game_code:ele.game_code,
                    url_thumb:ele.url_thumb,
                    whiteLabelName:req.body.whiteLabel
                })
            })

           
            // console.log(newbanners,'==>newbanners')
            await Benners.insertMany(newbanners)
            await footerInfomodel.insertMany(newFooter)
            await socialInfoModel.insertMany(newSocial)
            await Promossion.insertMany(newpromosions)
            await PageModel.insertMany(newpages)
            await sliderModel.insertMany(newsliders)
            await verticalMenuModel.insertMany(newverticalMenus)
            await gamerulesModel.insertMany(newgamerules)
            await gamemodel.insertMany(newgames)
            await globalSettingModel.create(newglobalsetting)
    }
    if((user_type.role_level < req.currentUser.role.role_level) && (user_type.role_level !== 5)){
        if(req.currentUser.roleName != "Operator"){
            return next(new AppError("You do not have permission to perform this action because user role type is higher", 404))
        }
    }
    // if(!req.currentUser.role.userAuthorization.includes(user_type.role_type)){
    //     return next(new AppError("You do not have permission to perform this action", 404))
    // }

    if(user_type.role_level === 5){
        if(req.currentUser.maxLimitForChildUser && req.currentUser.maxLimitForChildUser < req.body.Credit){
            return next(new AppError(`Your limit for user credit Reference is less then ${req.currentUser.maxLimitForChildUser}`, 404))
        }
    }
    if(!req.body.whiteLabel){
        return next(new AppError("please provide a white lable for user", 404))
    }
    req.body.role_type = user_type.role_type
    req.body.roleName = user_type.roleName
    req.body.parent_id = req.currentUser.id
    // req.body.parent_user_type_id = req.currentUser.user_type_id
    req.body.userName = req.body.userName.toLowerCase();
    req.body.parentUsers = []
    if(req.currentUser.parentUsers){
        req.body.parentUsers = req.currentUser.parentUsers
    }
    // console.log(req.body.parentUsers, '+==> parentsUser')
    req.body.parentUsers.push(req.currentUser._id)
    // console.log(req.body.parentUsers, '+==> parentsUser')

    // console.log(req.body)
    if(req.body.share){
        if(req.body.share < 0){
            return next(new AppError("Please provide a valid share"))
        }
        req.body.Share = req.body.share
    }
    if(req.body.Visible){
        if(req.body.Visible < 0){
            return next(new AppError("Please provide a valid  Visible"))
        }
        req.body.myShare = req.body.Visible
    }
    if(req.body.roleName !== 'user'){
        req.body.passcode = await bycrypt.hash('123456', 12)
    }
    // console.log(req.body, "req.bodyreq.bodyreq.bodyreq.bodyreq.body")
    // console.log(req.body, 'req.bodyreq.bodyreq.body')
    let checkUserExist = await User.findOne({userName:req.body.userName})
    if(checkUserExist){
        return next(new AppError("Ops, User Name is already exists", 500))
    }
    if(req.body.Credit != '' && req.currentUser.availableBalance < req.body.Credit){
        return next(new AppError("Insufficient Credit Limit !"))
    }


    const newUser = await User.create(req.body);
    // if(req.body.roleName === "Admin" || req.body.roleName === "Super-Duper-Admin"){
    //    await settlementModel.create({userId:newUser.id})
    // }
    if(req.body.Credit != ''){
        newUser.balance = parseFloat(req.body.Credit);
        newUser.availableBalance = parseFloat(req.body.Credit);
        newUser.creditReference = parseFloat(req.body.Credit);
        req.currentUser.availableBalance = parseFloat(req.currentUser.availableBalance - req.body.Credit);
        req.currentUser.downlineBalance = parseFloat(req.currentUser.downlineBalance) + parseFloat(req.body.Credit);
        const updatedChild = await User.findByIdAndUpdate(newUser.id, newUser,{
            new:true
        });
        const updatedparent =  await User.findByIdAndUpdate(req.currentUser.id, {availableBalance:req.currentUser.availableBalance, downlineBalance:req.currentUser.downlineBalance});
        // const updatedparent =  await User.findByIdAndUpdate(req.currentUser.id, req.currentUser);
        if(!updatedChild || !updatedparent){
            return next(new AppError("Ops, Something went wrong While Fund Debit Please try again later", 500))
        }
        let childAccStatement = {}
        let ParentAccStatement = {}
        let date = Date.now()
        childAccStatement.child_id = newUser.id;
        childAccStatement.user_id = newUser.id;
        childAccStatement.parent_id = req.currentUser.id;
        childAccStatement.description = 'Chips credited to ' + newUser.name + '(' + newUser.userName + ') from parent user ' + req.currentUser.name + "(" + req.currentUser.userName + ")";
        childAccStatement.creditDebitamount = parseFloat(req.body.Credit);
        childAccStatement.balance = newUser.availableBalance;
        childAccStatement.date = date
        childAccStatement.userName = newUser.userName
        childAccStatement.role_type = newUser.role_type
        // childAccStatement.Remark = req.body.remark
        const accStatementChild = await accountStatement.create(childAccStatement)
        if(!accStatementChild){
            return next(new AppError("Ops, Something went wrong While Fund Debit Please try again later", 500))
        }

        ParentAccStatement.child_id = newUser.id;
        ParentAccStatement.user_id = req.currentUser.id;
        ParentAccStatement.parent_id = req.currentUser.id;
        ParentAccStatement.description = 'Chips credited to ' + newUser.name + '(' + newUser.userName + ') from parent user ' + req.currentUser.name + "(" + req.currentUser.userName + ")";
        ParentAccStatement.creditDebitamount = -parseFloat(req.body.Credit);
        ParentAccStatement.balance = req.currentUser.availableBalance;
        ParentAccStatement.date = date
        ParentAccStatement.userName = req.currentUser.userName;
        ParentAccStatement.role_type = req.currentUser.role_type
        // ParentAccStatement.Remark = req.body.remark
        const accStatementparent = await accountStatement.create(ParentAccStatement)
        if(!accStatementparent){
            return next(new AppError("Ops, Something went wrong Please try again later", 500))
        }
    }
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
    if((req.currentUser.role.role_type > user.role.role_type) && (user.role.role_type !== 5)){
        if(req.currentUser.roleName != "Operator"){
        return next(new AppError("You do not have permission to perform this action because user role type is higher", 404))
        }
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
    if((req.currentUser.role.role_type > user.role.role_type) && (user.role.role_type !== 5)){
        if(req.currentUser.roleName != "Operator"){
        return next(new AppError("You do not have permission to perform this action because user role type is higher", 404))
        }
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
    let userDetails = await User.findById(req.body.id)
    if(!userDetails){
        return next(new AppError("There is no user with taht id", 404))
    }

    // console.log(req.body, "Body")
    try{
        if(req.body.status === "suspended"){
            await User.findByIdAndUpdate(req.body.id, {isActive:false, betLock:true})
            await User.updateMany({parentUsers:req.body.id}, {isActive:false})
            await User.updateMany({parentUsers:req.body.id}, {betLock:true})
        }else if (req.body.status === "active"){
            await User.findByIdAndUpdate(req.body.id, {isActive:true, betLock:false})
            await User.updateMany({parentUsers:req.body.id}, {isActive:true})
            await User.updateMany({parentUsers:req.body.id}, {betLock:false})
        }else if (req.body.status === "betLock"){
            await User.findByIdAndUpdate(req.body.id, {isActive:true, betLock:true})
            await User.updateMany({parentUsers:req.body.id}, {isActive:true})
            await User.updateMany({parentUsers:req.body.id}, {betLock:true})
        }
        res.status(200).json({
            status:"success"
        })
    }catch(err){
        console.log(err)
        return next(new AppError("Please try again leter", 404))
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
    if((req.currentUser.role.role_type > user1.role.role_type)  && (user1.role.role_type !== 5)){
        if(req.currentUser.roleName != "Operator"){
        return next(new AppError("You do not have permission to perform this action because user role type is higher", 404))
        }
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
    if((req.currentUser.role.role_type > user1.role.role_type)  && (user1.role.role_type !== 5)){
        if(req.currentUser.roleName != "Operator"){
        return next(new AppError("You do not have permission to perform this action because user role type is higher", 404))
        }
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

    let user = await User.findOne({_id:req.body.id}).select('+password')
    // // console.log(req.body.password)
    if(!user){
        return next(new AppError("User not found", 404))
    }
    if((req.currentUser.role.role_type > user.role.role_type) && (user.role.role_type !== 5)){
        if(req.currentUser.roleName != "Operator"){
        return next(new AppError("You do not have permission to perform this action because user role type is higher", 404))
        }
    }
    
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordchanged = true
    await user.save();
    res.status(200).json({
        status:'success',
        user
    })
});
exports.changePasswordAdmin = catchAsync(async(req, res, next) => {
    let user
    if(req.operator){
        user = await User.findOne({_id:req.operator._id}).select('+password')
    }else{
        user = await User.findOne({_id:req.currentUser._id}).select('+password')

    }
    console.log(req.body, user)
    if(!user){
        return next(new AppError("User not found", 404))
    }
    if(!await user.correctPassword(req.body.oldpsw, user.password)){
        res.status(404).json({
            status:'fail',
            message:"your old password is wrong"
        })
    }

    if(req.body.psw !== req.body.cpsw){
        res.status(404).json({
            status:'fail',
            message:"your new password and confirm password is not match"
        })
    }

     if(req.body.oldpsw == req.body.psw){
        res.status(404).json({
            status:'fail',
            message:"Please eneter different password"
        })
    }
    // if(await User.passwordConfirm(req.bod))
    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
    let passcode = randomString(6, '0123456789');  
    let passcodeexist = true
    while(passcodeexist){
        if(!await user.correctPasscode(passcode, user.passcode)){
            passcode = randomString(6, '0123456789');
            passcodeexist = false
        }
        
    }     
    user.passcode = await bycrypt.hash(passcode, 12)            
    user.password = req.body.psw
    user.passwordConfirm = req.body.cpsw
    user.passwordchanged = false
    await user.save();
    res.status(200).json({
        status:'success',
        user,
        passcode
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
//         Rows = await User.countDocuments({parent_id: req.query.id,isActive:true})
//         child = await User.find({parent_id: req.query.id,isActive:true}).skip(0 * 100).limit(100);
//         me = await User.findById(req.query.id)
//     }else{
//         Rows = await User.countDocuments({parent_id: req.currentUser._id,isActive:true})
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
    if(await user.correctPassword(req.body.newPass,user.password)){
        return next(new AppError("Please Provide a new password"))
    }
    user.password = req.body.newPass
    user.passwordConfirm = req.body.confPass
    user.passwordchanged = false
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

    try{
        // console.log(req.currentUser, "req.currentUserreq.currentUserreq.currentUserreq.currentUser")
        let child;
        let Rows;
        let me;
        let page = req.query.page;
        let operationId;
        if(req.currentUser.roleName == 'Operator'){
            operationId = req.currentUser.parent_id
        }else{
            operationId = req.currentUser._id
        }
        if(!page){
            page = 0;
        }
        let limit = 10;
        // console.log(req.query)
        // console.log(req.query, "req.queryreq.queryreq.queryreq.query")
        // console.log(operationId, "operationIdoperationIdoperationIdoperationIdoperationId")
        if(page < 0){
            return next(new AppError('page should positive',404))
        }
        if(req.query.id == 0){
            return next(new AppError('You do not have permission to perform this action',400))
        }
        if(req.query.id){
            me = await User.findById(req.query.id)
            if(!me){
                return next(new AppError('user not found'))
            }
            // if(me.role.role_level < req.currentUser.role.role_level){
            //     return next(new AppError('You do not have permission to perform this action',400))
            // }
            Rows = await User.countDocuments({parent_id: req.query.id})
            child = await User.find({parent_id: req.query.id,roleName:{$ne:'Operator'}}).skip(page * limit).limit(limit);
        }else{
            Rows = await User.countDocuments({parent_id: operationId})
            child = await User.find({parent_id: operationId,roleName:{$ne:'Operator'}}).skip(page * limit).limit(limit);
            me = await User.findById(req.currentUser._id)
        }
        res.status(200).json({
            status:'success',
            result:child.length,
            rows:Rows / limit,
            child,
            me
        })
    }catch(err){
        console.log(err, "ERROORR")
    }
    
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