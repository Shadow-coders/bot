let Ticket = require('../models/tickets')
let { MessageEmbed, MessageActionRow, MessageButton, Message, Client, ButtonInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
/**
 * 
 * @param {Message} message 
 * @param {String[]} args 
 * @param {Client} client 
 */
async function ticketCreate(message,args,client, ops) {
let data = await client.db.get('ticket_' + message.guild.id)
if(ops.interaction) message.author = message.member.user
    if(!data)  {
        let str = "No data found for this guild"
         if(ops.interaction) return message.reply({content: str, ephemeral: true})
     return message.reply(str).then(m => { setTimeout(() => m.delete(), 3000) })
    } 
if(!data.catagory) {
    let str = "No catagory found for this guild"
     if(ops.interaction) return message.reply({content: str, ephemeral: true})
 return message.reply(str).then(m => { setTimeout(() => m.delete(), 3000) })
} 
if(await Ticket.findOne({ guildId: message.guild.id, userId: message.author.id})) {
   let str = 'You have a ticket'
    if(ops.interaction) return message.reply({content: str, ephemeral: true})
return message.reply(str).then(m => { setTimeout(() => m.delete(), 3000) })
} 
if(!data.roles) data.roles = []
if(!data.count) data.count = 0
/**
 * @returns {Array}
 */
let extraoptions = data.roles.map((role) => {
    return { id: role, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES'] }
})
let ch = await message.guild.channels.create(`${message.author.username}-${data.count}`, {
    reason: `[${message.author.toString()}] ticket created`,
    parent: data.catagory,
    permissionOverwrites: [
    { id: message.author.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'] }, 
    { id: message.guild.id, deny: ['VIEW_CHANNEL'] },
 ...extraoptions
],
topic: `${message.author}, ticket created today at ${message.createdAt} this user needs help on ${args.join(' ')}`,
rateLimitPerUser: 1
})
if(!ch) return message.reply("Faild to make channel")
data.count++
client.db.set('ticket_' + message.guild.id, data)
let row = new MessageActionRow().addComponents(new MessageButton().setEmoji('❌').setLabel('Close').setStyle('DANGER').setCustomId('ticket_close')).addComponents(new MessageButton().setLabel('Claim').setEmoji('🔓').setCustomId('ticket_claim').setStyle('SUCCESS'))
let Model = new Ticket({ userId: message.author.id, guildId: message.guild.id, reason: args.join(' ') !== '' ? args.join(' ') : null, claimedId: null, claimed: false })
ch.send({ embeds: [new MessageEmbed().setTitle('New ticket').setDescription(data.messages?.first ? data.messages.first : 'Thank you for making this ticket').setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))], components: [row] }).then(c => {
Model.messageId = c.id
Model.channelId = ch.id
Model.save();
})
;(() => { 
if(ops.interaction) return message.reply({ content: "Ticket created in " + `<#${ch.id}>`, ephemeral: true})
    return message.reply("Ticket created in " + `<#${ch.id}>`)
})()

}
/**
 * @name Tickets
 */
module.exports = [{
name: "ticket",
/**
 * 
 * @param {Message} message 
 * @param {String[]} args 
 * @param {Client} client 
 */
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
    if(!data) data = {}
    message.channel.send({ embeds: [new MessageEmbed().setTitle('Tickets').setDescription('Click the button to use tickets').setTimestamp()], components: [new MessageActionRow().addComponents(new MessageButton().setCustomId('tickets_create').setStyle('PRIMARY').setLabel(data?.label || "Click for a ticket"))]})

    break;
default: 
if(!cmd) return;
message.reply("I dont know what  is " + cmd + ' is')
}
}
}, {
name: 'ticketcreate',
/**
 * 
 * @param {Message} message 
 * @param {String[]} args 
 * @param {Client} client 
 */
async execute(message,args,client) {
ticketCreate(message,args,client)
}
}, { name: 'create', execute(interaction,cmd,args,client) {
ticketCreate(interaction,args,client,{ interaction: true, command: true})
},
data: new SlashCommandBuilder().setName("tickets").setDescription('Ticket sub command group').addSubcommand(command => {
    return command.setName('create').setDescription("create a ticket").addStringOption(option => {
        return option.setName('reason').setDescription("the reason for this ticket").setRequired(false)
    })
}),
type: 'slash' 
}, {
name: 'close',
async execute(message,args,client) {
    if(!await Ticket.findOne({ channelId: message.channel.id, guildId: message.guild.id })) return message.reply("This is not a ticket")
    let data = await Ticket.findOne({ channelId: message.channel.id, guildId: message.guild.id })
try {
let ch = client.channels.cache.get(data.channelId)
ch.send('Closed').then(() => { setTimeout(() => ch.delete(), 3000) })
data.remove()
} catch (e) {
    client.error(e.message)
    message.delete()
}
}
}, {
name: 'interactionCreate',
/**
 * 
 * @param {ButtonInteraction} interaction 
 * @param {Client} client 
 */
async execute(interaction,client) {
    if(!interaction.isButton()) return
    let cmd = interaction.customId
   switch(cmd) {
       case 'ticket_close': 
       if(!await Ticket.findOne({ channelId: interaction.channel.id, guildId: interaction.guild.id })) return interaction.reply("This is not a ticket")
       let data = await Ticket.findOne({ channelId: interaction.channel.id, guildId: interaction.guild.id })
   try {
   let ch = client.channels.cache.get(data.channelId)
  interaction.reply({ content: 'Deleting ticket in 3 seconds', ephemeral: false }).then(() => { setTimeout(() => ch.delete(), 3000) })
   data.remove()
   } catch (e) {
       client.error(e.message)
       interaction.reply({ content: 'I cannot delete this ticket an error acourred', ephemeral: true })
   }
       break;
       case 'ticket_claim':
     await interaction.deferReply();
       let ChannelData = Ticket.findOne({ channelId: interaction.channel.id });
       let GuildData = await client.db.get('ticket_' + interaction.guild.id)
       if(!GuildData) return interaction.editReply({ content: 'NO data found for this guild ', ephemeral: true });
       if(!ChannelData) return interaction.editReply({ content: 'NO data found for this channel ', ephemeral: true });
       if(!GuildData.roles) GuildData.roles = []
       ChannelData.claimedId = interaction.member.user.id
       ChannelData.claimed = true;
       await Ticket.findOneAndUpdate({ channelId: interaction.channel.id }, {
           claimedId: interaction.member.user.id
       })
       let extra = GuildData.roles.map((role) => {
           return { id: role, deny: ['SEND_MESSAGES'], allow: ['VIEW_CHANNEL'] }
       })
       interaction.channel.permissionOverwrites.set([{ 
        id: interaction.member.user.id,
        allow: ['SEND_MESSAGES', "VIEW_CHANNEL"]
    }, {
        id: interaction.guildId,
        deny: ['SEND_MESSAGES', "VIEW_CHANNEL"]
    }, 
    ...extra
])
interaction.editReply(`Ticket claimed by ${interaction.member.user}`)
       interaction.message.edit({ content: interaction.message.content ? interaction.message.content : undefined,  embeds: interaction.embeds, components: [new MessageActionRow().addComponents(new MessageButton().setCustomId('ticket_close').setStyle('DANGER').setLabel("CLose").setEmoji("❌")).addComponents(new MessageButton().setCustomId('ticket_claim').setLabel('Claimed').setEmoji('🔒').setDisabled(true).setStyle('SECONDARY'))]})       
       break;
       case 'tickets_create': 
       ticketCreate(interaction,['Button Click, none can be provided'],client, { interaction: true })
       break;
   }
},
type: 'event'
}]