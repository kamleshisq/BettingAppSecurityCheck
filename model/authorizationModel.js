const mongoose = require('mongoose');


const Authorization1 = mongoose.Schema({
    UserControll :[{
        type:String
    }],
    RoleAuth:[{
        type:String
    }]
});

const Authorization = mongoose.model('Authorization', Authorization1);

module.exports = Authorization;