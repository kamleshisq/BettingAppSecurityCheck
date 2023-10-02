const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const loginLogs = require("../model/loginLogs");
const User = require("../model/userModel");
// const { log } = require("util");

// const { log } = require("util");
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

const LoginLogs = catchAsync(async(req, res, next) => {
    console.log("USE LOGIN")
    // console.log(req.headers.cookie, 456)
    // if(req.headers.cookie){
    //     console.log(parseCookies(req.headers.cookie).JWT)
    // }
    if(!req.originalUrl.startsWith("/api/v1") && !req.originalUrl.startsWith("/wallet")){
        const clientIP1 = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        let clientIP2 = clientIP1.split(":")
        let clientIP = clientIP2[clientIP2.length - 1]
        global.ip = clientIP
    }
    
    if(req.originalUrl == "/api/v1/auth/login" ){
        const id = await User.findOne({userName:req.body.userName.toLowerCase()})
        if(!id){
            return res.status(404).json({
                status:"error",
                message:"please provide a valide user name"
            })
        }
        const userLog = await loginLogs.find({user_id:id._id})
        global._count = userLog.length
        req._count = userLog.length
        global._admin = true
    }else if (req.originalUrl == "/api/v1/auth/userLogin"){
        let id
        if(req.body.userName){
            id = await User.findOne({userName:req.body.userName.toLowerCase()})
        }
        // console.log(req.body)
        // console.log("WORKING")
        if(!id){
            if(req.body.data == "Demo"){

            }else{
                return res.status(404).json({
                    status:"error",
                    message:"please provide a valide user nameeeee"
                })
            }
        }
        if(req.body.data != "Demo"){
            const userLog = await loginLogs.find({user_id:id._id})
            req._count = userLog.length
            global._admin = false
        }
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
        //console.log(req.headers.cookie, "MIDDLEWARES")
        if(req.headers.cookie && !req.originalUrl.startsWith("/wallet")){
            // //console.log(global._loggedInToken)
            const login = await loginLogs.findOne({session_id:parseCookies(req.headers.cookie).JWT, isOnline:true})
            // //console.log(req.headers.cookie)
            if(login == null){
                return next()
            }
            const user = await User.findById(login.user_id._id)
            var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
            login.logs.push(req.method + " - " + fullUrl)
            login.save()
            global._token = req.headers.cookie
            global._protocol = req.protocol
            global._host = req.get('host')
            global._User = user
        }
        else if (!req.originalUrl.startsWith("/api/v1")){
            global._token = ""
            global._protocol = req.protocol
            global._host = req.get('host')
            global._User = ""
        }
    }else if(req.originalUrl == "/"){
        if(req.headers.cookie){
            const login = await loginLogs.findOne({session_id:parseCookies(req.headers.cookie).JWT, isOnline:true})
            console.log(login)
            if(login == null){
                return next()
            }
            const user = await User.findById(login.user_id._id)
            global._token = req.headers.cookie
            global._protocol = req.protocol
            global._host = req.get('host')
            global._User = user
        }else{
            global._token = ""
            global._protocol = req.protocol
            global._host = req.get('host')
            global._User = ""
        }
    }
    
    
    next()
})

module.exports = LoginLogs