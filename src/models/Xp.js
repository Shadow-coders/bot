const { Schema, model } = require("mongoose");
let sch = new Schema({
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  reqxp: { default: 100, type: Number },
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  bonus: { type: Number, default: 1 },
});
model = model("xp", sch);
module.exports = model;
this.findOne = async function(...prams) {
  return model.findOne(...prams).lean({ defaults: true });
  }
  this.find = (...params) => {
    return model.find(...params).lean({ defaults: true });
  }