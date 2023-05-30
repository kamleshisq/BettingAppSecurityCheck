const userModel = require('../model/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');


exports.getUserBalancebyiD = catchAsync(async(req, res, next) => {
    console.log(req.body)
    const user = await userModel.findById(req.body.userId)
    if(!user){
        return next(new AppError("There is no user with that id", 404))
    }
    res.status(200).json({
        "balance": user.availableBalance,
        "status": "OP_SUCCESS"
    })
})