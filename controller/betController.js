const betModel =  require("../model/betmodel");
const AppError = require('../utils/AppError');
const catchAsync = require('./../utils/catchAsync');

exports.getBetListByUser = catchAsync(async(req, res, next) =>{
    // console.log(req.query.id)
    const betList = await betModel.find({userId:req.query.id}) 
    res.status(200).json({
        status:"success",
        results:betList.length,
        betList
    })
})