const User = require('../model/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const JWT = require('jsonwebtoken');
const Joi = require('joi');
const util = require('util');
const loginLogs = require('../model/loginLogs');
const Role = require("../model/roleModel");
const paymentReportModel = require('../model/paymentreport')
const userWithReq = require('../model/withdrowReqModel');
const whiteLabelMOdel = require('../model/whitelableModel');
const bycrypt = require('bcrypt');
const logindatauser = require('../model/loginuserdata')

// const sessionStorage = require('sessionstorage-for-nodejs');
const axios = require('axios')

const createToken = A => {
    return JWT.sign({A}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRES * 1000 *2 *30
    })
}

function parseCookies(cookieString) {
    const cookies = {};
    cookieString.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      const name = parts[0].trim();
      const value = parts[1].trim();
      cookies[name] = value;
    });
    return cookies;
  }

const createSendToken = async (user, statuscode, res, req)=>{
    // const existingToken = await loginLogs.findOne({ user_id: user._id, isOnline: true });
    // if (existingToken) {
    //     // User is already logged in, handle as needed (e.g., invalidate session, prevent login)
    //     return res.status(403).json({
    //         status: "error",
    //         message: "User is already logged in"
    //     });
    // }

    const token = createToken(user._id);
    // req.session.userId = user._id;
    // req.token = token
    const cookieOption = {
        expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN *1000*2 *30)),
        httpOnly: true,
        // secure: true
        }
    // if(process.env.NODE_ENV === "production"){
    //     cookieOption.secure = true
    // }
    // if(req.originalUrl.startsWith('/adminlogin')){
    //     res.cookie('ADMIN_JWT', token, cookieOption)
    // }else if(req.originalUrl.startsWith('/sdmlogin')){
    //     res.cookie('SDM_JWT', token, cookieOption)
        
    // }else if(req.originalUrl.startsWith('/smlogin')){
    //     res.cookie('SM_JWT', token, cookieOption)
    // }else if(req.originalUrl.startsWith('/dmlogin')){
    //     res.cookie('DM_JWT', token, cookieOption)
    // }else if(req.originalUrl.startsWith('/agentlogin')){
    //     res.cookie('AGENT_JWT', token, cookieOption)
    // }
    res.cookie('ADMIN_JWT', token, cookieOption)
    // console.log(res);
    user.password = undefined;
    // console.log(req.socket.localAddress)
    // console.log(req.headers['user-agent'])
    // req.loginUser = user
    let time = Date.now()
    await loginLogs.create({user_id:user._id,
                            userName:user.userName, 
                            role_Type:user.role_type,
                            login_time:time, 
                            isOnline: true, 
                            ip_address:global.ip, 
                            session_id:token, 
                            device_info:req.headers['user-agent']})
    global._loggedInToken.push({token:token,time:time})
    
    // let childrenArr = await User.distinct('userName', { parentUsers: user._id, role_type: 5 });
    // let paymentreqcount = await paymentReportModel.countDocuments({username:{$in:childrenArr},status:'pending'})
    // console.log(global._loggedInToken)
    // const roles = await Role.find({role_level: {$gt:user.role.role_level}})
    res.status(200).json({
        status:"success",
        token,
        data: {
            user
            // paymentreqcount
        }
    })
}
const user_createSendToken = async (user, statuscode, res, req)=>{
    // const existingToken = await loginLogs.findOne({ user_id: user._id, isOnline: true });
    // if (existingToken) {
    //     // User is already logged in, handle as needed (e.g., invalidate session, prevent login)
    //     return res.status(403).json({
    //         status: "error",
    //         message: "User is already logged in"
    //     });
    // }

    const token = createToken(user._id);

    // req.session.token = token;
    // req.token = token
    const cookieOption = {
        expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN*1000 * 60)),
        httpOnly: true,
        secure: false,
        // sameSite: 'None', 
        path: '/'
        }
        // const sessionId = user.id
    res.cookie('JWT', token, cookieOption)
    // res.cookie('sessionId', sessionId);

    // console.log(res);
    user.password = undefined;
    // console.log(req.socket.localAddress)
    // console.log(req.headers['user-agent'])
    // req.loginUser = user
    let time = Date.now()
    if(user.roleName != 'DemoLogin'){
        await loginLogs.updateMany({userName:user.userName}, {isOnline: false})
    }
    await loginLogs.create({user_id:user._id,
                            userName:user.userName, 
                            role_Type:user.role_type,
                            login_time:time, 
                            isOnline: true, 
                            ip_address:global.ip, 
                            session_id:token, 
                            device_info:req.headers['user-agent'],
                            sessionId:user.id
                        })
    global._loggedInToken.push({token:token,time:time})
    // console.log(global._loggedInToken)
    // const roles = await Role.find({role_level: {$gt:user.role.role_level}})
    res.status(200).json({
        status:"success",
        token,
        data: {
            user,
            sessionId:user.id
        }
    })
}


