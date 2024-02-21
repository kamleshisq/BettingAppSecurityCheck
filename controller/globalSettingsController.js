const globlalSettingsModel = require('../model/globalSetting');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const whiteLabel = require('../model/whitelableModel');
const colorCodeModel = require('../model/colorcodeModel');

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

exports.createData = catchAsync(async(req, res, next) => {
    // console.log('i am here')
    const whiteLabels = await whiteLabel.find()
    if(whiteLabels.length > 0){
        
        for(let i = 0; i < whiteLabels.length; i++){
            let data = {
                logo1:'Royal777',
                logo2 : 'Royal77701',
                contactNumber : '123456789',
                email : 'info@gmail.com',
                whiteLabel:whiteLabels[i].whiteLabelName
            }
            await globlalSettingsModel.create(data)
        }
    }
})


exports.updateBasicDetails = catchAsync(async(req, res, next) => {
    // if(req.body.files)
    if(req.body.table == 'myModal9'){
        let data = await globlalSettingsModel.findByIdAndUpdate(req.body.id, {email:req.body.email, contactNumber:req.body.contact})
        if(data){
            res.status(200).json({
                status:'sucess',
                data
            })
        }else{
            return next(new AppError("Please try again leter", 404))
        }
    }else if (req.body.table == 'myModal7'){
        if(req.files && req.files.file.mimetype.startsWith('image')){
            const image = req.files.file
			/**/			
			let whiteLabel =req.currentUser.whiteLabel;
			let path="public/logo/"	
			if(req.currentUser.roleName === "Admin" || req.currentUser.roleName === "Operator")
			{
				let WhiteLBL= getWhiteLabelDetails("",req);
				if(WhiteLBL.whitelabelpath!='' && WhiteLBL.whitelabelpath != undefined)
					path = `/var/www/LiveBettingApp/${WhiteLBL.whitelabelpath}/bettingApp/public/logo/`;
					
				if(WhiteLBL.whiteLabelName !='')
				{
					whiteLabel = WhiteLBL.whiteLabelName;
				}
			}			
			/**/
			
            image.mv(`${path}${whiteLabel}1.webp`, (err)=>{
                if(err) 
                return next(new AppError("Something went wrong please try again later", 400))
            })
            let data = await globlalSettingsModel.findByIdAndUpdate(req.body.id, {logo1:`${whiteLabel}1`})
            if(data){
                res.status(200).json({
                    status:'sucess',
                    data
                })
            }else{
                return next(new AppError("Please try again leter", 404))
            }
        }else{
            return next(new AppError("Please upload an Image", 404))
        }
    }else if (req.body.table == 'myModa18'){
        if(req.files && req.files.file.mimetype.startsWith('image')){
			/**/			
			let whiteLabel = req.currentUser.whiteLabel;
			let path="public/logo/"	
			if(req.currentUser.roleName === "Admin" || req.currentUser.roleName === "Operator")
			{
				let WhiteLBL= getWhiteLabelDetails("",req);
				if(WhiteLBL.whitelabelpath!='' && WhiteLBL.whitelabelpath != undefined )
					path = `/var/www/LiveBettingApp/${WhiteLBL.whitelabelpath}/bettingApp/public/logo/`;
					
				if(WhiteLBL.whiteLabelName !='')
				{
					whiteLabel = WhiteLBL.whiteLabelName;
				}
			}			
			/**/
			
            const image = req.files.file
            image.mv(`${path}${whiteLabel}2.webp`, (err)=>{
                if(err) 
                return next(new AppError("Something went wrong please try again later", 400))
            })
            let data = await globlalSettingsModel.findByIdAndUpdate(req.body.id, {logo2:`${whiteLabel}2`})
            if(data){
                res.status(200).json({
                    status:'sucess',
                    data
                })
            }else{
                return next(new AppError("Please try again leter", 404))
            }
        }else{
            return next(new AppError("Please upload an Image", 404))
        }
    }
})


exports.updateColorCode = catchAsync(async(req, res, next) => {
    // console.log(req.body)
})