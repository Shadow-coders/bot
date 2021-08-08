const { Schema, model } = require("mongoose")
let scheama = new Schema({
guildId: String,
userId: String,
channelId: String,
users: String,
reason: String,
})
module.exports = model("tickets", scheama)