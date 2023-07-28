const mongoose = require("mongoose");

const StakeSchema1 = new mongoose.Schema({
    userId: {
      type: String,
      required: true
    },
    stakeArray: [{
      key: Number,
      value: Number
    }]
  });

const stakeModel1 = mongoose.model("stakeModel1", StakeSchema1);

module.exports = stakeModel1