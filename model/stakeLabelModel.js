const mongoose = require("mongoose");

const KeyValueSchema = new mongoose.Schema({
    key: Number,
    value: Number
  });
const StakeModel = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    stakeArray:[KeyValueSchema]
})

const stakeModel = mongoose.model("stakeModel", StakeModel);

module.exports = stakeModel