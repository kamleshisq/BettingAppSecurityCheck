const catchAsynch = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const userModel = require("../model/userModel");
const path = require('path');


exports.uploadphoto = catchAsynch(async(req, res, next) => {
    console.log(req.files)
    console.log(req.body)
    console.log("req.body")
})