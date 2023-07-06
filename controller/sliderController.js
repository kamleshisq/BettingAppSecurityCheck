const sliderModel = require('../model/sliderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require("../utils/AppError");

exports.createNewSlider = catchAsync(async(req, res, next) => {
    let newSlider = await sliderModel.create(req.body)
    if(newSlider){
        res.status(200).json({
            status:"success",
            newSlider
        })
    }
})


exports.addImage = catchAsync(async(req, res, next) =>{
    if(req.files){
        if(req.files.image.mimetype.startsWith('image')){
            const image = req.files.image
            // console.log(logo)
            image.mv(`public/sliderImages/${req.body.menuName}.png`, (err)=>{
                if(err) 
                return next(new AppError("Something went wrong please try again later", 400))
            })
            let slider = await sliderModel.findById(req.body.id)
            let check = slider.images.find(item => item.name == req.body.menuName)
            if(!check){
                slider.images.push({name:req.body.menuName, url: req.body.url})
                let updatedSlider = await sliderModel.findByIdAndUpdate(req.body.id, slider)
                if(updatedSlider){
                    res.status(200).json({
                        status:"success"
                    })
                }
            }else{
                return next(new AppError("Image name is already exist"))
            }
        }else{
            return next(new AppError("Please upload an image file", 400))
        }
    }else{
    return next(new AppError("Aplease Uploade Image"))
   } 
});


exports.updateSlider = catchAsync(async(req, res, next) => {
    console.log(req.body)
    console.log(req.files)
    // socket.on("UpdateSport", async(data) => {
    //     let newNum = data.Number
    //     let Sport = await sliderModel.findOne({name:`${data.N}`})
    //     if(newNum == Sport.Number){
    //          await sliderModel.findByIdAndUpdate(Sport._id, {mainUrl:data.url})
    //          socket.emit("UpdateSport", "Updated Successfully")
    //     }else if(newNum < 1){
    //         socket.emit("UpdateSport", "Please provide positive number")
    //     }else{
    //         if(newNum > 3){
    //             newNum = 3
    //         }
    //         await sliderModel.findByIdAndUpdate(Sport._id,{mainUrl:data.url, Number:newNum})
    //         await sliderModel.findOneAndUpdate({Number:newNum}, {Number:sport.Number})
    //         socket.emit("UpdateSport", "Updated Successfully")
    //     }
    // })
})