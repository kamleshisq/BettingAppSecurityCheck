<<<<<<< HEAD
const mongoose = require('mongoose');
=======
const mongoose = require('mongoose')
>>>>>>> 4dfe15377a0e35d954e7af35a413aa490c6221bd

const catalogControllerSchema = mongoose.Schema({
    Id:{
        type:String,
        required:true
    },
    name:{
<<<<<<< HEAD
        type:String,
        required:true
    },
    type:{
=======

        type:String, 
        required:true
    },
    type:{

>>>>>>> 4dfe15377a0e35d954e7af35a413aa490c6221bd
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

<<<<<<< HEAD
module.exports = catalogController
=======
module.exports = catalogController    
>>>>>>> 4dfe15377a0e35d954e7af35a413aa490c6221bd
