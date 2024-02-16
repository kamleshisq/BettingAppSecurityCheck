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
            image.mv(`public/img/${req.body.position}.webp`, (err)=>{
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
        let whiteLabel = process.env.whiteLabelName
        if(req.currentUser.role_type == 1){
            whiteLabel = "1"
        }
        data.whiteLabelName = whiteLabel
        const newPosition = await promotion.create(data)
        res.status(200).json({
            status:"success",
            newPosition
        })

    }

});

exports.updatePosition = catchAsync(async(req, res, next) => {
    let data = {}
    if(req.files){
        if(req.files.image.mimetype.startsWith('image')){
            data.video = false
            const image = req.files.image
            // console.log(logo)
            image.mv(`public/img/${req.body.position}.webp`, (err)=>{
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
    }
        data.position = req.body.position
        data.Image = req.body.position
        data.link = req.body.link
        let whiteLabel = process.env.whiteLabelName
        if(req.currentUser.role_type == 1){
            whiteLabel = "1"
        }
        req.body.whiteLabelName = whiteLabel
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
});


exports.deletePosition = catchAsync(async(req, res, next) => {
    // console.log(req.body.id)
    const deletedposition = await promotion.findByIdAndDelete(req.body.id);
    if(!deletedposition){
        return next(new AppError("Ops! Something went wrong please try again later", 404))
    }
    res.status(200).json({
        status:"success",
        data:[]
    })
})