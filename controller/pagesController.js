const catchAsync = require('../utils/catchAsync');
const AppError = require("../utils/AppError");
const pageModel = require("../model/pageModel");


exports.createPage = catchAsync(async(req, res, next) =>{
    console.log(req.body)
    console.log(req.files)
    const ejsFile = req.files.ejsFile;
    const fileName = `${req.body.Name}`
    ejsFile.mv('views/pages/' + fileName, async(err) => {
      if (err) {
        console.error(err);
        res.status(500).json({
            status:'error',
            message:"File upload failed."
        })
      } else {
        let page = await pageModel.create(req.body)
        res.status(200).json({
            status:"success",
            message:"Page created successfully"
        })
      }
    });
})