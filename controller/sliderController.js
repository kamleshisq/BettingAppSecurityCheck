const sliderModel = require('../model/sliderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require("../utils/AppError");
const fs = require('fs')

exports.createNewSlider = catchAsync(async(req, res, next) => {
    let allSlider = await sliderModel.find()
    req.body.Number = (allSlider.length + 1)
    req.body.mainUrl = req.body.url
    if(req.files){
        if(req.files.backgroundImage.mimetype.startsWith('image')){
            const image = req.files.backgroundImage
            // console.log(logo)
            req.body.backGroundImage = req.body.name.split(' ')[0]
            image.mv(`public/sliderBackgroundImages/${req.body.name.split(' ')[0]}.png`, (err)=>{
                if(err) 
                return next(new AppError("Something went wrong please try again later", 400))
            })
            let newSlider = await sliderModel.create(req.body)
            if(newSlider){
                res.status(200).json({
                    status:"success"
                })
            }
        }else{
            return next(new AppError("Please Upload an image", 404))
        }
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



exports.editSliderinImage =  catchAsync(async(req, res, next) => {
    let name = req.body.id.split("//")[1]
    let slider = await sliderModel.findOne({name:name})
    let imageName = req.body.id.split("//")[0]
    let index = slider.images.findIndex(item => item.name == imageName)
    console.log(req.body.name, req.body.url)
    try{
        if(index !== -1) {
            console.log(slider.images[index])
            if(req.files){
                if(req.files.file.mimetype.startsWith('image')){
                    const image = req.files.file
                    // console.log(logo)
                    image.mv(`public/sliderImages/${req.body.name}.png`, (err)=>{
                        if(err) 
                        return next(new AppError("Something went wrong please try again later", 400))
                    })
                    slider.images[index].name = req.body.name
                    slider.images[index].url = req.body.url
                    await slider.save()
                    res.status(200).json({
                        status:"success"
                    })
                }else{
                    return next(new AppError("Please upload an image file", 400))
                }
            }else{
            let originalImage = `public/sliderImages/${slider.images[index].name}.png`
            let updatedPath = `public/sliderImages/${req.body.name}.png`
            fs.rename(originalImage, updatedPath, (err) => {
                if (err) {
                  console.error('Error renaming file:', err);
                } else {
                  console.log('File renamed successfully');
                }
              });
            slider.images[index].name = req.body.name
            slider.images[index].url = req.body.url
            console.log(slider)
            await slider.save()
            res.status(200).json({
                status:"success"
            })
           } 
        }else{
            return next(new AppError('please tyr again leter', 404))
        }

    }catch(err){
        console.log(err)
        return next(new AppError('please tyr again leter', 404))
    }
    
})


exports.updateSlider = catchAsync(async(req, res, next) => {
    let allSlider = await sliderModel.find()
    if(req.files){
        if(req.files.file.mimetype.startsWith('image')){
            const image = req.files.file
            // console.log(logo)
            image.mv(`public/sliderBackgroundImages/${req.body.name.split(' ')[0]}.png`, (err)=>{
                req.body.backGroundImage = req.body.name.split(' ')[0]
                if(err) 
                return next(new AppError("Something went wrong please try again later", 400))
            })
        }else{
            return next(new AppError("Please Upload an image", 404))
        }
    }
        let status
        if(req.body.check){
            status = true
        }else{
            status = false
        }
        let newNum = parseInt(req.body.Number)
        let Sport = await sliderModel.findById(req.body.id)
        if(newNum == Sport.Number){
             await sliderModel.findByIdAndUpdate(Sport._id, {mainUrl:req.body.url, name:req.body.name, status:status})
             res.status(200).json({
                status:"success"
             })
        }else if(newNum < 1){
            return next(new AppError("Please provide a positive number", 404))
        }else{
            if(newNum > (allSlider.length + 1)){
                newNum = allSlider.length
            }
            await sliderModel.findOneAndUpdate({Number:newNum},{Number:Sport.Number})
            await sliderModel.findByIdAndUpdate(Sport._id, {mainUrl:req.body.url, name:req.body.name, status:status, Number:newNum})
            
            res.status(200).json({
                status:"success"
             })
    }
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