const catchAsync = require('../utils/catchAsync');
const AppError = require("../utils/AppError");
const pageModel = require("../model/pageModel");


exports.createPage = catchAsync(async(req, res, next) =>{
    let whiteLabel = process.env.whiteLabelName
    if(req.currentUser.role_type == 1){
        whiteLabel = "1"
    }
    req.body.whiteLabelName = whiteLabel
    const newPage = await pageModel.create(req.body)
    if(newPage){
      res.status(200).json({
        status:"success",
        message:"Page created!!"
      })
    }
})