const mongoose = require('mongoose')

const inPlayEventSchema = mongoose.Schema({
    Id:{
        type:String,
        required:true
    },
    name:{
        type:String, 
        required:true
    }
})

const inPlayEvent = mongoose.model("inplayeventmodel",inPlayEventSchema)

module.exports = inPlayEvent    