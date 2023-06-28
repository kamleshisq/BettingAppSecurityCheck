const verticalMenuModel = require("../model/verticalMenuModel");
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/AppError");

exports.createVerticalMenu = catchAsync(async(req, res, next) => {
    let allMenu = await verticalMenuModel.find()
    if((req.body.num * 1) > (allMenu.length + 1) ){
        req.body.num = (allMenu.length + 1)
    }
    console.log(req.body)
    let newMenu = await verticalMenuModel.create(req.body);
    res.status(200).json({
        status:"success",
        newMenu
    })
})