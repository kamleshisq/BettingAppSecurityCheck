const horizontalMenuModel = require("../model/horizontalMenuModel");
const catchAsybc = require("../utils/catchAsync");
const AppError = require("../utils/AppError");


exports.createHorizontalMenu = catchAsybc(async(req, res, next) => {
    let allMenu = await horizontalMenuModel.find()
    if(req.files){
        if(req.files.Icon.mimetype.startsWith('image')){
            const image = req.files.Icon
            // console.log(logo)
            image.mv(`public/imgForHMenu/${req.body.menuName}.png`, (err)=>{
                if(err) 
                return next(new AppError("Something went wrong please try again later", 400))
                // console.log(err)
            })
        }else{
            return next(new AppError("Please upload an image file", 400))
        }
        req.body.icon = req.body.menuName
    }
    if(req.body.num > (allMenu.length + 1)){
        req.body.Number = (allMenu.length + 1)
    }else{
        req.body.Number = req.body.num
    }
    const newMenu = await horizontalMenuModel.create(req.body);
    res.status(200).json({
        status:"success",
        newMenu
    })
})