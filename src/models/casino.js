let mongoose = require("mongoose");

let profileSchema = new mongoose.Schema({
  userID: { type: String, require: true, unique: true },
  serverID: { type: String, require: true },
  coins: { type: Number, default: 1000 },
  bank: { type: Number },
});

let model = mongoose.model("casino", profileSchema);

module.exports = model;
this.findOne = async function(...prams) {
return model.findOne(...prams).lean({ defaults: true });
}
this.find = (...params) => {
  return model.find(...params).lean({ defaults: true });
}