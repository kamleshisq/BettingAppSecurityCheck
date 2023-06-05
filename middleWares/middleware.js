const catchAsync = require("../utils/catchAsync");
// const AppError = require("../utils/AppError");
const loginLogs = require("../model/loginLogs");
const User = require("../model/userModel");

// const { log } = require("util");


const LoginLogs = catchAsync(async(req, res, next) => {
    // console.log(req.originalUrl, "abcd")

    // console.log(req.ip)
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
        global._count = userLog.length
        global._admin = false
    }else if(global._count == 0){
            global._count = 2
            if(global._admin){

                res.status(200).render('updatePassword')
            }else{
                res.status(200).render('./user/passwordUpdate')

            }
    }
    
    if(req.cookies.JWT && !req.originalUrl.startsWith("/wallet")){
        // console.log(global._loggedInToken)
        const login = await loginLogs.findOne({ip_address:req.ip, isOnline:true})
        // console.log(req.cookies.JWT)
        if(!login){
            res.status(200).render('loginPage', {
            title:"Login form"
        })
        }
        const user = await User.findById(login.user_id._id)
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        login.logs.push(req.method + " - " + fullUrl)
        login.save()
        global._token = req.cookies.JWT
        global._protocol = req.protocol
        global._host = req.get('host')
        global._User = user
    }
    
    next()
})

module.exports = LoginLogs