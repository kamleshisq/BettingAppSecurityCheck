const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const User = require("../model/userModel");
const Role = require('./../model/roleModel')
// const { required } = require("joi");
const accountStatement = require('../model/accountStatementByUserModel');
// const { use } = require("../routes/viewRoutes");

exports.deposit = catchAsync(async(req, res, next) => {
    // console.log(req.body)
    const childUser = await User.findById(req.body.id);
    const parentUser = await User.findById(childUser.parent_id);
    req.body.amount = req.body.amount * 1
    // console.log(req.body)
    // console.log(childUser)
    if(childUser.role.role_level < parentUser.role.role_level){
        return next(new AppError("you do not have permission to perform this action", 404))
    } 
    let userData = {}
    let parentData = {}
    if(parentUser.availableBalance < req.body.amount){
        return next(new AppError("Insufficient Credit Limit !"))
    }

    userData.balance = (childUser.balance + req.body.amount);
    userData.availableBalance = (childUser.availableBalance + req.body.amount);
    // userData.lifeTimeCredit = (childUser.lifeTimeCredit + req.body.amount);
    parentData.availableBalance = (parentUser.availableBalance - req.body.amount);
    // parentData.lifeTimeDeposit = (parentUser.lifeTimeDeposit + req.body.amount);
    parentData.downlineBalance = (parentUser.downlineBalance + req.body.amount);
    
    // console.log(userData)
    const updatedChild = await User.findByIdAndUpdate(childUser.id, userData,{
        new:true
    });
    const updatedparent =  await User.findByIdAndUpdate(parentUser.id, parentData);
    if(!updatedChild || !updatedparent){
        return next(new AppError("Ops, Something went wrong Please try again later", 500))
    }
    let childAccStatement = {}
    let ParentAccStatement = {}
    let date = Date.now()

    //for child User//
    childAccStatement.child_id = childUser.id;
    childAccStatement.user_id = childUser.id;
    childAccStatement.parent_id = parentUser.id;
    childAccStatement.description = 'Chips credited to ' + childUser.name + '(' + childUser.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")";
    childAccStatement.creditDebitamount = req.body.amount;
    childAccStatement.balance = userData.availableBalance;
    childAccStatement.date = date
    childAccStatement.userName = childUser.userName
    childAccStatement.role_type = childUser.role_type

    const accStatementChild = await accountStatement.create(childAccStatement)
    if(!accStatementChild){
        return next(new AppError("Ops, Something went wrong Please try again later", 500))
    }
    // console.log(childAccStatement)
    // for parent user // 
    ParentAccStatement.child_id = childUser.id;
    ParentAccStatement.user_id = parentUser.id;
    ParentAccStatement.parent_id = parentUser.id;
    ParentAccStatement.description = 'Chips credited to ' + childUser.name + '(' + childUser.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")";
    ParentAccStatement.creditDebitamount = req.body.amount * -1;
    ParentAccStatement.balance = parentData.availableBalance;
    ParentAccStatement.date = date
    ParentAccStatement.userName = parentUser.userName;
    ParentAccStatement.role_type = parentUser.role_type

    // console.log(ParentAccStatement)
    const accStatementparent = await accountStatement.create(ParentAccStatement)
    if(!accStatementparent){
        return next(new AppError("Ops, Something went wrong Please try again later", 500))
    }
    res.status(200).json({
        status:"success",
        user:updatedChild
    })
});



exports.getAllAccStatement = catchAsync(async(req, res, next) => {
    const allStatement = await accountStatement.find()
    res.status(200).json({
        status:"success",
        allStatement
    })
});


