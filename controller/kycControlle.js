const catchAsynch = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const userModel = require("../model/userModel");
const path = require('path');


exports.uploadphoto = catchAsynch(async(req, res, next) => {
    console.log(req.files)
    console.log(req.body)
    console.log("req.body")
    console.log(req.currentUser)
    if(req.files != null){
        let data = {}
        if(req.files.file.mimetype.startsWith('application/pdf')){
            const image = req.files.file
            // console.log(logo)
            data.kycDoc = `${path.join(__dirname, documents)}/${req.currentUser.userName}.pdf`
            image.mv(`${data.kycDoc}`, (err)=>{
                if(err) 
                return next(new AppError("Something went wrong please try again later", 400))
            })
        }else{
            return next(new AppError("Please Upload an image", 404))
        }
    }
})