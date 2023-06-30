const bannerModel =  require("../model/bannerModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.createBanner = catchAsync(async(req, res, next) => {
    if(req.files){
        if(req.files.banner.mimetype.startsWith('image')){
            const image = req.files.banner
            // console.log(logo)
            image.mv(`public/banner/${req.body.bannerName}.png`, (err)=>{
                if(err) return next(new AppError("Something went wrong please try again later", 400))
            })
            req.body.banner = req.body.bannerName
            const newBanner = await bannerModel.create(req.body);
            res.status(200).json({
                status:"success",
                newBanner
            })
        }else{
            return next(new AppError("Please Provide Image", 400))
        }
    }else{
        return next(new AppError("Please Provide Image", 404))
    }
});


exports.updateBanner = catchAsync(async(req, res, next) => {
    console.log(req.body),
    console.log(req.files);
})