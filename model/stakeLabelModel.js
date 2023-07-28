const mongoose = require("mongoose");

const StakeSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true
    },
    stakeArray: [{
      key: Number,
      value: Number
    }]
  });

const stakeModel = mongoose.model("stakeModel", StakeSchema);

module.exports = stakeModel