exports.createAndLoginUser = catchAsync( (async(req, res, next) => {
    // console.log(req.body, "body")
    const { recaptchaToken } = req.body;
    // console.log(recaptchaToken, "recaptchaTokenrecaptchaTokenrecaptchaToken")
    const response = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        {
          secret: '6LcFdCEpAAAAAImXcw73zbjF0Epdpus_4HvxhPCP',
          response: req.body['g-recaptcha-response'],
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
    // console.log(response.data, "response.data")

    if(response.data.success){
        let check = await whiteLabelMOdel.findOne({whiteLabelName:process.env.whiteLabelName})
        if(check && check.B2C_Status){

            let parentUser = await User.findOne({whiteLabel:process.env.whiteLabelName, roleName: 'Super-Duper-Admin'})
            if(parentUser){
                if(req.body.password !== req.body.passwordConfirm){
                    return next(new AppError('Passwords are not matching', 404))
                }else{
                    let parentArray = parentUser.parentUsers
                    parentArray.push(parentUser.id)
                    let userData = {
                        userName : req.body.userName.toLowerCase(),
                        name : req.body.name,
                        roleName : 'user',
                        whiteLabel:process.env.whiteLabelName,
                        parent_id : parentUser.id,
                        role : '6492fe4fd09db28e00761694',
                        role_type:5,
                        password:req.body.password,
                        passwordConfirm:req.body.passwordConfirm,
                        parentUsers:parentArray,
                        contact:req.body.contectNumber,
                        email:req.body.email
                    }
        
                    let new_USer = await User.create(userData)
                    if(!new_USer){
                        return next(new AppError('Please try again later', 404))
                    }else{
                        // await User.findOneAndUpdate({_id:new_USer._id}, {is_Online:true});
                        // createSendToken(new_USer, 200, res, req);
                        res.status(200).json({
                            status:'success'
                        })
                    }
        
                }
            }else{
                return next(new AppError('Please try again later', 404))
            }
        }else{
            return next(new AppError('Please try again later', 404))
        }
    }else{
        return next(new AppError('Please verify captcha', 404))
    }
}))

exports.login = catchAsync (async(req, res, next) => {
    // console.log(req.body)
    let {
		userName,
		password
	} = req.body;
    const loginSchema = Joi.object({
		userName: Joi.string().required(),
		password: Joi.string().required(),
		// g_captcha: Joi.optional()
	});
    userName = userName.toLowerCase()
    const validate = loginSchema.validate(req.body);
    // console.log(validate)
    if(validate.error){
        // console.log("working")
        res.status(404).json({
            status:"error",
            message:validate.error.details[0].message
        })
    }else{
        const user = await User.findOne({userName}).select('+password');
        let whiteLabel = process.env.whiteLabelName
        
        if(user && user.whiteLabel != whiteLabel && user.role_type !== 1){
            res.status(404).json({
                status:'error',
                message:"not a valid user login"
            })
        }else if(user.role_type === 1 && whiteLabel !=="dev.ollscores.com"){
            res.status(404).json({
                status:'error',
                message:"not a valid user login"
            })
        }
        else if(!user || !(await user.correctPassword(password, user.password))){
            res.status(404).json({
                status:'error',
                message:"Please provide valide user and password"
            })
        }else if(user.role_type == 5){
            // console.log(user.role_type)
            res.status(404).json({
                status:'error',
                message:"You not have permition to login"
            })
        }else if(!user.isActive){
            res.status(404).json({
                status:'error',
                message:"Your account is inactive"
            })
        }
        else{
            await User.findOneAndUpdate({_id:user._id}, {is_Online:true});
            // createSendToken(user, 200, res, req);
            function randomString(length, chars) {
                var result = '';
                for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
                return result;
            }
            var token = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'); 
            token += Date.now().toString()
            token = await bycrypt.hash(token, 12)
            console.log(token,'token')
            let time = Date.now()
            await loginLogs.create({user_id:user._id,
                                    userName:user.userName, 
                                    role_Type:user.role_type,
                                    login_time:time, 
                                    isOnline: true, 
                                    ip_address:global.ip, 
                                    session_id:token, 
                                    device_info:req.headers['user-agent']})
            global._loggedInToken.push({token:token,time:time})
            await logindatauser.create({userId:user._id,date:time,token})
            res.status(200).json({
                status:'success',
                token,
                user
            })

        }
    }
})


exports.checkPass = catchAsync(async(req, res, next) => {
    const user = await User.findOne({userName:req.currentUser.userName}).select('+password');
    if(!req.body.Password){
       return res.status(404).json({
            status:'error',
            message:"Please provide valid password"
        })
    }
    const passcheck = await user.correctPassword(req.body.Password, user.password)
    if(!user || !(passcheck)){
       return res.status(404).json({
            status:'error',
            message:"Please provide valide password"
        })
    }
    next()
})

exports.checkPasscode = catchAsync(async(req, res, next) => {
    const user = await User.findOne({userName:req.currentUser.userName}).select('+password');
    if(!req.body.Password){
       return res.status(404).json({
            status:'error',
            message:"Please provide valid password"
        })
    }
    const passcheck = await user.correctPasscode(req.body.Password, user.passcode)
    if(!user || !(passcheck)){
       return res.status(404).json({
            status:'error',
            message:"Please provide valide password"
        })
    }
    next()
})

exports.isProtected = catchAsync( async (req, res, next) => {
    let token 
    let loginData = {}
    let whiteLabelData = await whiteLabelMOdel.findOne({whiteLabelName:process.env.whiteLabelName})
    if(whiteLabelData){
        res.locals.B2C_Status = whiteLabelData.B2C_Status
    }else{
        res.locals.B2C_Status = false
    }
    // console.log('isProtectedisProtectedisProtectedisProtected')
    // if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    //     token = req.headers.authorization.split(' ')[1].split("=")[1];
    //     if(!token){
    //         token = req.headers.authorization.split(' ')[1]
    //     }
    //     if(!token){
    //         token = req.headers.authorization.split('  ')[1].split("=")[1];
    //     }
    // }else if(req.headers.cookie){
    //     token = parseCookies(req.headers.cookie).ADMIN_JWT;
    //     if(req.headers.cookie){
    //         loginData.Token = req.headers.cookie.split(';')[0]
    //         if(!loginData.Token.startsWith('ADMIN_JWT')){
    //             loginData.Token = req.headers.cookie.split(';')[1]
    //         }
    //     }else{
    //         loginData.Token = ""
    //     }
        
        
    // }

    if(req.method == 'GET'){
        token = req.query.sessiontoken
    }else if(req.method == 'POST'){
        token = req.body.sessiontoken
        delete req.body['sessiontoken']
    }


    if(!token){
        // console.log('WORKING1')
        req.app.set('token', null);
        req.app.set('User', null);
        return res.redirect('/adminlogin')
    }
    loginData.Token = token
    const tokenId = await loginLogs.findOne({session_id:token})
    if( tokenId &&!tokenId.isOnline){
        // console.log('working12121')
        req.app.set('token', null);
        req.app.set('User', null);
        return res.redirect('/adminlogin')
    }


    const decoded = await logindatauser.findOne({token});
    if(!decoded){
        req.app.set('token', null);
        req.app.set('User', null);
        return res.status(404).json({
            status:"success",
            message:'the user belonging to this token does no longer available'
        })
    }
    const currentUser = await User.findById(decoded.userId);
    if(!currentUser){
        req.app.set('token', null);
        req.app.set('User', null);
        return res.redirect('/adminlogin')
    }
    if(currentUser.passwordchanged && req.originalUrl !== '/api/v1/users/changeUserPasswordAdmin'){
        return res.redirect(`/resetPassword?sessiontoken=${token}`)
    }
    let whiteLabel = process.env.whiteLabelName
    let childrenArr = []
    let paymentreqcount = 0
    let WithdrawReqCount = 0
    if(currentUser.role.roleName === "Super-Duper-Admin"){
        childrenArr = await User.distinct('userName', { parentUsers: currentUser._id, role_type: 5 });
        // console.log(childrenArr, "childrenArrchildrenArrchildrenArr")
        paymentreqcount = await paymentReportModel.countDocuments({username:{$in:childrenArr},status:'pending'})
        WithdrawReqCount = await userWithReq.countDocuments({username:currentUser.userName, reqStatus:'pending'})
    }
    if(currentUser.roleName != "DemoLogin"){
        // console.log(currentUser.whiteLabel, whiteLabel, currentUser.role_type,"whiteLabelwhiteLabelwhiteLabelwhiteLabelwhiteLabelwhiteLabelwhiteLabelwhiteLabel")
        // console.log(currentUser.whiteLabel !== whiteLabel && currentUser.role_type !== 1)
        if(currentUser.whiteLabel !== whiteLabel && currentUser.role_type !== 1){
            req.app.set('token', null);
            req.app.set('User', null);
            return res.redirect('/adminlogin')
        }else if(!currentUser){
            req.app.set('token', null);
            req.app.set('User', null);
            return res.redirect('/adminlogin')
        }else if(!currentUser.isActive){
            req.app.set('token', null);
            req.app.set('User', null);
            return res.redirect('/adminlogin')
        }else if(!currentUser.is_Online){
            req.app.set('token', null);
            req.app.set('User', null);
            return res.redirect('/adminlogin')
        }
    }
    
    loginData.User = currentUser
    res.locals.loginData = loginData
    res.locals.paymentreqcount = paymentreqcount
    res.locals.WithdrawReqCount = WithdrawReqCount
    res.locals.sessiontoken = token
    req.currentUser = currentUser
    req.token = token
    req.currentUserUnique = currentUser
    req.app.set('token', token);
    req.app.set('User', currentUser);
    next()
});



exports.isProtected_User = catchAsync( async (req, res, next) => {
    let token 
    let loginData = {}
    res.locals.loginData = undefined
    res.locals.whiteLabel = process.env.whiteLabelName
    let whiteLabelData = await whiteLabelMOdel.findOne({whiteLabelName:process.env.whiteLabelName})
    if(whiteLabelData){
        res.locals.B2C_Status = whiteLabelData.B2C_Status
    }else{
        res.locals.B2C_Status = false
    }
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1].split("=")[1];
        if(!token){
            token = req.headers.authorization.split(' ')[1]
        }
    }else if(req.headers.cookie){
        token = parseCookies(req.headers.cookie).JWT;
    }
    // console.log(loginData.Token, "hfhfghfhfhfhf")
    if(!token){
        req.app.set('token', null);
        req.app.set('User', null);
        return res.redirect('/')
        // return next(new AppError('Please log in to access', 404))
    }
    if(token == "loggedout"){
        req.app.set('token', null);
        req.app.set('User', null);
        return res.redirect('/')
    }

    const tokenId = await loginLogs.findOne({session_id:token})
    if(!tokenId){
        req.app.set('token', null);
        req.app.set('User', null);
        return res.redirect('/')
    }
    if(!tokenId.isOnline){
        req.app.set('token', null);
        req.app.set('User', null);
        return res.redirect('/')
    }
    const decoded = await util.promisify(JWT.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.A);
    if(!currentUser){
        req.app.set('token', null);
        req.app.set('User', null);
        return res.redirect('/')
    }
    
    if(currentUser.roleName != "DemoLogin"){
        if(currentUser.whiteLabel !== process.env.whiteLabelName && currentUser.role_type !== 1){
            req.app.set('token', null);
        req.app.set('User', null);
        return res.redirect('/')
        }else  if(!currentUser){
            req.app.set('token', null);
        req.app.set('User', null);
        return res.redirect('/')
        }else if(!currentUser.isActive){
            req.app.set('token', null);
        req.app.set('User', null);
        return res.redirect('/')
        }else if(!currentUser.is_Online){
            req.app.set('token', null);
        req.app.set('User', null);
        return res.redirect('/')
        }
    }
    // console.log('working')
    loginData = {
        Token : token,
        User : currentUser
    }
    loginData.User = currentUser
    res.locals.loginData = loginData
    req.currentUser = currentUser
    req.token = token
    req.app.set('token', token);
    req.app.set('User', currentUser);
    next()
});

