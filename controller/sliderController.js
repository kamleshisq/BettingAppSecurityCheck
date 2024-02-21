const sliderModel = require('../model/sliderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require("../utils/AppError");
const fs = require('fs');
const whiteLabel = require('../model/whitelableModel');

async function getWhiteLabelDetails(Wlbl,req)
{	
	if(Wlbl == "" || Wlbl == null)
	{
		let cookieValue = req.cookies.WhiteLabelSelected;		
		if(cookieValue !='' && cookieValue!=null)
			Wlbl = cookieValue;
	}
	
	var WhiteLabelInfo = await whiteLabel.findOne({whiteLabelName:Wlbl});
	//console.log(WhiteLabelInfo.whiteLabelName);
	//whitelabelpath
	return WhiteLabelInfo;
}

exports.createNewSlider = catchAsync(async(req, res, next) => {
    let whiteLabel = process.env.whiteLabelName
	
	/***/
	let path="public/sliderBackgroundImages/";	
	if(req.currentUser.roleName === "Admin" || req.currentUser.roleName === "Operator")
	{
		let WhiteLBL= getWhiteLabelDetails("",req);		
		if(WhiteLBL.whitelabelpath!='')
		path = `/var/www/LiveBettingApp/${WhiteLBL.whitelabelpath}/bettingApp/public/sliderBackgroundImages/`;
		
		if(WhiteLBL.whiteLabelName !='')
		{
			whiteLabel = WhiteLBL.whiteLabelName;
		}
	}
	/***/
				
    if(req.currentUser.role_type == 1){
        whiteLabel = "1"
    }
    req.body.whiteLabelName = whiteLabel
    let allSlider = await sliderModel.find({whiteLabelName:whiteLabel})
    req.body.Number = (allSlider.length + 1)
    req.body.mainUrl = req.body.url
    req.body.whiteLabelName = whiteLabel
    if(req.files){
        if(req.files.backgroundImage.mimetype.startsWith('image')){
            const image = req.files.backgroundImage
            req.body.backGroundImage = req.body.name.split(' ')[0]
			
			
			
            image.mv(`${path}/${req.body.name.split(' ')[0]}.webp`, (err)=>{
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
			
			/***/
			let path="public/sliderImages/";	
			if(req.currentUser.roleName === "Admin" || req.currentUser.roleName === "Operator")
			{
				let WhiteLBL= getWhiteLabelDetails("",req);		
				
				if(WhiteLBL.whitelabelpath!='' && WhiteLBL.whitelabelpath!='undefined')
					path = `/var/www/LiveBettingApp/${WhiteLBL.whitelabelpath}/bettingApp/public/sliderImages/`;
				
				/*if(WhiteLBL.whiteLabelName !='')
				{
					whiteLabel = WhiteLBL.whiteLabelName;
				}*/
			}
			/***/
	console.log("PATH ----");
	console.log(WhiteLBL.whitelabelpath);
				
            image.mv(`${path}${req.body.menuName}.webp`, (err)=>{
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
    let whiteLabel = process.env.whiteLabelName
	/***/
	let path="public/sliderImages/";	
	if(req.currentUser.roleName === "Admin" || req.currentUser.roleName === "Operator")
	{
		let WhiteLBL= getWhiteLabelDetails("",req);		
		if(WhiteLBL.whitelabelpath!='')
			path = `/var/www/LiveBettingApp/${WhiteLBL.whitelabelpath}/bettingApp/public/sliderImages/`;
		
		if(WhiteLBL.whiteLabelName !='')
		{
			whiteLabel = WhiteLBL.whiteLabelName;
		}
	}
	/***/
	
    if(req.currentUser.role_type == 1){
        whiteLabel = "1"
    }
    let slider = await sliderModel.findOne({name:name,whiteLabelName:whiteLabel})
    let imageName = req.body.id.split("//")[0]
    let index = slider.images.findIndex(item => item.name == imageName)
    try{
        if(index !== -1) {
            if(req.files){
                if(req.files.file.mimetype.startsWith('image')){
                    const image = req.files.file
                    // console.log(logo)
                    image.mv(`${path}${req.body.name}.webp`, (err)=>{
                        if(err) 
                        return next(new AppError("Something went wrong please try again later", 400))
                    })
                    // slider.images[index].name = req.body.name
                    // slider.images[index].url = req.body.url
                    // await slider.save()
                    let updatedslider = await sliderModel.findOneAndUpdate({name:name,whiteLabelName:whiteLabel},{
                        $set: {
                          [`images.${index}.name`]: req.body.name,
                          [`images.${index}.url`]: req.body.url,
                        },
                      })
                    res.status(200).json({
                        status:"success"
                    })
                }else{
                    return next(new AppError("Please upload an image file", 400))
                }
            }else{
            let originalImage = `${path}${slider.images[index].name}.webp`
            let updatedPath = `${path}${req.body.name}.webp`
            fs.rename(originalImage, updatedPath, (err) => {
                if (err) {
                  console.error('Error renaming file:', err);
                } else {
                  console.log('File renamed successfully');
                }
              });
              let updatedslider = await sliderModel.findOneAndUpdate({name:name,whiteLabelName:whiteLabel},{
                $set: {
                  [`images.${index}.name`]: req.body.name,
                  [`images.${index}.url`]: req.body.url,
                },
              })
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
    // console.log('WORKING12365479987')
    let whiteLabel = process.env.whiteLabelName
	/***/
	let path="public/sliderBackgroundImages/";	
	if(req.currentUser.roleName === "Admin" || req.currentUser.roleName === "Operator")
	{
		let WhiteLBL= getWhiteLabelDetails("",req);		
		if(WhiteLBL.whitelabelpath!='')
			path = `/var/www/LiveBettingApp/${WhiteLBL.whitelabelpath}/bettingApp/public/sliderBackgroundImages/`;
		
		if(WhiteLBL.whiteLabelName !='')
		{
			whiteLabel = WhiteLBL.whiteLabelName;
		}
	}
	/***/
	
    if(req.currentUser.role_type == 1){
        whiteLabel = "1"
    }
    let allSlider = await sliderModel.find({whiteLabelName:whiteLabel})
    if(req.files){
        if(req.files.file.mimetype.startsWith('image')){
            const image = req.files.file
            // console.log(logo)
            image.mv(`${path}${req.body.name.split(' ')[0]}.webp`, (err)=>{
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
            await sliderModel.findOneAndUpdate({Number:newNum,whiteLabelName:whiteLabel},{Number:Sport.Number})
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