const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const User = require("../model/userModel");
const Role = require('./../model/roleModel')
// const { required } = require("joi");
const accountStatement = require('../model/accountStatementByUserModel');
const betModel = require("../model/betmodel");
const paymentReportModel = require('../model/paymentreport');
const PaymentMethodModel = require('../model/paymentmethodmodel')
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
    if(parentUser.transferLock){
        return next(new AppError("Your Account is Locked", 404))
    }
    req.body.amount = parseFloat(req.body.amount)
    // // console.log(req.body)
    // // console.log(childUser)
    // if(childUser.role.role_level < parentUser.role.role_level){
    //     return next(new AppError("you do not have permission to perform this action", 404))
    // } 
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
    if(childUser.transferLock){
        return next(new AppError("User Account is Locked", 404))
    }
    if(parentUser.transferLock){
        return next(new AppError("User Account is Locked", 404))
    }
    // // console.log(user)
    // if(childUser.role.role_level < parentUser.role.role_level){
    //     return next(new AppError("you do not have permission to perform this action", 404))
    // }

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
    // if(childUser.role.role_level < parentUser.role.role_level){
    //     return next(new AppError("you do not have permission to perform this action", 404))
    // }

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
    childAccStatement.accStype = "Settle"

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
    ParentAccStatement.accStype = "Settle"

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
    req.body.clintPL = parseFloat(req.body.clintPL) * -1
    // // console.log(req.body)
    // // console.log(childUser)
    // if(childUser.role.role_level < parentUser.role.role_level){
    //     return next(new AppError("you do not have permission to perform this action", 404))
    // } 
    
    if(parentUser.availableBalance < req.body.amount){
        return next(new AppError("Insufficient Credit Limit !"))
    }

    console.log(req.body)
    const user = await User.findByIdAndUpdate(childUser.id, {$inc:{availableBalance:req.body.amount,lifetimePL:-req.body.amount}, uplinePL:0,pointsWL:0,myPL:0})
    await User.findByIdAndUpdate(parentUser.id, {$inc:{availableBalance:-req.body.clintPL,downlineBalance:req.body.clintPL,myPL:-req.body.amount,lifetimePL:req.body.amount}});
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
    childAccStatement.accStype = "Settle"

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
    ParentAccStatement.accStype = "Settle"

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
    // console.log(userAcc)
    res.status(200).json({
        status:"success",
        userAcc
    })
});
exports.getUserAccountStatement1 = catchAsync(async(req, res, next) => {
    function formatDate(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        return year + "-" + month + "-" + day;
    }
    // console.log(req.query)
    var today = new Date();
    var todayFormatted = formatDate(today);
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() - 7);
    var tomorrowFormatted = formatDate(tomorrow);

    try{
    let userAcc = []
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
            childUsersArr = await User.distinct('_id', {parentUsers:req.query.id,roleName: {$ne:'user'}});
            // let childUsers = await User.find({parentUsers:req.query.id,roleName: {$ne:'user'}})
            // childUsers.map(ele => {
            //     childUsersArr.push(ele._id)
            // })
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
            userAcc = await accountStatement.find({user_id:{$in:childUsersArr},date:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))}  }).sort({date: -1}).skip(page * limit).limit(limit);

        }
    }
    // console.log(userAcc.length)
    res.status(200).json({
        status:"success",
        userAcc
    })
}catch(err){
    console.log(err)
}
});


