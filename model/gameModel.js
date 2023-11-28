const mongoose = require("mongoose");

const gamemodel = mongoose.Schema({
    game_name:{
        type:String,
        required:true
    },
    provider_name:{
        type:String,
        required:true
    },
    sub_provider_name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true,
        default:true
    },
    game_id:{
        type:Number,
        required:true
    },
    game_code:{
        type:String,
        required:true
    },
    url_thumb:{
        type:String,
        required:true
    },
    whiteLabelName:{
        type:String,
        required:true
    }
});

const gameModel = mongoose.model('gameModel', gamemodel);

module.exports = gameModel;