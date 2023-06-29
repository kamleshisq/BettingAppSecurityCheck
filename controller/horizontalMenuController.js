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
});



exports.updateHorizontalMenu = catchAsybc(async(req, res, next) => {
    let check = await horizontalMenuModel.findById(req.body.id);
    if(!(check.Number == req.body.Number)){
        console.log("not same")
    }
    if(req.files){
        if(req.files.file.mimetype.startsWith('image')){
            const image = req.files.file
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
    if(req.body.check){
        req.body.status = true
    }else{
        req.body.status = false
    }
    // const updatedMenu = await horizontalMenuModel.findByIdAndUpdate(req.body.id, req.body)
    res.status(200).json({
        status:'success',
        // updatedMenu
    })
})