const mongoose = require('mongoose')


const reqId = mongoose.Schema({
    reqId:{
        type:String,
        requied:true,
        unique:true
    }
})


const reqIdModel = mongoose.model('reqIdModel', reqId )

module.exports = reqIdModel