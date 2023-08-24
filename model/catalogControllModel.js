const mongoose = require('mongoose')

const catalogControllerSchema = mongoose.Schema({
    Id:{
        type:String,
        required:true
    },
    name:{

        type:String,
        required:true
    },
    type:{

        type:String,
        enum:["league","event"],
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
})

const catalogController = mongoose.model("catalogController",catalogControllerSchema)

module.exports = catalogController 