const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const User = require("../model/userModel");
const Role = require('./../model/roleModel')
// const { required } = require("joi");
const accountStatement = require('../model/accountStatementByUserModel');
const betModel = require("../model/betmodel");
// const { use } = require("../routes/viewRoutes");

exports.deposit = catchAsync(async(req, res, next) => {
    // console.log(req.body)
    const childUser = await User.findById(req.body.id);
    if(childUser.transferLock){
        return next(new AppError("User Account is Locked", 404))
    }
    // if((childUser.creditReference + req.body.amount) > childUser.maxCreditReference){
    //     return next(new AppError("User Account is Locked", 404))
    // }
    const parentUser = await User.findById(childUser.parent_id);
    req.body.amount = parseFloat(req.body.amount)
    // // console.log(req.body)
    // // console.log(childUser)
    if(childUser.role.role_level < parentUser.role.role_level){
        return next(new AppError("you do not have permission to perform this action", 404))
    } 
    let userData = {}
    let parentData = {}
    if(parentUser.availableBalance < req.body.amount){
        return next(new AppError("Insufficient Credit Limit !"))
    }

    userData.balance = parseFloat(childUser.balance + req.body.amount);
    userData.availableBalance = parseFloat(childUser.availableBalance + req.body.amount);
    // // userData.creditReference = {}
    // // userData.lifeTimeCredit = (childUser.lifeTimeCredit + req.body.amount);
    parentData.availableBalance = parseFloat(parentUser.availableBalance - req.body.amount);
    // // parentData.lifeTimeDeposit = (parentUser.lifeTimeDeposit + req.body.amount);
    parentData.downlineBalance = parseFloat(parentUser.downlineBalance + req.body.amount);
    
    // // console.log(userData)
    const updatedChild = await User.findByIdAndUpdate(childUser.id, userData,{
        new:true
    });
    await User.findByIdAndUpdate(childUser.id, {$inc:{creditReference:req.body.amount}})
    const updatedparent =  await User.findByIdAndUpdate(parentUser.id, parentData);
    // // await User.findByIdAndUpdate(parentUser.id,{$inc:{lifeTimeDeposit:-req.body.amount}})
    if(!updatedChild || !updatedparent){
        return next(new AppError("Ops, Something went wrong Please try again later", 500))
    }
    let childAccStatement = {}
    let ParentAccStatement = {}
    let date = Date.now()

    // //for child User//
    childAccStatement.child_id = childUser.id;
    childAccStatement.user_id = childUser.id;
    childAccStatement.parent_id = parentUser.id;
    childAccStatement.description = 'Chips credited to ' + childUser.name + '(' + childUser.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")";
    childAccStatement.creditDebitamount = req.body.amount;
    childAccStatement.balance = userData.availableBalance;
    childAccStatement.date = date
    childAccStatement.userName = childUser.userName
    childAccStatement.role_type = childUser.role_type
    childAccStatement.Remark = req.body.remark

    const accStatementChild = await accountStatement.create(childAccStatement)
    if(!accStatementChild){
        return next(new AppError("Ops, Something went wrong Please try again later", 500))
    }
    // // console.log(childAccStatement)
    // // for parent user // 
    ParentAccStatement.child_id = childUser.id;
    ParentAccStatement.user_id = parentUser.id;
    ParentAccStatement.parent_id = parentUser.id;
    ParentAccStatement.description = 'Chips credited to ' + childUser.name + '(' + childUser.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")";
    ParentAccStatement.creditDebitamount = -(req.body.amount);
    ParentAccStatement.balance = parentData.availableBalance;
    ParentAccStatement.date = date
    ParentAccStatement.userName = parentUser.userName;
    ParentAccStatement.role_type = parentUser.role_type
    ParentAccStatement.Remark = req.body.remark

    // // console.log(ParentAccStatement)
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
    req.body.amount = parseFloat(req.body.amount)
    const childUser = await User.findById(req.body.id);
    const parentUser = await User.findById(childUser.parent_id);
    // // console.log(user)
    if(childUser.role.role_level < parentUser.role.role_level){
        return next(new AppError("you do not have permission to perform this action", 404))
    }

    if(childUser.availableBalance < req.body.amount){
        return next(new AppError('withdrow amount must less than available balance',404))
    }
    await User.findByIdAndUpdate({_id:parentUser.id},{$inc:{downlineBalance:-req.body.amount,availableBalance:req.body.amount,}})
    const user = await User.findByIdAndUpdate({_id:childUser.id},{$inc:{balance:-req.body.amount,availableBalance:-req.body.amount}},{
        new:true
    })
    
    let childAccStatement = {}
    let ParentAccStatement = {}
    let date = Date.now()

    // //for child User//
    childAccStatement.child_id = childUser.id;
    childAccStatement.user_id = childUser.id;
    childAccStatement.parent_id = parentUser.id;
    childAccStatement.description = 'Chips debited to ' + childUser.name + '(' + childUser.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")";
    childAccStatement.creditDebitamount = -parseFloat(req.body.amount);
    childAccStatement.balance = (parseFloat(childUser.availableBalance)  - parseFloat(req.body.amount));
    childAccStatement.date = date
    childAccStatement.userName = childUser.userName
    childAccStatement.role_type = childUser.role_type
    childAccStatement.Remark = req.body.remark

    const accStatementChild = await accountStatement.create(childAccStatement)
    if(!accStatementChild){
        return next(new AppError("Ops, Something went wrong Please try again later", 500))
    }
    // // console.log(childAccStatement)
    // // for parent user // 
    ParentAccStatement.child_id = childUser.id;
    ParentAccStatement.user_id = parentUser.id;
    ParentAccStatement.parent_id = parentUser.id;
    ParentAccStatement.description = 'Chips debited to ' + childUser.name + '(' + childUser.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")";
    ParentAccStatement.creditDebitamount = parseFloat(req.body.amount);
    ParentAccStatement.balance = (parseFloat(parentUser.availableBalance) + parseFloat(req.body.amount));
    ParentAccStatement.date = date
    ParentAccStatement.userName = parentUser.userName;
    ParentAccStatement.role_type = parentUser.role_type
    ParentAccStatement.Remark = req.body.remark

    // // console.log(ParentAccStatement)
    const accStatementparent = await accountStatement.create(ParentAccStatement)
    if(!accStatementparent){
        return next(new AppError("Ops, Something went wrong Please try again later", 500))
    }
    res.status(200).json({
        status:"success",
        user
    })
});

