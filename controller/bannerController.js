const bannerModel =  require("../model/bannerModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.createBanner = catchAsync(async(req, res, next) => {
    console.log(req.body)
})