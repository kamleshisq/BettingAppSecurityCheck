const userModel = require("../model/userModel");
// const catchAsync = require('../utils/catchAsync');

exports.checkPass = (data , pass) => {
    return new Promise(async (resolve, reject) => {
        try{
            const user = await userModel.findOne({userName:data.userName}).select('+password');
                    console.log(user)
                    if(!user || !(await user.correctPassword(pass, user.password))){
                        console.log("WRONG")
                        resolve(false);
                    }else{
                        console.log("RIght")
                        resolve(true);
                    }
        }catch(err){
            console.log(err)
            resolve(false);
        }
    })
}