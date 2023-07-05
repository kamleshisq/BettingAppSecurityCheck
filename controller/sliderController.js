const sliderModel = require('../model/sliderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require("../utils/AppError");

exports.createNewSlider = catchAsync(async(req, res, next) => {
    let newSlider = await sliderModel.create(req.body)
    if(newSlider){
        res.status(200).json({
            status:"success",
            newSlider
        })
    }
})


exports.addImage = catchAsync(async(req, res, next) =>{
    if(req.files){
        if(req.files.image.mimetype.startsWith('image')){
            const image = req.files.image
            // console.log(logo)
            image.mv(`public/sliderImages/${req.body.menuName}.png`, (err)=>{
                if(err) 
                return next(new AppError("Something went wrong please try again later", 400))
                // console.log(err)
            })
            let slider = await sliderModel.findById(req.body.id)
            slider.images.push({name:req.body.menuName, url: req.body.url})
            slider.save((err) => {
                if (err) {
                  console.error(err);
                } else {
                  res.status(200).json({
                    status:'success'
                  })
                }
              });
        }else{
            return next(new AppError("Please upload an image file", 400))
        }
    }else{
    return next(new AppError("Aplease Uploade Image"))
   } 
})