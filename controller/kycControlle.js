const catchAsynch = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const userModel = require("../model/userModel");
const path = require('path');


exports.uploadphoto = catchAsynch(async(req, res, next) => {
    console.log(req.files)
    console.log(req.body)
    console.log("req.body")
    console.log(req.currentUser)
    // if(req.files != null){
    //     if(req.files.file.mimetype.startsWith('application/pdf')){
    //         const image = req.files.file
    //         // console.log(logo)
    //         // req.body.backGroundImage = req.body.name.split(' ')[0]
    //         image.mv(`public/sliderBackgroundImages/${req.current.name.split(' ')[0]}.png`, (err)=>{
    //             if(err) 
    //             return next(new AppError("Something went wrong please try again later", 400))
    //         })
    //         let newSlider = await sliderModel.create(req.body)
    //         if(newSlider){
    //             res.status(200).json({
    //                 status:"success"
    //             })
    //         }
    //     }else{
    //         return next(new AppError("Please Upload an image", 404))
    //     }
    // }
})