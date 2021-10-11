let mongoose = require("mongoose");
let { Schema } = mongoose;
let mainSchema = new Schema({
  ch: String,
  user: String,
  g: String,
  closed: Boolean,
});
let model = mongoose.model("modmail", mainSchema);
module.exports = model;