exports.getexposure = catchAsync(async(req, res, next)=>{
    const exposure1 = await betModel.aggregate([
        {
            $match: {
                status: "OPEN",
                userName:req.currentUser.userName,
                marketId:{$ne:[{$substr: ["$marketId", -2, 2]},'F2']}
                
            }
        },
        {
            $group: {
                _id: "$marketId",
                totalAmountB: {
                    $sum: {
                        $cond: {
                            if : {$eq: ['$bettype2', "BACK"]},
                            then:{$multiply:["$exposure",-1]},
                            else:'$WinAmount'
                        }
                    }
                },
                totalAmountL: {
                    $sum: {
                        $cond: {
                            if : {$eq: ['$bettype2', "LAY"]},
                            then:{$multiply:["$exposure",-1]},
                            else:'$WinAmount'
                        }
                    }
                }
           
            },
        },
        {
            $group: {
                _id: null,
                totalAmount: {$sum:{$cond:{
                    if:{
                        $eq:[{$cmp:['$totalAmountB','$totalAmountL']},0]
                    },
                    then:"$totalAmountL",
                    else:{
                        $cond:{
                            if:{
                                $eq:[{$cmp:['$totalAmountB','$totalAmountL']},1]
                            },
                            then:"$totalAmountL",
                            else:"$totalAmountB"
                        }
                       
                    }
                },
            }},
        }
    }
    ])

    const exposure2 = await betModel.aggregate([
        {
            $match: {
                status: "OPEN",
                userName:req.currentUser.userName,
                marketId:{$regex: /F2$/}
                
            }
        },
        {
            $addFields: {
              runs: {
                $toInt: {
                  $arrayElemAt: [
                    { $split: ["$selectionName", "@"] },
                    1 
                  ]
                }
              }
            }
        },
        {
            $group: {
                _id:{
                    marketId:"$marketId",
                    runs:'$runs',
                    bettype2:'$bettype2'
                },
                exposure:{$sum: '$exposure'},
                WinAmount:{$sum:'$WinAmount'},
            },
        },
        {
            $group:{
                _id:"$_id.marketId",

                runs:{
                    $push:'$_id.runs'
                },
                data:{
                    $push:{
                        run:'$_id.runs',
                        exposure:'$exposure',
                        winAmount:'$WinAmount',
                        type:'$_id.bettype2'
                    }
                },
            }
                
            
        },
        // {
        //     $group: {
        //         _id:"$_id.marketId",
        //         totalAmount: {$sum:{$cond:{
        //             if:{
        //                 $eq:[{$cmp:['$totalAmountB','$totalAmountL']},0]
        //             },
        //             then:"$totalAmountL",
        //             else:{
        //                 $cond:{
        //                     if:{
        //                         $eq:[{$cmp:['$totalAmountB','$totalAmountL']},1]
        //                     },
        //                     then:"$totalAmountL",
        //                     else:"$totalAmountB"
        //                 }
                       
        //             }
        //         },
        //     }},
        // }
        // }
    ])

    function getExposure(runs,obj){
        runs.sort((a, b) => a - b)
        obj.sort((a, b) => a.run - b.run)
        let runLength = runs.length;
        let dataToshow = [];
        let min = 0
        for(let i = 0;i<runLength;i++){
            if(runLength == 1){
                let data1 = {}
                data1.message = `${runs[0] - 1} or less`
                let sum = 0
                for(let j = 0; j < obj.length; j++){
                    if(obj[j].type === "LAY"){
                        sum += obj[j].winAmount
                    }else{
                        sum -= obj[j].exposure
                    }
                }
                data1.sum = sum
                dataToshow.push(data1)
                let data2 = {}
                let sum2 = 0
                data2.message = `${runs[i]} or more`
                for(let j = 0; j < obj.length; j++){
                    if(obj[j].type === "BACK"){
                        sum2 += obj[j].winAmount
                    }else{
                        sum2 -= obj[j].exposure
                    }
                }
                data2.sum = sum2
                dataToshow.push(data2)
            }else{
                if(i === 0){
                    let data = {}
                    data.message = `${runs[i] - 1} or less`
                    let sum = 0
                    for(let j = 0; j < obj.length; j++){
                        if(obj[j].type === "LAY" && obj[j].run >= runs[i]){
                            sum += obj[j].winAmount
                        }else{
                            sum -= obj[j].exposure
                        }
                    }
                    data.sum = sum
                    dataToshow.push(data)
                }else if (i === (runs.length - 1)){
                    let data = {}
                    let data1 = {}
                    
                    if(runs[i - 1] == (runs[i] - 1)){
                        data.message = `${runs[i - 1]}`
                    }else{
                        data.message = `between ${runs[i - 1]} and ${runs[i] - 1}`
                    }
                    let sum = 0
                    for(let j = 0; j < obj.length; j++){
                        if(obj[j].type === "LAY" && obj[j].run == runs[i]){
                            sum += obj[j].winAmount
                        }else if(obj[j].type === "BACK" && obj[j].run == runs[i-1]){
                            sum += obj[j].winAmount
                        }else{
                            sum -= obj[j].exposure

                        }
                    }
                    data.sum = sum
                    dataToshow.push(data)
                    let sum2 = 0
                    data1.message = `${runs[i]} or more`
                    for(let j = 0; j < obj.length; j++){
                        if(obj[j].type === "BACK" && obj[j].run <= runs[i]){
                            sum2 += obj[j].winAmount
                        }else{
                            sum2 -= obj[j].exposure
                        }
                    }
                    data1.sum = sum2
                    dataToshow.push(data1)
                }else{
                    let data = {}
                    if(runs[i - 1] == (runs[i] - 1)){
                        data.message = `${runs[i] - 1}`
                    }else{
                        data.message = `between ${runs[i - 1]} and ${runs[i] - 1}`
                    }
                    let sum = 0
                    for(let j = 0; j < obj.length; j++){
                        if(obj[j].type === "LAY" && obj[j].run == runs[i]){
                            sum += obj[j].winAmount
                        }else if (obj[j].type === "BACK" && obj[j].run == runs[i - 1]){
                            sum += obj[j].winAmount
                        }
                        else{
                            sum -= obj[j].exposure
                        }
                    }
                    data.sum = sum
                    dataToshow.push(data)
                }
            }

        }

        for(let i = 0;i<Object.keys(dataToshow).length;i++){
            if(dataToshow[i].sum < min){
                min = dataToshow[i].sum
            }
        }
        return min;
    }

    let exposureFancy = 0;
    for(let i = 0;i<exposure2.length;i++){
        exposureFancy += getExposure(exposure2[i].runs,exposure2[i].data)
    }
    let totalExposure = exposure1[0].totalAmount + exposureFancy
    res.status(200).json({
        status:'success',
        data:{exposure:totalExposure}
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
    var today = new Date();
    var todayFormatted = formatDate(today);
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() - 7);
    var tomorrowFormatted = formatDate(tomorrow);
    function formatDate(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        return year + "-" + month + "-" + day;
    }
    let userAcc = await accountStatement.find({user_id:req.currentUser._id,date:{$gte:new Date(tomorrowFormatted),$lte:new Date(new Date(todayFormatted).getTime() + ((24 * 60*60*1000)-1))} }).sort({date: -1}).limit(20)
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

exports.paymentDeposite = catchAsync(async(req, res, next)=>{
    function validateUTR(utr) {
        var utrPattern = /^[A-Za-z0-9]{12,}$/; 
        return utrPattern.test(utr);
    }
    if(!validateUTR(req.body.utr)){
        return next(new AppError('enter valid utr',400))
    }
    // console.log(req.files, "filesfilesfilesfiles")
    let imagName;
    let data;
    let user = await User.findById(req.currentUser._id)
    let sdmId = user.parentUsers[1]
    let sdmUser = await User.findById(sdmId)
    if(req.files){
        try{
            if(req.files.file.mimetype.startsWith('image')){
                imagName = `${req.currentUser.userName}${Date.now()}`
                const image = req.files.file
                // console.log(logo)
                let STRING = `public/paymentimg/${imagName}.png`
                // console.log(STRING, "STRINGSTRINGSTRING")
                try{
                    image.mv(STRING, (err)=>{
                        console.log(err)
                        if(err) return next(new AppError("Something went wrong please try again later", 400))
                    })
                }catch(err){
                    // console.log(err, "THIS IS ERRRRRR")
                }
                data = {... req.body}
                let paymentMethoDetail = await PaymentMethodModel.findOne({userName:sdmUser.userName,pmethod:req.body.pmethod,accountholdername:req.body.accountholdername})
                // console.log(paymentMethoDetail)
                data.username = req.currentUser.userName
                data.status = 'pending'
                data.image = imagName
                if(req.body.pmethod == 'banktransfer'){
    
                    data.accountnumber = paymentMethoDetail.accountnumber
                }else if(req.body.pmethod == 'upi'){
    
                    data.upiid = paymentMethoDetail.upiid
                }else if(req.body.pmethod == 'paytm'){
    
                    data.phonenumber = paymentMethoDetail.phonenumber
                }
                data.date = new Date()
                
                // console.log(data)
                await paymentReportModel.create(data)
    
            }else{
                return next(new AppError("Please Provide Image", 400))
            }

        }catch(err){
            console.log(err, "ERRR")
        }
    }

    return res.status(200).json({
        status:'success'
    })

})