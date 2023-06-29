const horizontalMenuModel = require("../model/horizontalMenuModel");
const catchAsybc = require("../utils/catchAsync");
const AppError = require("../utils/AppError");


exports.createHorizontalMenu = catchAsybc(async(req, res, next) => {
    console.log(req.body, 98765430)
    console.log(req.files, 1)
    console.log(req.file, 2)
})