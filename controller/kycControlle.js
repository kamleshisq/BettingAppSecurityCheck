const catchAsynch = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const userModel = require("../model/userModel");
const path = require('path');
// data.kycDoc = path.join(__dirname, 'documents', req.currentUser.userName);
// console.log(logo)


exports.uploadphoto = catchAsynch(async(req, res, next) => {
    if(req.files != null){
        let data = {}
        if(req.files.file.mimetype.startsWith('application/pdf')){
            const image = req.files.file
            data.kycDoc = `/var/www/bettingApp/documents/${req.currentUser.userName}`
            image.mv(`${data.kycDoc}.pdf`, (err)=>{
                if(err) 
                return next(new AppError("Something went wrong please try again later", 400))
            })
            data.kycDocName = req.body.name
            data.kycDocNum = req.body.CardId
            data.kycNotification = true
            let updatedUser = await userModel.findByIdAndUpdate(req.currentUser.id, data)
            if(updatedUser){
                res.status(200).json({
                    status:"success"
                })
            }

        }else{
            return next(new AppError("Please Upload pdf", 404))
        }
    }else{
        return next(new AppError("Please Upload pdf", 404))
    }
})