exports.withdrawSettle = catchAsync(async(req, res, next) => {
    // const user = await User.findById(req.body.userId)
    req.body.amount = parseFloat(req.body.amount)
    req.body.clintPL = parseFloat(req.body.clintPL)

    const childUser = await User.findById(req.body.id);
    const parentUser = await User.findById(childUser.parent_id);
    // // console.log(user)
    if(childUser.role.role_level < parentUser.role.role_level){
        return next(new AppError("you do not have permission to perform this action", 404))
    }

    if(childUser.availableBalance < req.body.amount){
        return next(new AppError('withdrow amount must less than available balance',404))
    }
    await User.findByIdAndUpdate({_id:parentUser.id},{$inc:{availableBalance:req.body.clintPL,downlineBalance:-req.body.clintPL,myPL:req.body.amount}})
    const user = await User.findByIdAndUpdate({_id:childUser.id},{$inc:{availableBalance:-req.body.clintPL},uplinePL:0,myPL:0,pointsWL:0},{
        new:true
    })
    
    let childAccStatement = {}
    let ParentAccStatement = {}
    let date = Date.now()

    // //for child User//
    childAccStatement.child_id = childUser.id;
    childAccStatement.user_id = childUser.id;
    childAccStatement.parent_id = parentUser.id;
    childAccStatement.description = 'Settlement(withdraw) ' + childUser.name + '(' + childUser.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")";
    childAccStatement.creditDebitamount = -parseFloat(req.body.amount);
    childAccStatement.balance = (parseFloat(childUser.availableBalance)  - parseFloat(req.body.amount));
    childAccStatement.date = date
    childAccStatement.userName = childUser.userName
    childAccStatement.role_type = childUser.role_type
    childAccStatement.Remark = req.body.remark

    const accStatementChild = await accountStatement.create(childAccStatement)
    if(!accStatementChild){
        return next(new AppError("Ops, Something went wrong Please try again later", 500))
    }
    // // console.log(childAccStatement)
    // // for parent user // 
    ParentAccStatement.child_id = childUser.id;
    ParentAccStatement.user_id = parentUser.id;
    ParentAccStatement.parent_id = parentUser.id;
    ParentAccStatement.description = 'Settlement(withdraw) ' + childUser.name + '(' + childUser.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")";
    ParentAccStatement.creditDebitamount = parseFloat(req.body.amount);
    ParentAccStatement.balance = (parseFloat(parentUser.availableBalance) + parseFloat(req.body.amount));
    ParentAccStatement.date = date
    ParentAccStatement.userName = parentUser.userName;
    ParentAccStatement.role_type = parentUser.role_type
    ParentAccStatement.Remark = req.body.remark

    // // console.log(ParentAccStatement)
    const accStatementparent = await accountStatement.create(ParentAccStatement)
    if(!accStatementparent){
        return next(new AppError("Ops, Something went wrong Please try again later", 500))
    }
    res.status(200).json({
        status:"success",
        user
    })
});

