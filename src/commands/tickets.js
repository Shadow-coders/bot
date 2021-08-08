let model = require('../models/tickets')
/**
 * @name Tickets
 */
module.exports = [{
name: "ticket",
async execute(message,args,client) {
if(!args) return message.reply("Missing Args , ")
let cmd = args.shift()
let data = await client.db.get('ticket_' + message.guild.id)
switch(cmd) {
    case 'setCatagory':
        if(!args[0]) return message.reply("Missing Args , Channel id")
        let channel = message.guild.channels.cache.get(args[0])
    break;
default: 
if(!cmd) return;
message.reply("I dont know what  is " + cmd + ' is')
}
}
}]