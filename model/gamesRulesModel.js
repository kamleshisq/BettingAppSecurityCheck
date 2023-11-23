const mongoose = require('mongoose')


const gamerules = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    whiteLabelName:{
        type:String,
        required:true
    }
})

const gameRuleModel = mongoose.model('gameRuleModel', gamerules)

module.exports = gameRuleModel