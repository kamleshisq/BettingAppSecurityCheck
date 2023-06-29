const horizontalMenuModel = require("../model/horizontalMenuModel");
const catchAsybc = require("../utils/catchAsync");
const AppError = require("../utils/AppError");


exports.createHorizontalMenu = catchAsybc(async(req, res, next) => {
    let data = {}
    if(req.files){
        if(req.files.image.mimetype.startsWith('image')){
            data.video = false
            const image = req.files.image
            // console.log(logo)
            image.mv(`public/img/${req.body.position}.png`, (err)=>{
                if(err) return next(new AppError("Something went wrong please try again later", 400))
            })
        }else if(req.files.image.mimetype.startsWith('video')){
            // console.log(req.files)
            data.video = true
            // return next(new AppError('Please Upload An Image', 404))
            const image = req.files.image
            // console.log(logo)
            image.mv(`public/img/${req.body.position}.mp4`, (err)=>{
                if(err) return next(new AppError("Something went wrong please try again later", 400))
            })
        }else{
            return next(new AppError("Please upload a midea file", 400))
        }

        data.position = req.body.position
        data.Image = req.body.position
        data.link = req.body.link
        const newPosition = await promotion.create(data)
        res.status(200).json({
            status:"success",
            newPosition
        })}
})