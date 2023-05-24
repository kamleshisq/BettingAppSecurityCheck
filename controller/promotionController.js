// const { contentSecurityPolicy } = require('helmet');
const promotion = require('../model/promotion');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createPosition = catchAsync(async(req, res, next) => {
    // console.log(req.files.image)
    if(req.files){
        if(req.files.image.mimetype.startsWith('image')){
            const image = req.files.image
            // console.log(logo)
            image.mv(`public/img/${req.body.position}.png`, (err)=>{
                if(err) return next(new AppError("Something went wrong please try again later", 400))
            })
        }else{
            return next(new AppError('Please Upload An Image', 404))
        }

        let data = {}
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
        let data = {}
        data.position = req.body.position
        data.Image = req.body.position
        const newPosition = await promotion.findOneAndUpdate({position : req.body.Bposition},data)
        res.status(200).json({
            status:"success",
            newPosition
        })
})