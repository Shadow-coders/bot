let map = new Map()
let { MessageEmbed, Message, Client, MessageAttachment } = require("discord.js")
/**
 * 
 * @param {Message} message 
 * @param {Client} client 
 * @returns 
 */
module.exports = async (message, client)  => {
    if(message.author.bot) return;
    let args = message.content.slice('').trim().split(/ +/);
    let cmd = args.shift()
    if(message.content === 'start' && !map.get(message.author.id)) {
     
let g = args[0] ? ( client.guilds.cache.get(args[0]) ? client.guilds.cache.get(args[0]).id : null) : null
if(!g) return message.reply('Error missing argument or invalid guild.id')
let ch = await client.db.get(`modmail_${g}`)
if(!ch) return;
map.set(message.author.id, {
    guild: g,
    user: message.author.id,
    ch: ch,
})
message.channel.send("Starting session")
ch = client.channels.cache.get(ch)
ch.send("SESSION WITH " + message.author.username)
client.on('messageCreate', m => {
    if(m.channel.id === ch.id) {
        message.channel.send(m.content)
    }
})
    } else if(cmd === 'close') {
        message.reply("Ending")
        client.channels.cache.get(map.get(message.author.id).ch).send("closing..")
        map.delete(message.author.id)
    } else {
let user = map.get(message.author.id)
let attachments = []
if(message.attachments) {
    message.attachments.forEach(att => {
        attachments.push(new MessageAttachment(att.attachment, att.name))
    })
}
user.channel.send({ embeds: [new MessageEmbed().setAuthor(mesaage.author.tag, message.author.displayAvatarURL({ dynamic: true })).setDescription(message.content).setTimestamp().setFooter(message.id).setColor("RED")], files: attachments})
    }
}