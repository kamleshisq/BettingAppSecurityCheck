const mongoose = require('mongoose');

const streamemSchema = mongoose.Schema({
    sportId:{
        type:String
    },
    sportName:{
        type:String
    },
    eventId:{
        type:String
    },
    eventName:{
        type:String
    },
    date:Date,
    url:String,
    status:Boolean
})

const Stream = mongoose.model('Streammanagement',streamemSchema)

module.exports = Stream