exports.isLogin_Admin = catchAsync( async (req, res, next) => {
    let token 
    res.locals.loginData = undefined
    let whiteLabelData = await whiteLabelMOdel.findOne({whiteLabelName:process.env.whiteLabelName})
    if(whiteLabelData){
        res.locals.B2C_Status = whiteLabelData.B2C_Status
    }else{
        res.locals.B2C_Status = false
    }
  
    if(req.method == 'GET'){
        token = req.query.sessiontoken
    }else if(req.method == 'POST'){
        token = req.body.sessiontoken
        delete req.body['sessiontoken']
    }

    // console.log(token, "TOKEN")
    if(!token){
        req.app.set('token', null);
        req.app.set('User', null);
        return next()
    }
    if(token == "loggedout"){
        req.app.set('token', null);
        req.app.set('User', null);
        return next()
    }
    
    const tokenId = await loginLogs.findOne({session_id:token})
    // console.log(tokenId, "TOKENID")
    if(!tokenId){
        req.app.set('token', null);
        req.app.set('User', null);
        return next()
    }
    if(!tokenId.isOnline){
        req.app.set('token', null);
        req.app.set('User', null);
        return next()
    }
    // console.log(token)
    const decoded = await logindatauser.findOne({token});
    if(!decoded){
        req.app.set('token', null);
        req.app.set('User', null);
        return res.status(404).json({
            status:"success",
            message:'the user belonging to this token does no longer available'
        })
    }

    const currentUser = await User.findById(decoded.userId);
    if(!currentUser){
        req.app.set('token', null);
        req.app.set('User', null);
        return res.status(404).json({
            status:"success",
            message:'the user belonging to this token does no longer available'
        })
    }
    if(currentUser.passwordchanged && req.originalUrl !== '/api/v1/users/changeUserPasswordAdmin'){
        res.render(`/resetPassword?sessiontoken=${token}`)
    }
    if(currentUser.roleName != "DemoLogin"){
        if(!currentUser){
            req.app.set('token', null);
        req.app.set('User', null);
            return res.status(404).json({
                status:"success",
                message:'the user belonging to this token does no longer available'
            })
        }else if(!currentUser.isActive){
            req.app.set('token', null);
        req.app.set('User', null);
            return res.status(404).json({
                status:"success",
                message:'the user belonging to this token does no longer available'
            })
        }else if(!currentUser.is_Online){
            req.app.set('token', null);
        req.app.set('User', null);
            return next()
        }
    }
    
    req.currentUser = currentUser
    req.token = token
    let loginData = {
        Token : token,
        User : currentUser
    }
    req.app.set('token', token);
    req.app.set('User', currentUser);
    res.locals.loginData = loginData
    next()
});
exports.isLogin = catchAsync( async (req, res, next) => {
    console.log('WORMING')
    console.log(req.session.tabId, "TABID")
    // console.log('WORKING')
    // console.log(req.originalUrl, "req.originalUrlreq.originalUrlreq.originalUrlreq.originalUrlreq.originalUrl")
    // console.log(req.cookies, "cookiescookiescookies")
    // console.log('product: ', sessionStorage.getItem('sessionID'));
    // console.log(req.session, "SESSSION")
    console.log(req.cookies, "req.cookiesreq.cookiesreq.cookies21212")
    let token 
    res.locals.loginData = undefined
    let whiteLabelData = await whiteLabelMOdel.findOne({whiteLabelName:process.env.whiteLabelName})
    if(whiteLabelData){
        res.locals.B2C_Status = whiteLabelData.B2C_Status
    }else{
        res.locals.B2C_Status = false
    }
    res.locals.whiteLabel = process.env.whiteLabelName
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1].split("=")[1];
    }else if(req.headers.cookie){
        token = parseCookies(req.headers.cookie).JWT;
    }
    if(!token){
        req.app.set('token', null);
        req.app.set('User', null);
        return next()
    }
    if(token == "loggedout"){
        req.app.set('token', null);
        req.app.set('User', null);
        return next()
    }
    
    const tokenId = await loginLogs.findOne({session_id:token})
    if(!tokenId){
        req.app.set('token', null);
        req.app.set('User', null);
        return next()
    }
    if(!tokenId.isOnline){
        req.app.set('token', null);
        req.app.set('User', null);
        return next()
    }
    const decoded = await util.promisify(JWT.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.A);
    if(!currentUser){
        req.app.set('token', null);
        req.app.set('User', null);
        return res.status(404).json({
            status:"success",
            message:'the user belonging to this token does no longer available'
        })
    }
    if(currentUser.roleName != "DemoLogin"){
        if(!currentUser){
            req.app.set('token', null);
        req.app.set('User', null);
            return res.status(404).json({
                status:"success",
                message:'the user belonging to this token does no longer available'
            })
        }else if(!currentUser.isActive){
            req.app.set('token', null);
        req.app.set('User', null);
            return res.status(404).json({
                status:"success",
                message:'the user belonging to this token does no longer available'
            })
        }else if(!currentUser.is_Online){
            req.app.set('token', null);
        req.app.set('User', null);
            return next()
        }
    }
    // console.log(req.cookies, "req.cookiesreq.cookiesreq.cookies")
    // if (!req.cookies.sessionId) {
    //     req.app.set('token', null);
    //     req.app.set('User', null);
    //     return next()
    // }
    let loginData = {
        Token : token,
        User : currentUser
    }
    req.currentUser = currentUser
    res.locals.loginData = loginData
    req.token = token
    req.app.set('token', token);
    req.app.set('User', currentUser);
    next()
    // console.log('WORKING2')

});

