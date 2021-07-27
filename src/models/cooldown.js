const mongoose = require('mongoose')

let schema = new mongoose.Schema({
    userId: String,
    cmd: String,
    time: Number,
    cooldown: Number,
},
{ 
capped: { size: 1024 },
 bufferCommands: false, 
autoCreate: false // disable `autoCreate` since `bufferCommands` is false }); 
})

module.exports = mongoose.model('cooldown', schema)