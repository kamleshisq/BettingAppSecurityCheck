const mongoose = require('mongoose');


const CasinoFevorite = mongoose.Schema({
    userId :{
        type:String,
        required:true,
        unique:true
    },
    gameId:[{
        type:String,
        unique:true
    }]
})

const CasinoFevoriteModel = mongoose.model('CasinoFevoriteModel', CasinoFevorite)

module.exports = CasinoFevoriteModel