exports.restrictTo = (...roles) => {
    // console.log('WORKING123456789')
    return function(req, res, next){
        next()
    }
    // return function(req, res, next){
    //     // if(!roles.includes(req.currentUser.role)){
    //         // return res.status(404).json({
    //         //     status:'error',
    //         //     message:'You do not have permission to perform this action'
    //         // })
    //     // }
    //     // next()
    //     let j = 0;
    //     // console.log(req.currentUser)
    //     for(let i=0 ; i < req.currentUser.role.authorization.length; i++){
    //         // console.log(req.currentUser.role.authorization[i])
    //         // console.log(roles)
    //         // console.log(roles.includes(req.currentUser.role.authorization[i]))
    //         // console.log(req.currentUser.role.authorization[i])
    //         // console.log(req.currentUser.role.authorization[i])
    //         if(roles.includes(req.currentUser.role.authorization[i])){
    //             j = j + 1;
    //         }
    //     }
    //     if(j > 0){
    //         next()
    //     }else{
    //         return res.status(404).json({
    //             status:'error',
    //             message:'You do not have permission to perform this action'
    //         })
    //     }

    // }
};

exports.restrictToOperator = (...roles) => {
    return function(req, res, next ){
        if(req.currentUser.role.roleName == "Operator"){
            next()
        }else{

            let j = 0;
            for(let i=0; i < req.currentUser.role.operationAuthorization.length; i++){
                if(roles.includes(req.currentUser.role.operationAuthorization[i])){
                    j = j + 1;
                }
            }
            if(j > 0){
                next()
            }else{
                return res.status(404).json({
                    status:'error',
                    message:'You do not have permission to perform this action'
                })
            }
        }
    }
}


