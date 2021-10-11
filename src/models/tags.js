let { Schema, model } = require("mongoose");
let scheama = new Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  tags: Object,
});
model = model("tags", scheama);
module.exports = model;
this.findOne = async function(...prams) {
  return model.findOne(...prams).lean({ defaults: true });
  }
  this.find = (...params) => {
    return model.find(...params).lean({ defaults: true });
  }