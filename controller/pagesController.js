const catchAsync = require('../utils/catchAsync');
const AppError = require("../utils/AppError");
const pageModel = require("../model/pageModel");


exports.createPage = catchAsync(async(req, res, next) =>{
    console.log(req.body)
})