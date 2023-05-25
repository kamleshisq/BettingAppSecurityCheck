// const { contentSecurityPolicy } = require('helmet');
const promotion = require('../model/promotion');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createPosition = catchAsync(async(req, res, next) => {
    let data = {}
    if(req.files){
        if(req.files.image.mimetype.startsWith('image')){
            data.video = false
            const image = req.files.image
            // console.log(logo)
            image.mv(`public/img/${req.body.position}.png`, (err)=>{
                if(err) return next(new AppError("Something went wrong please try again later", 400))
            })
        }else{
            data.video = true
            // return next(new AppError('Please Upload An Image', 404))
            const image = req.files.image
            // console.log(logo)
            image.mv(`public/img/${req.body.position}.mp4`, (err)=>{
                if(err) return next(new AppError("Something went wrong please try again later", 400))
            })
        }

        data.position = req.body.position
        data.Image = req.body.position
        const newPosition = await promotion.create(data)
        res.status(200).json({
            status:"Success",
            newPosition
        })

    }

});

exports.updatePosition = catchAsync(async(req, res, next) => {
    // console.log(req.body)
    let data = {}
    if(req.files){
        if(req.files.image.mimetype.startsWith('image')){
            const image = req.files.image
            // console.log(logo)
            image.mv(`public/img/${req.body.position}.png`, (err)=>{
                if(err) return next(new AppError("Something went wrong please try again later", 400))
            })
        }else{
            // return next(new AppError('Please Upload An Image', 404))
            const image = req.files.image
            // console.log(logo)
            image.mv(`public/img/${req.body.position}.mp4`, (err)=>{
                if(err) return next(new AppError("Something went wrong please try again later", 400))
            })
        }
    }
        data.position = req.body.position
        data.Image = req.body.position
        if(req.body.status == "on"){
            data.status = true
        }else{
            data.status = false
        }
        // console.log(data)
        const newPosition = await promotion.findByIdAndUpdate(req.body.Id,data)
        res.status(200).json({
            status:"success",
            newPosition
        })
})