exports.signUp = catchAsync( async(req, res, body) => {
//    console.log(req.body)
   req.body.role = '643636fb255b652695133bcd';
   req.body.roleName = 'user';
   req.body.role_type = 5;
   req.body.parent_id = 1;
   req.body.is_Online = true;
    // const roles = await Role.find().sort({role_level:1})
    // console.log(roles[roles.length-1].id)
    // if(!roles){
    //     return next(new AppError("please try again later", 404))
    // }
    // req.body.role = roles[roles.length-1].id
    const newUSer = await User.create(req.body)
    // console.log(req.body)
    // if(!newUSer){
    //     return next(new AppError("please try again later", 404))
    // }
    // res.status(200).json({
    //     status:"success",
    //     newUSer
    // })
    createSendToken(newUSer, 200, res, req);


});

exports.logOut = catchAsync( async function logout(req, res) {
	const profilechema = Joi.object({
		userid: Joi.number().required(),
		parent_ids: Joi.optional().required(),
	});
	try {
		profilechema.validate(req.body, {
			abortEarly: true
		});
	} catch (error) {
        // console.log(error, "errorerrorerrorerrorerrorerrorerror")
		return next(new AppError(error.details[0].message, 404));
	}
    // console.log(req.headers)
    let user = await User.findById(req.currentUser.id)
    try{

        let token
        // console.log(req.headers)
        if(req.headers.authorization){
            token = req.headers.authorization.split(' ');
        }else{
            token = req.headers.cookie.split('=')
        }
        // console.log(token)
        let date = Date.now();
        // console.log(global._loggedInToken)
        let findToken=global._loggedInToken.findIndex((element)=>element.token===token[token.length-1]);
        if (findToken >= 0) {
            global._loggedInToken.splice(findToken, 1);
        }
          // console.log(user._id)
          const logs = await loginLogs.find({user_id:user._id,isOnline:true})
          // console.log(logs)
          for(let i = 0; i < logs.length; i++){
              res.cookie(logs[i].session_id, '', { expires: new Date(0) });
              res.clearCookie(logs[i].session_id);
            }
            if(user.roleName != "DemoLogin"){
                await loginLogs.updateMany({user_id:user._id,isOnline:true},{isOnline:false})
            }
          global._loggedInToken.splice(logs.session_id, 1);
          await User.findByIdAndUpdate({_id:user._id},{is_Online:false})
    
        res.cookie('JWT', 'loggedout', {
            expires: new Date(date + 500),
            httpOnly: true
        });
    
        res.status(200).json({
            status:'success'
        })
    }catch(err){
        console.log(err, "ERRRR")
    }
});
exports.admin_logOut = catchAsync( async(req, res) => {
   
    const user = await User.findOne({_id:req.currentUser._id,is_Online:true});
    if(!user){
        return next(new AppError('User not find with this id',404))
    }
    
    // console.log(req.headers)
	let token
    // console.log(req.headers)
    if(req.method == 'GET'){
        token = req.query.sessiontoken
    }else if(req.method == 'POST'){
        token = req.body.sessiontoken
        delete req.body['sessiontoken']
    }
    // console.log(token)
    let date = Date.now();
    // console.log(global._loggedInToken)
	let findToken=global._loggedInToken.findIndex((element)=>element.token===token[token.length-1]);
	if (findToken >= 0) {
		global._loggedInToken.splice(findToken, 1);
	}
      // console.log(user._id)
      const logs = await loginLogs.findOne({user_id:user._id,isOnline:true})
      // console.log(logs)
      await loginLogs.updateMany({user_id:user._id,isOnline:true},{isOnline:false})
      global._loggedInToken.splice(logs.session_id, 1);
      await User.findByIdAndUpdate({_id:user._id},{is_Online:false})
      await logindatauser.deleteMany({userId:user._id})

    res.status(200).json({
        status:'success'
    })
});


