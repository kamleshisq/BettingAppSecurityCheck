const verticalMenuModel = require("../model/verticalMenuModel");
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/AppError");

exports.createVerticalMenu = catchAsync(async(req, res, next) => {
    let whiteLabel = process.env.whiteLabelName
    if(req.currentUser.role_type == 1){
        whiteLabel = "1"
    }
    let allMenu = await verticalMenuModel.find({whiteLabelName:whiteLabel})
    req.body.num = (allMenu.length + 1)
    req.body.whiteLabelName = whiteLabel
    let newMenu
    try{
        newMenu = await verticalMenuModel.create(req.body);
        res.status(200).json({
            status:"success",
            newMenu
        })
        
    }catch(err){
        console.log(err)
        res.status(err.status).json({
            status:"Error",
            err
        })
    }
    
})