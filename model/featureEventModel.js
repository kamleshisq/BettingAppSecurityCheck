const mongoose = require('mongoose')

const catalogControllerSchema = mongoose.Schema({
    Id:{
        type:String,
        required:true
    },
    name:{
        type:String, 
        required:true
    }
})

const catalogController = mongoose.model("featureeventmodel",catalogControllerSchema)

module.exports = catalogController    