let mongoose = require("mongoose");
let { Schema } = mongoose;
let mainSchema = new Schema(
  {
    key: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
    date: { type: Date, default: Date.now },
  },
  {
    capped: { size: 1024 / 8 },
    bufferCommands: false,
    autoCreate: false, // disable `autoCreate` since `bufferCommands` is false });
  }
);
let model = mongoose.model("main", mainSchema);
module.exports = model;
