const horizontalMenuModel = require("../model/horizontalMenuModel");
const catchAsybc = require("../utils/catchAsync");
const AppError = require("../utils/AppError");


exports.createHorizontalMenu = catchAsybc(async(req, res, next) => {
    let allMenu = await horizontalMenuModel.find({whiteLabelName:process.env.whiteLabelName})
    if(req.files){
        if(req.files.Icon.mimetype.startsWith('image')){
            const image = req.files.Icon
            // console.log(logo)
            image.mv(`public/imgForHMenu/${req.body.menuName}.webp`, (err)=>{
                if(err) 
                return next(new AppError("Something went wrong please try again later", 400))
                // console.log(err)
            })
        }else{
            return next(new AppError("Please upload an image file", 400))
        }
        req.body.icon = req.body.menuName
    }
    req.body.Number = (allMenu.length + 1)
    req.body.whiteLabelName = process.env.whiteLabelName
    const newMenu = await horizontalMenuModel.create(req.body);
    res.status(200).json({
        status:"success",
        newMenu
    })
});



exports.updateHorizontalMenu = catchAsybc(async(req, res, next) => {
    // console.log(req.body)
    let allMenu = await horizontalMenuModel.find({whiteLabelName:process.env.whiteLabelName})
    let check = await horizontalMenuModel.findById(req.body.id);
    if(!(check.Number == req.body.num)){
        if(req.body.num > allMenu.length ){
            req.body.Number = allMenu.length
            await horizontalMenuModel.findOneAndUpdate({Number:req.body.Number,whiteLabelName:process.env.whiteLabelName}, {Number:check.Number})
        }else if(req.body.num < 1){
            return next(new AppError("Please provide positive number"))
        }else{
            let newNumber = req.body.num
            await horizontalMenuModel.findOneAndUpdate({Number:newNumber,whiteLabelName:process.env.whiteLabelName}, {Number:check.Number})
            req.body.Number = req.body.num  
        }
    }
    if(req.files){
        if(req.files.file.mimetype.startsWith('image')){
            const image = req.files.file
            // console.log(logo)
            image.mv(`public/imgForHMenu/${req.body.menuName}.webp`, (err)=>{
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
    const updatedMenu = await horizontalMenuModel.findByIdAndUpdate(req.body.id, req.body)
    res.status(200).json({
        status:'success',
        updatedMenu
    })
})