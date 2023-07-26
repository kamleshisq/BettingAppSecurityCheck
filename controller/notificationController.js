const notificationModel = require("../model/notificationModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.createNewNotification = catchAsync(async(req, res, next) => {
    // console.log(req.body)
    if(req.body.Sdate === req.body.Edate){
        return next(new AppError("Both starting and ending date are same that is not acceptable", 404))
    }
    let data = {
        title : req.body.title,
        message : req.body.message,
        startDate : new Date(req.body.Sdate),
        endDate : new Date(req.body.Edate),
        userId : req.body.userId
    }
    // console.log(data)
    let newNotification = await notificationModel.create(data)
    res.status(200).json({
        status:'success',
        newNotification
    })
});


exports.getMyNotification = catchAsync(async(req, res, next) => {
    const notifications = await notificationModel.find({userId:req.currentUser._id})
    res.status(200).json({
        status:'success',
        notifications
    })
});


exports.updateNotificationStatus = catchAsync(async(req, res, next) => {
    const notification = await notificationModel.findOne({ _id: req.query.id });
    notification.status = !notification.status;
    await notification.save();
    res.status(200).json({
        id : notification.id,
        status:notification.status
    })
});

exports.deleteNotification = catchAsync(async(req, res, next) => {
    await notificationModel.findByIdAndDelete(req.query.id)
    res.status(200).json({
        status:'success'
    })
});


exports.myNotifications = catchAsync(async(req, res, next) => {
    console.log(req.currentUser, 789)
    let user = req.currentUser;
    const today = new Date();
    let notifications = await notificationModel.find({userId:{$in:user.parentUsers},startDate: { $lte: today },endDate: { $gte: today },status:true})
    req.notifications = notifications
    next()
})