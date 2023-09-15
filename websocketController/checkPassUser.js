const userModel = require("../model/userModel");
const catchAsync = require('../utils/catchAsync');

exports.checkPass = catchAsync(async(data , pass) => {
    const user = await userModel.findOne({userName:data.userName}).select('+password');
            console.log(user)
            if(!user || !(await user.correctPassword(pass, user.password))){
                return false
            }else{
                return true
            }
})