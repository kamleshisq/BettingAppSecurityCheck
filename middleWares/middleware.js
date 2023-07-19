const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const loginLogs = require("../model/loginLogs");
const User = require("../model/userModel");
// const { log } = require("util");

// const { log } = require("util");


const LoginLogs = catchAsync(async(req, res, next) => {
    console.log(req.originalUrl)
    if(!req.originalUrl.startsWith("/api/v1") && !req.originalUrl.startsWith("/wallet")){
        const clientIP1 = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        let clientIP2 = clientIP1.split(":")
        let clientIP = clientIP2[clientIP2.length - 1]
        global.ip = clientIP
    }
    // console.log(global.ip)
    
    if(req.originalUrl == "/api/v1/auth/login" ){
        // console.log("working")
        const id = await User.findOne({userName:req.body.userName})
        // console.log(id)
        if(!id){
            // console.log(req.body)
            return res.status(404).json({
                status:"error",
                message:"please provide a valide user name"
            })
        }
        const userLog = await loginLogs.find({user_id:id._id})
        global._count = userLog.length
        global._admin = true
        // console.log(global._count, global._admin)
    }else if (req.originalUrl == "/api/v1/auth/userLogin"){
        const id = await User.findOne({userName:req.body.userName})
        if(!id){
            // console.log(req.body)
            return res.status(404).json({
                status:"error",
                message:"please provide a valide user name"
            })
        }
        const userLog = await loginLogs.find({user_id:id._id})
        req._count = userLog.length
        global._admin = false
    }
    // else if(global._count == 0){
    //         global._count = 2
    //         if(global._admin){

    //             res.status(200).render('updatePassword')
    //         }else{
    //             res.status(200).render('./user/passwordUpdate')

    //         }
    // }
    else if(req.originalUrl != "/" && req.originalUrl != "/adminLogin" && req.originalUrl != "/userlogin"){
        if(req.cookies.JWT && !req.originalUrl.startsWith("/wallet")){
            // console.log(global._loggedInToken)
            const login = await loginLogs.findOne({session_id:req.cookies.JWT, isOnline:true})
            // console.log(req.cookies.JWT)
            if(login == null){
                return next()
            }
            const user = await User.findById(login.user_id._id)
            var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
            login.logs.push(req.method + " - " + fullUrl)
            login.save()
            global._token = req.cookies.JWT
            global._protocol = req.protocol
            global._host = req.get('host')
            global._User = user
        }else{
            const login = await loginLogs.findOne({session_id:req.cookies.JWT, isOnline:true})
            // console.log(req.cookies.JWT)
            console.log(login, "MIDDLEWARE")
            if(login == null){
                global._token = ""
                global._protocol = req.protocol
                global._host = req.get('host')
                global._User = ""
                return next()
            }

            const user = await User.findById(login.user_id._id)
            global._token = req.cookies.JWT
            global._protocol = req.protocol
            global._host = req.get('host')
            global._User = user
        }
    }
    
    
    next()
})

module.exports = LoginLogs