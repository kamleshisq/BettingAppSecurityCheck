const globlalSettingsModel = require('../model/globalSetting');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const whiteLabel = require('../model/whitelableModel');

exports.createData = catchAsync(async(req, res, next) => {
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
    console.log(req.body)
    console.log(req.files)
})