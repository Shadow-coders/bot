let { Schema, model } = require("mongoose");
let scheama = new Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  tags: Object,
});
let modell = model("tags", scheama);
module.exports = modell;
