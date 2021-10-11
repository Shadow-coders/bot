let mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    userId: String,
    cmd: String,
    time: Number,
    cooldown: Number,
  },
  {
    capped: { size: 1024 },
    bufferCommands: false,
    autoCreate: false, // disable `autoCreate` since `bufferCommands` is false });
  }
);
let model = mongoose.model("cooldown", schema);
module.exports = model;
this.findOne = async function(...prams) {
  return model.findOne(...prams).lean({ defaults: true });
  }
  this.find = (...params) => {
    return model.find(...params).lean({ defaults: true });
  }
