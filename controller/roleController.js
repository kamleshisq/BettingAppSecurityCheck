const Role = require('../model/roleModel');
const AppError = require('../utils/AppError');
// const appError = require('../utils/AppError');   
const catchAsync = require('./../utils/catchAsync');


exports.createRole = catchAsync(async(req, res, next) => {
    const role = await Role.find()
    const roleLength = role.length
    // console.log(roleLength)
    req.body.role_level = roleLength + 1;
    req.body.role_type = roleLength + 1;
    // console.log(req.body);
    const newROle = await Role.create(req.body);
    if(!newROle){
        return next(new AppError("Ops, Something went wrong please try agin later", 404))
    }
    res.status(200).json({
        status:"success",
        newROle
    })
})

exports.addAuthorization = catchAsync(async(req, res, next) => {
    const updatedRole = await Role.findByIdAndUpdate(req.body.id, {$push:{authorization:req.body.authorization}})
    if(!updatedRole){
        return next(new AppError("Ops, Something went wrong please try agin later", 404))
    }
    res.status(200).json({
        status:"success",
        updatedRole
    })
})


exports.deleteAuthorization = catchAsync(async(req, res, next) => {
    let updatedRole
    for(let i = 0; i < req.body.authorization.length; i++){
        updatedRole = await Role.findByIdAndUpdate(req.body.id, {$pull:{authorization:req.body.authorization[i]}})
    }
    if(!updatedRole){
        return next(new AppError('Ops, Something went wrong try again later', 404))
    }
    res.status(200).json({
        status:"success",
        updatedRole
    })
})

exports.getAllRole = catchAsync(async(req, res, next) => {
    const r_Type = req.currentUser.role.role_level;
    if(req.currentUser.role.role_level != 1){
        return next(new AppError("You do not have permission to perform this action", 404))
    }
    const roles = await Role.find().sort({role_level:1});
    // console.log(roles)

    res.status(200).json({
        status:'success',
        roles
    })
});


exports.updateRoleLevel = catchAsync(async(req, res, next) => {
    const Roles = await Role.find()
    const noOfRoles  = Roles.length;
    const role = await Role.findById(req.body.id);
    const role_level = role.role_level;
    // console.log(role_level)
    if(req.body.role_level == 1){
        return next(new AppError('role type must greater then 1',400))
    }
    else if(req.body.role_level>noOfRoles){
        return next(new AppError(`role must less than ${noOfRoles}`,400))
    }else if(req.body.role_level === role_level){

    }
    else
    {
        if(req.body.role_level < role_level)
        {

            const ids = await Role.find({role_level:{$gte:req.body.role_level,$lte:role_level}},{_id:1});

            for(let i=0;i<(role_level-req.body.role_level+1);i++)
            {
    
                const updateId = ids[i]._id
                if(updateId != req.body.id)
                {
                    await Role.findOneAndUpdate({_id:updateId},{$inc:{role_level:1}})
                }
                else
                {
                    await Role.findByIdAndUpdate({_id:req.body.id},{role_level:req.body.role_level})
                }
    
            }
    
            
        }
        else
        {
            const ids = await Role.find({role_level:{$lte:req.body.role_level,$gte:role_level}},{_id:1});
            
            for(let i=0;i<(req.body.role_level-role_level+1);i++)
            {
    
                const updateId = ids[i]._id
                if(updateId != req.body.id)
                {
                    await Role.findOneAndUpdate({_id:updateId},{$inc:{role_level:-1}})
                }
                else
                {
                    await Role.findByIdAndUpdate({_id:req.body.id},{role_level:req.body.role_level})
                }
    
            }
        }
    }
    res.status(200).json({
        status:'success'
    })
});

exports.getAuthROle = catchAsync(async(req, res, next) => {
    // const r_Type = req.currentUser.role.role_level;
    const roles = await Role.find({role_level:{$in:req.currentUser.role.userAuthorization}}).sort({role_level:1});
    // console.log(roles)

    res.status(200).json({
        status:'success',
        roles
    })
});

exports.getRoleById =catchAsync(async(req, res, next) => {
    // console.log(req.query.id)
    const role = await Role.findById(req.query.id)
    res.status(200).json({
        status:"success",
        role
    })
});

exports.updateRoleById = catchAsync(async(req, res, next) => {
    // console.log(req.body)
    const role = await Role.findByIdAndUpdate(req.body.id, {authorization:req.body.authorization, userAuthorization:req.body.userAuthorization})
    if(!role){
        return next(new AppError("Ops!, Something went wrong please try again later", 404))
    }
    if(req.body.role_level == ''){
        return res.status(200).json({
            status:"success",
            role
        })
    }
    next()
})