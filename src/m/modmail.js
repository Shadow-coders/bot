let map = require('../models/modmail.js')
let { MessageEmbed, Message, Client, MessageAttachment } = require("discord.js")
/**
 * 
 * @param {Message} message 
 * @param {Client} client 
 * @returns 
 */
async function start(message,client,args) {
let g = args[0] ? ( client.guilds.cache.get(args[0]) ? client.guilds.cache.get(args[0]).id : null) : null
if(!g) return message.reply('Error missing argument or invalid guild.id')
let chp = await client.db.get(`modmail_${g}`)
if(!chp) return;
let guild = client.guilds.cache.get(g)
let perms = [{ id: guild.id, deny: ["VIEW_CHANNEL"]}, { id: client.user.id, allow: ['SEND_MESSAGES', 'EMBED_LINKS'] }]
let roles = chp.roles
if(Array.isArray(roles) && roles.some(r => typeof r === 'STRING')) {
for(const role of roles) {
perms.push({ id: role, allow: ['VIEW_CHANNEL', "SEND_MESSAGES"]})
}
}
let ch = await guild.channels.create(message.author.tag, {
reason: `[MODMAIL] new session with ${message.author.tag}`,
 permissionOverwrites: perms,
})
ch.setParent(chp.id).catch(e => {
client.error(e)
message.reply('error making channel modmail! deleteing... send this error to the devs \n ' + Buffer.from(e.message, 'utf8').toString('base64'))
ch.delete()
})
if(!await map.exists({ user: message.author.id })) { 
new map({
    g: g,
    user: message.author.id,
    ch: ch.id,
}).save()
} else {
map.findOne({ user: message.author.id }).then(d => d.remove())
new map({
    g,
    user: message.author.id,
    ch: ch.id,
}).save()
}
message.channel.send("Starting session")
ch.send("SESSION WITH " + message.author.username)
client.on('messageCreate', m => {
if(m.author.bot) return;  
  if(m.channel.id === ch.id) {
        message.channel.send({ embeds: [new MessageEmbed().setDescription(m.content).setAuthor(m.author.tag, m.author.displayAvatarURL({ dynamic: true })).setColor("GREEN").setFooter(m.id).setTimestamp()]})
    }
})

}
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
    if(cmd === 'start' && !await map.exists({ user: message.author.id })) {
     start(message, client,args)
    } else if(cmd === 'close') {
        message.reply("Ending")
        client.channels.cache.get(await map.findOne({ user: message.author.id}).ch).send("closing.. in 3 secs").then(ms =>  {
setTimeout(() => ms.channel.delete(), 3000)
})
        map.findOne({ user: message.author.id}).then(mm => mm.remove())
    } else {
let user = await map.findOne({user:message.author.id})
if(!user) return start(message, client,args)
let attachments = []
if(message.attachments) {
    message.attachments.forEach(att => {
        attachments.push(new MessageAttachment(att.attachment, att.name))
    })
}
// console.log(user.ch)
let ch = client.channels.cache.get(user.ch)
if(!ch) return message.reply("the channel has been deleted or not found! deleting session..").then((m) => {
map.FindOneAndRemove({ user: message.author.id })
})
ch.send({ embeds: [new MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true })).setDescription(message.content + `\n ${attachments.map(att => `[attachment/${att.name}]`).join('\n')}`).setTimestamp().setFooter(message.id).setColor("GREEN")], files: attachments }).catch(client.error)
    }
}