exports.logOutAllUser = catchAsync(async(req, res, next) => {
    let token
    if(req.currentUser.role.role_level !== 1){
        return next(new AppError('You do not have permission to perform this action',404))
    }
    if(req.headers.authorization){
        token = req.headers.authorization.split(' ');
    }else{
        token = req.headers.cookie.split('=')
    }
    let date = Date.now();
    global._loggedInToken=[];
    global._loggedInToken.push({token:token[1],time:date})
    await loginLogs.updateMany({isOnline:true,session_id:{$ne:token[1]}},{$set:{isOnline:false, logOut_time:date}})
    await User.updateMany({role_type:{$gt:1}},{$set:{is_Online:false}})
        
    res.status(200).json({
        status:'success'

    })
});

exports.logOutSelectedUser = catchAsync(async(req,res,next) =>{
    // console.log(req.query)
    const user = await User.findOne({_id:req.body.userId,is_Online:true});
    // console.log(user,'==>user')

    if(!user){
        return next(new AppError('User not find with this id',404))
    }
    if(user.role.role_level < req.currentUser.role.role_level){
        return next(new AppError('You do not have permission to perform this action',404))
    }
    const logs = await loginLogs.findOne({user_id:user._id,isOnline:true})
    // console.log(logs,'==>logs')
    // for(let i = 0; i < logs.length; i++){
    //     res.cookie(logs[i].session_id, '', { expires: new Date(0) });
    //     res.clearCookie(logs[i].session_id);
    // }
    await loginLogs.updateMany({user_id:user._id,isOnline:true},{isOnline:false})
    global._loggedInToken.splice(logs.session_id, 1);
    await User.findByIdAndUpdate({_id:user._id},{is_Online:false})
    await logindatauser.deleteMany({userId:user._id})
    res.status(200).json({
        status:'success'
    })

});


