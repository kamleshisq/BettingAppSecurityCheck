// const { contentSecurityPolicy } = require('helmet');
const promotion = require('../model/promotion');
const catchAsync = require('../utils/catchAsync');

exports.createPosition = catchAsync(async(req, res, next) => {
    console.log(req.body, req.file)
})