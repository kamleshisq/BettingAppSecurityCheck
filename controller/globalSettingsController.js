const globlalSettingsModel = require('../model/globalSetting');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const whiteLabel = require('../model/whitelableModel');

exports.createData = catchAsync(async(req, res, next) => {
    const whiteLabels = await whiteLabel.find()
    if(whiteLabels.length > 0){
        for(let i = 0; i < whiteLabels.length; i++){
            let data = {
                name:'photo',
                whiteLabel : whiteLabels[i].whiteLabelName,
                
            }
        }
    }
})