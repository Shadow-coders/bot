const mongoose = require("mongoose")
const { Schema } = mongoose
const mainSchema = new Schema({
key: { type: String, required: true },
data: { type: Schema.Types.Mixed, required: true },
date: { type: Date, default: Date.now }
}, { 
capped: { size: 1024 },
 bufferCommands: false, 
autoCreate: false // disable `autoCreate` since `bufferCommands` is false }); 
})
module.exports = mongoose.model("main", mainSchema)