let { Schema, model } = require("mongoose");
let scheama = new Schema({
  guildId: String,
  userId: String,
  channelId: String,
  users: String,
  reason: String,
  claimedId: { required: false, type: String, default: "none" },
  clamied: Boolean,
  messageId: { required: false, type: String, default: "" },
});
let modell = model("tickets", scheama);
module.exports = modell;
