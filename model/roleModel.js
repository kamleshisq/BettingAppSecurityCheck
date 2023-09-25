const mongoose = require('mongoose');



const roleSchema = mongoose.Schema({
    roleName:{
        type: String,
        unique:true
    },
    name:{
        type:String
    },
    role_level:{
        type:Number,
        required:true
    },
    role_type:{
        type:Number,
        required:true
    },
    authorization:[{
        type:String
    }],
    userAuthorization:[{
        type:String
    }],
    operationAuthorization:[{
        type:String
    }],
    AdminController:[{
        type:String
    }]
})



const Role = mongoose.model('Role', roleSchema);

module.exports = Role;