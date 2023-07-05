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
    console.log(req.body)
    console.log(req.files)
})