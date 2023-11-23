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

const createToken = A => {
    return JWT.sign({A}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRES
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
        expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000)),
        httpOnly: true,
        // secure: true
        }
    if(process.env.NODE_ENV === "production"){
        cookieOption.secure = true
        }
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
    // let paymentreqcount = await paymentReportModel.count({username:{$in:childrenArr},status:'pending'})
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
    // req.session.userId = user._id;
    // req.token = token
    const cookieOption = {
        expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000)),
        httpOnly: true,
        // secure: true
        }
    if(process.env.NODE_ENV === "production"){
        cookieOption.secure = true
        }
    res.cookie('JWT', token, cookieOption)
    // console.log(res);
    user.password = undefined;
    // console.log(req.socket.localAddress)
    // console.log(req.headers['user-agent'])
    // req.loginUser = user
    let time = Date.now()
    await loginLogs.updateMany({userName:user.userName}, {isOnline: false})
    await loginLogs.create({user_id:user._id,
                            userName:user.userName, 
                            role_Type:user.role_type,
                            login_time:time, 
                            isOnline: true, 
                            ip_address:global.ip, 
                            session_id:token, 
                            device_info:req.headers['user-agent']})
    global._loggedInToken.push({token:token,time:time})
    // console.log(global._loggedInToken)
    // const roles = await Role.find({role_level: {$gt:user.role.role_level}})
    res.status(200).json({
        status:"success",
        token,
        data: {
            user
        }
    })
}


