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
this.findOne = async function(...prams) {
  return model.findOne(...prams).lean({ defaults: true });
  }
  this.find = (...params) => {
    return model.find(...params).lean({ defaults: true });
  }