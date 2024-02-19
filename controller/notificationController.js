const notificationModel = require("../model/notificationModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const userModel = require('../model/userModel');

exports.createNewNotification = catchAsync(async(req, res, next) => {
    // console.log(req.body)
    if(req.body.Sdate === req.body.Edate){
        return next(new AppError("Both starting and ending date are same that is not acceptable", 404))
    }

    let ID = req.body.userId
    let currentUser = await userModel.findById(ID)
    if(currentUser.roleName === "Operator"){
        ID = currentUser.parent_id
    }
    let data = {
        title : req.body.title,
        message : req.body.message,
        startDate : new Date(req.body.Sdate),
        endDate : new Date(req.body.Edate),
        userId : ID
    }
    // console.log(data)
    let newNotification = await notificationModel.create(data)
    res.status(200).json({
        status:'success',
        newNotification
    })
});


exports.getMyNotification = catchAsync(async(req, res, next) => {
    let id = req.currentUser._id
    if(req.currentUser.roleName === "Operator"){
        id = req.currentUser.parent_id
    }
    const notifications = await notificationModel.find({userId:id})
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
    // console.log('WORKINGNOTIFICATION', req.currentUser)
    if(req.currentUser){
        let user = req.currentUser;
        const today = new Date();
        let notifications = await notificationModel.find({userId:{$in:user.parentUsers}})
        req.notifications = notifications
        next()
    }else{
        const today = new Date();
        let notifications = await notificationModel.find({userId:{$in:"6492fd6cd09db28e00761691"}})
        req.notifications = notifications
        // console.log('WORKINGNOTIFICATION')
        next()
    }
    // console.log('WORKINGNOTIFICATION222')
})