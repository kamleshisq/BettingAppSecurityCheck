const catchAsync = require('../utils/catchAsync');
const User = require('./../model/userModel')
const AppError = require('./../utils/AppError')
const Role = require('./../model/roleModel')
// const catchAsync = require("../utils/catchAsync");
exports.getOwnChild = async(id,page) => {
    // console.log(id)
    let userDetails = await User.findById(id)
    let child;
    // let Rows;
    // let me;
    let roles;
    let limit = 10;
    if(id == 0){
        return next(new AppError('You do not have permission to perform this action',400))
    }
    if(id){
        // Rows = await User.countDocuments({parent_id: id,isActive:true}).skip(page * limit).limit(limit)
        child = await User.find({parent_id: id,isActive:true}).skip(page * limit).limit(limit);
        // me = await User.findById(id)
        roles = await Role.find({role_level:{$gt : userDetails.role.role_level}})


    }
    const data = {
        status:'success',
        child,
        // result:child.length,
        // Rows:Rows,
        // me,
        roles,
        currentUser:userDetails
    }
    return data
};
// exports.getownChild = async(data) => {
//     // console.log(data)
//     let child;
//     let Rows;
//     let me;
//     let page;
//     let id;
//     if(data.P){
//         page = data.P;
//     }
//     if(data.id){
//         id = data.id
//     } 
//     // console.log(data.currentUser)
//     let limit = 50;
//     if(page < 0){
//         return next(new AppError('page should positive',404))
//     }
//     if(id == 0){
//         return next(new AppError('You do not have permission to perform this action',400))
//     }
//     if(id){
//         me = await User.findById(id)
//         if(!me){
//             return next(new AppError('user not find',400))
//         }
//         if(me.role.role_level < data.currentUser.role.role_level){
//             return next(new AppError('You do not have permission to perform this action',400))
//         }
//         Rows = await User.countDocuments({parent_id: id,isActive:true})
//         child = await User.find({parent_id: id,isActive:true}).skip(page * limit).limit(limit);
//     }else{
//         Rows = await User.countDocuments({parent_id: data.currentUser._id,isActive:true})
//         child = await User.find({parent_id: data.currentUser._id,isActive:true}).skip(page * limit).limit(limit);
//         me = await User.findById(data.currentUser._id)
//     }
//     // res.status(200).json({
//     //     status:'success',
//     //     result:child.length,
//     //     rows:Rows / limit,
//     //     child,
//     //     me
//     // })
//     const Data = {
//         status:'success',
//         child,
//         Rows:Rows / 100,
//         me,
//         currentUser:global._User
//     }
//     // console.log(Data)
//     return Data
// };