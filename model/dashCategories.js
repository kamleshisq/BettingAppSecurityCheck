const mongoose = require('mongoose')

const categoriesSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    match_count:{
        type:Number,
        required:true
    },
    bet_count:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
        required:true
    }
})

const Categories = mongoose.model('dashcategories',categoriesSchema)

module.exports = Categories