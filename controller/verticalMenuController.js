const verticalMenuModel = require("../model/verticalMenuModel");
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/AppError");

exports.createVerticalMenu = catchAsync(async(req, res, next) => {
    console.log(req.body, 2335455)
})