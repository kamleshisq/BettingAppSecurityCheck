const bannerModel =  require("../model/bannerModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const socialinfomodel = require('../model/socialMediaLinks');
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

exports.createBanner = catchAsync(async(req, res, next) => {
    if(req.files){
        if(req.files.banner.mimetype.startsWith('image')){
            const image = req.files.banner
            // console.log(logo)
            image.mv(`public/banner/${req.body.bannerName}.webp`, (err)=>{
                if(err) return next(new AppError("Something went wrong please try again later", 400))
            })
            req.body.banner = req.body.bannerName
            let whiteLabel = process.env.whiteLabelName
            if(req.currentUser.role_type == 1){
                whiteLabel = "1"
            }
            req.body.whiteLabelName = whiteLabel
            const newBanner = await bannerModel.create(req.body);
            res.status(200).json({
                status:"success",
                newBanner
            })
        }else{
            return next(new AppError("Please Provide Image", 400))
        }
    }else{
        return next(new AppError("Please Provide Image", 404))
    }
});


exports.createMedia = catchAsync(async(req, res, next) => {
    console.log(req.files, req.body)
    if(req.files){
        if(req.files.img.mimetype.startsWith('image')){
            const image = req.files.img
            // console.log(logo)
            image.mv(`public/banner/${req.body.name}.webp`, (err)=>{
                if(err) return next(new AppError("Something went wrong please try again later", 400))
            })
            let pathname = `/banner/${req.body.name}.webp`
            req.body.banner = req.body.name
            let whiteLabel = process.env.whiteLabelName
            if(req.currentUser.role_type == 1){
                whiteLabel = "1"
            }
            req.body.whiteLabelName = whiteLabel
            let createData = {
                name : req.body.name,
                img : pathname,
                link : req.body.link,
                whiteLabelName : whiteLabel
            }
            let newBanner = await socialinfomodel.create(createData)
            res.status(200).json({
                status:"success",
                newBanner
            })
        }else{
            return next(new AppError("Please Provide Image", 400))
        }
    }else{
        return next(new AppError("Please Provide Image", 404))
    }
});


exports.updateBanner = catchAsync(async(req, res, next) => {
    // console.log(req.body)
    // console.log(req.files)
	let WhiteLBL= getWhiteLabelDetails("",req);
	let path="public/banner/"
	
	if(WhiteLBL.whitelabelpath!='' || true)
		path = "/var/www/LiveBettingApp/dev.ollscores.com/bettingApp/public/banner/";
		
	
		
	console.log(path);
	
    if(req.body.check){
        req.body.status = true
    }else{
        req.body.status = false
    }
    if(req.files){
        if(req.files.file.mimetype.startsWith('image')){
            const image = req.files.file
            // console.log(logo)
             console.log(image,'==>image')
            image.mv(`path+${req.body.Name}.webp`, (err)=>{
                if(err) return next(new AppError("Something went wrong please try again later", 400))
            })

            // console.log('here')
            req.body.banner = req.body.Name
        }else{
            return next(new AppError("Please Provide Image", 400))
        }
    }
    const updatedBanner = await bannerModel.findByIdAndUpdate(req.body.id,req.body);
    res.status(200).json({
        status:"success",
        updatedBanner
    })
    
})