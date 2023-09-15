const userModel = require("../model/userModel");
const catchAsync = require('../utils/catchAsync');

exports.checkPass = catchAsync(async(data , pass) => {
    try{
        const user = await userModel.findOne({userName:data.userName}).select('+password');
                console.log(user)
                if(!user || !(await user.correctPassword(pass, user.password))){
                    console.log("WRONG")
                    return false;
                }else{
                    console.log("RIght")
                    return true;
                }
    }catch(err){
        console.log(err)
        return false;
    }
})