const Betlimit = require('./../model/betLimitModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

exports.createBetlimit = catchAsync(async(req,res,next)=>{
    const betlimit = await Betlimit.create(req.body)

    res.status(200).json({
        status:'success',
        betlimit
    })
})


exports.updateBetLimit = catchAsync(async(req, res, next)=>{
    let Id = req.body.id;
    delete req.body['id'];
    const betLimit = await Betlimit.findByIdAndUpdate(Id,req.body,{new:true})
    res.status(200).json({
        status:'success',
        betLimit
    })
})