exports.userLogin = catchAsync (async(req, res, next) => {
    if(req.body.data != "Demo"){
       
        let {
            userName,
            password
        } = req.body;
        const loginSchema = Joi.object({
            userName: Joi.string().required(),
            password: Joi.string().required(),
        });
        const validate = loginSchema.validate(req.body);
        userName = req.body.userName.toLowerCase();
        if(validate.error){
            res.status(404).json({
                status:"error",
                message:validate.error.details[0].message
            })
        }else{
            const user = await User.findOne({userName}).select('+password');
            let whiteLabel = process.env.whiteLabelName
            // console.log("gothere", user)
            if(user && user.role_type != 6){
                if(user.whiteLabel != whiteLabel && user.role_type !== 1){
                    res.status(404).json({
                        status:'error',
                        message:"not a valid user userLogin"
                    })
                }else  if(!user || !(await user.correctPassword(password, user.password))){
                    // console.log()
                    res.status(404).json({
                        status:'error',
                        message:"Please provide valide user and password"
                    })
                }else if(user.role_type != 5 && user.role_type != 6){
                    res.status(404).json({
                        status:'error',
                        message:"You do not have permission to login as user"
                    })
                }else if(!user.isActive){
                    res.status(404).json({
                        status:'error',
                        message:"You are inactive"
                    })
                }
                // else if(user.is_Online){
                    //     // console.log(user)
                    //     res.status(404).json({
                        //         status:"error",
                        //         message:"User is already login"
                        //     })
                        // }
                        else{
                            await User.findOneAndUpdate({_id:user._id}, {is_Online:true})
                            console.log('WORKING')
                            user_createSendToken(user, 200, res, req);
                            
                        }
                    }else{
                        await User.findOneAndUpdate({_id:user._id}, {is_Online:true})
                            console.log('WORKING')
                            user_createSendToken(user, 200, res, req);
                    }
        }
    }else{
        let demoUser = await User.findOne({roleName: 'DemoLogin'})
        user_createSendToken(demoUser, 200, res, req);
    }
});



exports.isAdmin = catchAsync(async(req, res, next) => {
    // console.log(req.currentUser.role_type, "req.currentUser.role_typereq.currentUser.role_typereq.currentUser.role_typereq.currentUser.role_type")
    if(req.currentUser.role_type == 5){
        return next(new AppError('You do not have permission to access this route',404))
    }else{
        // console.log(req.originalUrl, "req.originalUrlreq.originalUrlreq.originalUrlreq.originalUrl")
        next()
    }
})