exports.depositSettle = catchAsync(async(req, res, next) => {
    const childUser = await User.findById(req.body.id);
    if(childUser.transferLock){
        return next(new AppError("User Account is Locked", 404))
    }
    // if((childUser.creditReference + req.body.amount) > childUser.maxCreditReference){
    //     return next(new AppError("User Account is Locked", 404))
    // }
    const parentUser = await User.findById(childUser.parent_id);
    req.body.amount = parseFloat(req.body.amount)
    req.body.clintPL = parseFloat(req.body.clintPL) * -1
    // // console.log(req.body)
    // // console.log(childUser)
    if(childUser.role.role_level < parentUser.role.role_level){
        return next(new AppError("you do not have permission to perform this action", 404))
    } 
    
    if(parentUser.availableBalance < req.body.amount){
        return next(new AppError("Insufficient Credit Limit !"))
    }

  
    const user = await User.findByIdAndUpdate(childUser.id, {$inc:{availableBalance:req.body.clintPL}, uplinePL:0,pointsWL:0,myPL:0})
    await User.findByIdAndUpdate(parentUser.id, {$inc:{availableBalance:-req.body.clintPL,downlineBalance:req.body.clintPL,myPL:-req.body.amount}});
    // // await User.findByIdAndUpdate(parentUser.id,{$inc:{lifeTimeDeposit:-req.body.amount}})
    let childAccStatement = {}
    let ParentAccStatement = {}
    let date = Date.now()

    // //for child User//
    childAccStatement.child_id = childUser.id;
    childAccStatement.user_id = childUser.id;
    childAccStatement.parent_id = parentUser.id;
    childAccStatement.description = 'Settlement(deposite) ' + childUser.name + '(' + childUser.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")";
    childAccStatement.creditDebitamount = req.body.amount;
    childAccStatement.balance = childUser.availableBalance + req.body.amount;
    childAccStatement.date = date
    childAccStatement.userName = childUser.userName
    childAccStatement.role_type = childUser.role_type
    childAccStatement.Remark = req.body.remark

    const accStatementChild = await accountStatement.create(childAccStatement)
    if(!accStatementChild){
        return next(new AppError("Ops, Something went wrong Please try again later", 500))
    }
    // // console.log(childAccStatement)
    // // for parent user // 
    ParentAccStatement.child_id = childUser.id;
    ParentAccStatement.user_id = parentUser.id;
    ParentAccStatement.parent_id = parentUser.id;
    ParentAccStatement.description = 'Settlement(deposite) ' + childUser.name + '(' + childUser.userName + ') from parent user ' + parentUser.name + "(" + parentUser.userName + ")";
    ParentAccStatement.creditDebitamount = -(req.body.amount);
    ParentAccStatement.balance = parentUser.availableBalance - req.body.amount;
    ParentAccStatement.date = date
    ParentAccStatement.userName = parentUser.userName;
    ParentAccStatement.role_type = parentUser.role_type
    ParentAccStatement.Remark = req.body.remark

    // // console.log(ParentAccStatement)
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
    // console.log(req.query)
    let userAcc
    let page = req.query.page
    let filter = {}
    if(!page){
        page = 0
    }
    limit = 10
    if(req.query.id){
        if(req.query.from && req.query.to){
            userAcc = await accountStatement.find({user_id:req.query.id,date:{$gte:req.query.from,$lte:req.query.to}}).sort({date: -1}).skip(page * limit).limit(limit);
        }else if(req.query.from && !req.query.to){
            userAcc = await accountStatement.find({user_id:req.query.id,date:{$gte:req.query.from}}).sort({date: -1}).skip(page * limit).limit(limit);
        }else if(!req.query.from && req.query.to){
            userAcc = await accountStatement.find({user_id:req.query.id,date:{$lte:req.query.to}}).sort({date: -1}).skip(page * limit).limit(limit);
        }else{
            userAcc = await accountStatement.find({user_id:req.query.id}).sort({date: -1}).skip(page * limit).limit(limit);

        }
    }
    // console.log(userAcc.length)
    res.status(200).json({
        status:"success",
        userAcc
    })
});
exports.getUserAccountStatement1 = catchAsync(async(req, res, next) => {
    // console.log(req.query)
    let userAcc
    let page = req.query.page
    let filter = {}
    let childUsersArr = []
    let childUser;
    if(!page){
        page = 0
    }
    limit = 10
    
    if(req.query.id){
        const idUser = await User.findById(req.query.id)
        if(idUser.userName == req.currentUser.userName){
            let childUsers = await User.find({parentUsers:req.query.id,roleName: {$ne:'user'}})
            childUsers.map(ele => {
                childUsersArr.push(ele._id)
            })
        }else{
            childUsersArr.push(idUser._id)
        }
        if(req.query.from && req.query.to){
            userAcc = await accountStatement.find({user_id:{$in:childUsersArr},date:{$gte:req.query.from,$lte:req.query.to}}).sort({date: -1}).skip(page * limit).limit(limit);
        }else if(req.query.from && !req.query.to){
            userAcc = await accountStatement.find({user_id:{$in:childUsersArr},date:{$gte:req.query.from}}).sort({date: -1}).skip(page * limit).limit(limit);
        }else if(!req.query.from && req.query.to){
            userAcc = await accountStatement.find({user_id:{$in:childUsersArr},date:{$lte:req.query.to}}).sort({date: -1}).skip(page * limit).limit(limit);
        }else{
            userAcc = await accountStatement.find({user_id:{$in:childUsersArr}}).sort({date: -1}).skip(page * limit).limit(limit);

        }
    }
    // console.log(userAcc.length)
    res.status(200).json({
        status:"success",
        userAcc
    })
});


