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
    await User.findByIdAndUpdate({_id:parentUser.id},{$inc:{downlineBalance:-req.body.amount,availableBalance:req.body.amount,}})
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