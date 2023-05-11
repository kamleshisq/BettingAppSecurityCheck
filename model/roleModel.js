const mongoose = require('mongoose');



const roleSchema = mongoose.Schema({
    roleName:{
        type: String,
        unique:true
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
    }]
})



const Role = mongoose.model('Role', roleSchema);

module.exports = Role;