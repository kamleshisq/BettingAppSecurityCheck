const verticalMenuModel = require("../model/verticalMenuModel");
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/AppError");

exports.createVerticalMenu = catchAsync(async(req, res, next) => {
    let allMenu = await verticalMenuModel.find()
    console.log(allMenu.length)
})