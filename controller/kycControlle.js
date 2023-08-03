const catchAsynch = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const userModel = require("../model/userModel");
const path = require('path');


exports.uploadphoto = catchAsynch(async(res, req, next) => {
    console.log(req.file)
    console.log(req.body)
})