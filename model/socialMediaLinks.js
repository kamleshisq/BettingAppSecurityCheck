const mongoose = require('mongoose')


const SocialInfo = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:true
    },
    link : {
        type:String,
    },
    whiteLabelName:{
        type:String,
        required:true
    }
})

const socialinfomodel = mongoose.model('socialinfomodel', SocialInfo)

module.exports = socialinfomodel