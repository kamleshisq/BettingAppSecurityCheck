const mongoose = require('mongoose')

const loginuserDataSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    token:{
        type:String,
        required:true
    }
})

const LoginUser = mongoose.model('loginuserdata',loginuserDataSchema)

module.exports = LoginUser