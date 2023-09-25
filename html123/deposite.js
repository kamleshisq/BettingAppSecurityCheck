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
    // userData.creditReference = {}
    // userData.lifeTimeCredit = (childUser.lifeTimeCredit + req.body.amount);
    parentData.availableBalance = (parentUser.availableBalance - req.body.amount);
    // parentData.lifeTimeDeposit = (parentUser.lifeTimeDeposit + req.body.amount);
    parentData.downlineBalance = (parentUser.downlineBalance + req.body.amount);
    
    // console.log(userData)
    const updatedChild = await User.findByIdAndUpdate(childUser.id, userData,{
        new:true
    });
    await User.findByIdAndUpdate(childUser.id, {$inc:{creditReference:req.body.amount}})
    const updatedparent =  await User.findByIdAndUpdate(parentUser.id, parentData);
    // await User.findByIdAndUpdate(parentUser.id,{$inc:{lifeTimeDeposit:-req.body.amount}})
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