exports.getexposure = catchAsync(async(req, res, next)=>{
    const exposure = await betModel.aggregate([
        {
            $match: {
                status: "OPEN",
                userName:req.currentUser.userName
            }
        },
        {
            $group:{
                _id:'$marketId',
                selectionName:{$first:'$selectionName'},
                match:{$first:'$match'},
                bettype2:{$first:"$bettype2"},
                marketName:{$first:"$marketName"},
                oddValue:{$first:"$oddValue"},
                Stake:{$first:"$Stake"},


            }
        },
        // {
        //     $group: {
        //         _id: {
        //             selectionName: "$selectionName",
        //             matchName: "$match",
        //             marketId:"$id_marketId"
        //         },
        //         totalAmount: {
        //             $sum: {
        //                 $cond: { 
        //                     if : {$eq: ['$bettype2', "BACK"]},
        //                     then:{
        //                         $cond:{
        //                             if: { $regexMatch: { input: "$marketName", regex: /^match/i } },
        //                             then:{
        //                                 $sum: {
        //                                     $subtract: [{ $multiply: ["$oddValue", "$Stake"] }, "$Stake"]
        //                                 }
        //                             },
        //                             else:{
        //                                 $sum: {
        //                                     $divide: [{ $multiply: ["$oddValue", "$Stake"] }, 100]
        //                                 }
        //                             }
        //                         }
        //                     },
        //                     else:{
        //                         $cond:{
        //                             if: { $regexMatch: { input: "$marketName", regex: /^match/i } },
        //                             then:{
        //                                 $sum: {
        //                                    $multiply : [ {$subtract: [ { $multiply: ["$oddValue", "$Stake"] }, "$Stake" ]}, -1]
        //                                 }
        //                             },
        //                             else:{
        //                                 $sum: { 
        //                                     $multiply : [ {$divide: [{ $multiply: ["$oddValue", "$Stake"] }, 100]}, -1]
        //                                 }
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     },
        // },
        // {
        //     $group: {
        //         _id: "$_id.marketId",
        //         selections: {
        //             $push: {
        //                 selectionName: "$_id.selectionName",
        //                 totalAmount: '$totalAmount',
        //                 matchName: "$_id.matchName",
        //                 Stake: { $multiply: ["$Stake", -1] },
        //             },
        //         },
        //     },
        // }
    ])

    res.status(200).json({
        status:'success',
        data:exposure
    })
})


//for user

exports.getMyAccountStatement = catchAsync(async(req, res, next) => {
    // console.log(req.body)
    // req.body = req.query  
    // const user = await User.findById(req.body.id);
    // if(req.currentUser.role.role_level > user.role.role_level){
    //     return next(new AppError("You do not have permission to perform this action because user role type is higher", 404))
    // }
    let userAcc = await accountStatement.find({user_id:req.currentUser._id}).limit(20)
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