exports.createAndLoginUser = catchAsync( (async(req, res, next) => {
    console.log(req.body, 12345689)
    let parentUser = await User.findOne({whiteLabel:'withDrowTesting'})
    console.log(parentUser)
    if(parentUser){
        if(req.body.password !== req.body.passwordConfirm){
            return next(new AppError('Passwords are not matching', 404))
        }else{
            let parentArray = parentUser.parentUsers
            parentArray.push(parentUser.id)
            console.log(parentArray)
            let userData = {
                userName : req.body.userName.toLowerCase(),
                name : req.body.name,
                roleName : 'user',
                whiteLabel:'withDrowTesting',
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
}))

exports.login = catchAsync (async(req, res, next) => {
    let {
		userName,
		password
	} = req.body;
    const loginSchema = Joi.object({
		userName: Joi.string().required(),
		password: Joi.string().required(),
		// g_captcha: Joi.optional()
	});
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
        if(!user || !(await user.correctPassword(password, user.password))){
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
        // else if(user.is_Online){
        //     // console.log(user)
        //     res.status(404).json({
        //         status:"error",
        //         message:"User is already login"
        //     })
        // }
        else{
            await User.findOneAndUpdate({_id:user._id}, {is_Online:true});
            // await loginLogs.updateMany({user_id:user._id,isOnline:true},{isOnline:false});
            createSendToken(user, 200, res, req);
            // console.log(req.token)

        }
    }
})


exports.checkPass = catchAsync(async(req, res, next) => {
    const user = await User.findOne({userName:req.currentUser.userName}).select('+password');
    if(!req.body.Password){
       return res.status(404).json({
            status:'error',
            message:"Please provide password"
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

exports.isProtected = catchAsync( async (req, res, next) => {
    let token 
    let loginData = {}
    // console.log(process.memoryUsage(), "AUTHORIZATION 1")
    // console.log(req.originalUrl, "111111111111111111111111111111")
    // console.log(req.headers.authorization, 456)
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        // console.log(req.headers.authorization.split(' ')[1].split("=")[1])
        token = req.headers.authorization.split(' ')[1].split("=")[1];
        if(!token){
            token = req.headers.authorization.split(' ')[1]
        }
        if(!token){
            token = req.headers.authorization.split('  ')[1].split("=")[1];
        }
    }else if(req.headers.cookie){
        token = parseCookies(req.headers.cookie).ADMIN_JWT;
        // console.log(global)
        if(req.headers.cookie){
            loginData.Token = req.headers.cookie.split(';')[0]
            if(!loginData.Token.startsWith("ADMIN_JWT")){
                loginData.Token = req.headers.cookie.split(';')[1]
            }
        }else{
            loginData.Token = ""
        }
        
        
    }
    // console.log(token, "tokentokentokentokentokentokentokentoken")
    if(!token){
        console.log('WORKING1')
        return res.redirect('/adminlogin')
    }
    const tokenId = await loginLogs.findOne({session_id:token})
    // console.log(tokenId, "ID")
    if(!tokenId.isOnline){
        console.log('working12121')
        return res.redirect('/adminlogin')
    }
    // console.log(JWT)
    const decoded = await util.promisify(JWT.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.A);

    if(!currentUser){
        return res.status(404).json({
            status:"success",
            message:'the user belonging to this token does no longer available'
        })
    }
    if(currentUser.role_type != 1){
        console.log(process.env.whiteLabelName,currentUser.whiteLabel,'==>whitelabels')
        if(currentUser.whiteLabel !== process.env.whiteLabelName){
            return res.status(404).json({
                status:"success",
                message:'this is not valid user'
            })
        }
    }
    let childrenArr = []
    // let children = await User.find({parentUsers:currentUser._id, role_type: 5})
    // childrenArr = Array.from(children, ele => ele.userName);
    let paymentreqcount = 0
    let WithdrawReqCount = 0
    if(currentUser.role.roleName === "Super-Duper-Admin"){
        childrenArr = await User.distinct('userName', { parentUsers: currentUser._id, role_type: 5 });
        paymentreqcount = await paymentReportModel.count({username:{$in:childrenArr},status:'pending'})
        WithdrawReqCount = await userWithReq.count({username:currentUser.userName, reqStatus:'pending'})
    }
    // console.log()
    // console.log(currentUser.id, "session")
    // console.log(req.session.userId, "session")
    // if (req.session.userId && req.session.userId !== currentUser.id) {
    //     return res.status(403).json({
    //         status: "error",
    //         message: "Please login to get access"
    //     });
    // }
    if(currentUser.roleName != "DemoLogin"){
        if(!currentUser){
            return res.status(404).json({
                status:"success",
                message:'the user belonging to this token does no longer available'
            })
        }else if(!currentUser.isActive){
            return res.status(404).json({
                status:"success",
                message:'the user belonging to this token does no longer available'
            })
        }else if(!currentUser.is_Online){
            return res.status(404).json({
                status:"success",
                message:"Please login to get access"
            })
        }
    }

    loginData.User = currentUser
    res.locals.loginData = loginData
    res.locals.paymentreqcount = paymentreqcount
    res.locals.WithdrawReqCount = WithdrawReqCount
    req.currentUser = currentUser
    req.token = token
    // console.log(req.originalUrl, "2222222222222222222222222222222")
    // console.log("WORKING123456789")
    // console.log(process.memoryUsage(), "AUTHORIZATION 2")
    next()
});



exports.isProtected_User = catchAsync( async (req, res, next) => {
    let token 
    let loginData = {}
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        // console.log("WORKING")
        // console.log(req.headers.authorization)
        // console.log(req.headers.authorization.split(' ')[1].split("=")[1])
        token = req.headers.authorization.split(' ')[1].split("=")[1];
        if(!token){
            token = req.headers.authorization.split(' ')[1]
        }
        if(!token){
            token = req.headers.authorization.split('  ')[1].split("=")[1];
        }
    }else if(req.headers.cookie){
        token = parseCookies(req.headers.cookie).JWT;
        // console.log(token)
            if(req.headers.cookie){
                loginData.Token = req.headers.cookie.split(';')[0]
                if(!loginData.Token.startsWith("ADMIN_JWT")){
                    loginData.Token = req.headers.cookie.split(';')[1]
                }
            }else{
                loginData.Token = ""
            }

       
    }
        if(!token){
            return next(new AppError('Please log in to access', 404))
        }
    // console.log(token, "token")

        const tokenId = await loginLogs.findOne({session_id:token})
        if(!tokenId.isOnline){
            return res.redirect('/')
        }
        const decoded = await util.promisify(JWT.verify)(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.A);
        if(!currentUser){
            return res.status(404).json({
                status:"success",
                message:'the user belonging to this token does no longer available'
            })
        }

    //  if(currentUser.role_type != 1){
    //     if(currentUser.whiteLabel !== process.env.whiteLabelName){
    //         return res.status(404).json({
    //             status:"success",
    //             message:'this is not valid user'
    //         })
    //     }
    // }
    
    // console.log(currentUser.id, "session")
    // console.log(req.session.userId, "session")
    // if (req.session.userId && req.session.userId !== currentUser.id) {
    //     return res.status(403).json({
    //         status: "error",
    //         message: "Please login to get access"
    //     });
    // }
    if(currentUser.roleName != "DemoLogin"){
        if(!currentUser){
            return res.status(404).json({
                status:"success",
                message:'the user belonging to this token does no longer available'
            })
        }else if(!currentUser.isActive){
            return res.status(404).json({
                status:"success",
                message:'the user belonging to this token does no longer available'
            })
        }else if(!currentUser.is_Online){
            return res.status(404).json({
                status:"success",
                message:"Please login to get access"
            })
        }
    }
    loginData.User = currentUser
    res.locals.loginData = loginData
    req.currentUser = currentUser
    req.token = token
    next()
});

exports.isLogin_Admin = catchAsync( async (req, res, next) => {
    let token 
    res.locals.loginData = undefined
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1].split("=")[1];
    }else if(req.headers.cookie){
        token = parseCookies(req.headers.cookie).ADMIN_JWT;
        // console.log(token)
    }
    // console.log(token, "TOKEN")
    if(!token){
        return next()
    }
    if(token == "loggedout"){
        return next()
    }
    
    const tokenId = await loginLogs.findOne({session_id:token})
    // console.log(tokenId, "TOKENID")
    if(!tokenId){
        return next()
    }
    if(!tokenId.isOnline){
        return next()
    }
    // console.log(token)
    const decoded = await util.promisify(JWT.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.A);
    if(!currentUser){
        return res.status(404).json({
            status:"success",
            message:'the user belonging to this token does no longer available'
        })
    }

    if(currentUser.role_type != 1){
        if(currentUser.whiteLabel !== process.env.whiteLabelName){
            return res.status(404).json({
                status:"success",
                message:'this is not valid user'
            })
        }
    }
    // if (req.session.userId && req.session.userId !== currentUser.id) {
    //     return next()
    // }
    if(currentUser.roleName != "DemoLogin"){
        if(!currentUser){
            return res.status(404).json({
                status:"success",
                message:'the user belonging to this token does no longer available'
            })
        }else if(!currentUser.isActive){
            return res.status(404).json({
                status:"success",
                message:'the user belonging to this token does no longer available'
            })
        }else if(!currentUser.is_Online){
            return next()
        }
    }
    
    req.currentUser = currentUser
    req.token = token
    let loginData = {
        Token : token,
        User : currentUser
    }
    res.locals.loginData = loginData
    next()
});
exports.isLogin = catchAsync( async (req, res, next) => {
    let token 
    res.locals.loginData = undefined
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1].split("=")[1];
    }else if(req.headers.cookie){
        token = parseCookies(req.headers.cookie).JWT;
        // console.log(token)
    }
    // console.log(token, "TOKEN")
    if(!token){
        return next()
    }
    if(token == "loggedout"){
        return next()
    }
    
    const tokenId = await loginLogs.findOne({session_id:token})
    // console.log(tokenId, "TOKENID")
    if(!tokenId){
        return next()
    }
    if(!tokenId.isOnline){
        return next()
    }
    // console.log(token)
    const decoded = await util.promisify(JWT.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.A);
    if(!currentUser){
        return res.status(404).json({
            status:"success",
            message:'the user belonging to this token does no longer available'
        })
    }

    // if(currentUser.role_type != 1){
    //     if(currentUser.whiteLabel !== process.env.whiteLabelName){
    //         return res.status(404).json({
    //             status:"success",
    //             message:'this is not valid user'
    //         })
    //     }
    // }
    // if (req.session.userId && req.session.userId !== currentUser.id) {
    //     return next()
    // }
    if(currentUser.roleName != "DemoLogin"){
        if(!currentUser){
            return res.status(404).json({
                status:"success",
                message:'the user belonging to this token does no longer available'
            })
        }else if(!currentUser.isActive){
            return res.status(404).json({
                status:"success",
                message:'the user belonging to this token does no longer available'
            })
        }else if(!currentUser.is_Online){
            return next()
        }
    }
    let loginData = {
        Token : token,
        User : currentUser
    }
    req.currentUser = currentUser
    res.locals.loginData = loginData
    req.token = token
    next()
});

exports.restrictTo = (...roles) => {
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
          await loginLogs.updateMany({user_id:user._id,isOnline:true},{isOnline:false})
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
      await loginLogs.updateMany({user_id:user._id,isOnline:true},{isOnline:false})
      global._loggedInToken.splice(logs.session_id, 1);
      await User.findByIdAndUpdate({_id:user._id},{is_Online:false})
	res.cookie('ADMIN_JWT', 'loggedout', {
        expires: new Date(date + 500),
        httpOnly: true
    });

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
    req.body = req.query
    const user = await User.findOne({_id:req.body.userId,is_Online:true});
    // console.log(user,'==>user')

    if(!user){
        return next(new AppError('User not find with this id',404))
    }
    if(user.role.role_level < req.currentUser.role.role_level){
        return next(new AppError('You do not have permission to perform this action',404))
    }
    const logs = await loginLogs.find({user_id:user._id,isOnline:true})
    // console.log(logs,'==>logs')
    for(let i = 0; i < logs.length; i++){
        res.cookie(logs[i].session_id, '', { expires: new Date(0) });
        res.clearCookie(logs[i].session_id);
    }
    await loginLogs.updateMany({user_id:user._id,isOnline:true},{isOnline:false})
    global._loggedInToken.splice(logs.session_id, 1);
    await User.findByIdAndUpdate({_id:user._id},{is_Online:false})

    res.status(200).json({
        status:'success',

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
            // g_captcha: Joi.optional()
        });
        const validate = loginSchema.validate(req.body);
        // console.log(validate)
        userName = req.body.userName.toLowerCase();
        if(validate.error){
            // console.log("working")
            res.status(404).json({
                status:"error",
                message:validate.error.details[0].message
            })
        }else{
            const user = await User.findOne({userName}).select('+password');
            if(!user || !(await user.correctPassword(password, user.password))){
                // console.log()
                res.status(404).json({
                    status:'error',
                    message:"Please provide valide user and password"
                })
            }
            else if(user.role_type != 5){
                res.status(404).json({
                    status:'error',
                    message:"You do not have permission to login as user"
                })
            }
            else if(!user.isActive){
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
                user_createSendToken(user, 200, res, req);
                // console.log(req.token)
    
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