exports.withdrawl = catchAsync(async(req, res, next) => {
    // const user = await User.findById(req.body.userId)
    const childUser = await User.findById(req.body.id);
    const parentUser = await User.findById(childUser.parent_id);
    // console.log(user)
    if(childUser.role.role_level < parentUser.role.role_level){
        return next(new AppError("you do not have permission to perform this action", 404))
    }

    if(childUser.availableBalance < req.body.amount){
        return next(new AppError('withdrow amount must less than available balance',404))
    }
    await User.findByIdAndUpdate({_id:parentUser.id},{$inc:{downlineBalance:-req.body.amount,availableBalance:req.body.amount}})
    const user = await User.findByIdAndUpdate({_id:childUser.id},{$inc:{balance:-req.body.amount,availableBalance:-req.body.amount}},{
        new:true
    })
    
    let childAccStatement = {}
    let ParentAccStatement = {}
    let date = Date.now()

    //for child User//
    childAccStatement.child_id = childUser.id;
    childAccStatement.user_id = childUser.id;
    childAccStatement.parent_id = parentUser.id;
    childAccStatement.description = 'Chips debited to ' + childUser.name + '(' + childUser.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")";
    childAccStatement.creditDebitamount = req.body.amount * -1;
    childAccStatement.balance = (childUser.availableBalance * 1  - req.body.amount * 1);
    childAccStatement.date = date
    childAccStatement.userName = childUser.userName
    childAccStatement.role_type = childUser.role_type

    const accStatementChild = await accountStatement.create(childAccStatement)
    if(!accStatementChild){
        return next(new AppError("Ops, Something went wrong Please try again later", 500))
    }
    // console.log(childAccStatement)
    // for parent user // 
    ParentAccStatement.child_id = childUser.id;
    ParentAccStatement.user_id = parentUser.id;
    ParentAccStatement.parent_id = parentUser.id;
    ParentAccStatement.description = 'Chips debited to ' + childUser.name + '(' + childUser.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")";
    ParentAccStatement.creditDebitamount = req.body.amount;
    ParentAccStatement.balance = (parentUser.availableBalance*1 + req.body.amount*1);
    ParentAccStatement.date = date
    ParentAccStatement.userName = parentUser.userName;
    ParentAccStatement.role_type = parentUser.role_type

    // console.log(ParentAccStatement)
    const accStatementparent = await accountStatement.create(ParentAccStatement)
    if(!accStatementparent){
        return next(new AppError("Ops, Something went wrong Please try again later", 500))
    }
    res.status(200).json({
        status:"success",
        user
    })
});

exports.getUserAccountStatement = catchAsync(async(req, res, next) => {
    let userAcc
    let page = req.query.page
    if(!page){
        page = 0
    }
    limit = 10
    if(req.query.id){
        if(req.query.from && req.query.to){
            userAcc = await accountStatement.find({user_id:req.query.id,date:{$gte:req.query.from,$lte:req.query.to}}).skip(page * limit).limit(limit);
        }else{
            userAcc = await accountStatement.find({user_id:req.query.id}).skip(page * limit).limit(limit);
        }
    }
    // console.log(userAcc.length)
    res.status(200).json({
        status:"success",
        userAcc
    })
});



//for user

exports.getMyAccountStatement = catchAsync(async(req, res, next) => {
    // console.log(req.body)
    // req.body = req.query  
    // const user = await User.findById(req.body.id);
    // if(req.currentUser.role.role_level > user.role.role_level){
    //     return next(new AppError("You do not have permission to perform this action because user role type is higher", 404))
    // }
    let userAcc = await accountStatement.find({user_id:req.currentUser._id})
    // if(req.body.from && req.body.to){
    //     userAcc = await accountStatement.find({$or:[{to_user_id:req.body.id},{from_user_id:req.body.id}],date:{$gte:req.body.from,$lte:req.body.to}})
    // }else{
    //     userAcc = await accountStatement.find({$or:[{to_user_id:req.body.id},{from_user_id:req.body.id}]})
    // }
    // if(user.role_type = 5){
    //     userAcc = await accountStatement.find({})
    // }
    
    // if(!userAcc){
    //     return next(new AppError("there is no user belonging to that id", 404))
    // }
    res.status(200).json({
        status:"success",
        userAcc
    })
});