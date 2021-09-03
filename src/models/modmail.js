const mongoose = require("mongoose");
const { Schema } = mongoose;
const mainSchema = new Schema({
  ch: String,
  user: String,
  g: String,
  closed: Boolean,
});
module.exports = mongoose.model("modmail", mainSchema);
