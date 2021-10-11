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
