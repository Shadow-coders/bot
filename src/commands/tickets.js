let model = require('../models/tickets')
let { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
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
        if(!channel) return message.reply("Invalid channel")
        if(!channel.type === 'GUILD_CATEGORY') return message.reply("Invalid")
        if(!data) data = {}
        data.catagory = channel.id 

        client.db.set('ticket_' + message.guild.id, data).then(() => { message.reply("Done!")})
    break;
    case 'message':  
    message.channel.send({ embeds: [new MessageEmbed().setTitle('Tickets').setDescription('Click the button to use tickets').setTimestamp()], components: [new MessageActionRow().addComponents(new MessageButton().setCustomId('tickets_create').setStyle('PRIMARY').setLabel(data.label || "Click for a ticket"))]})

    break;
default: 
if(!cmd) return;
message.reply("I dont know what  is " + cmd + ' is')
}
}
}]