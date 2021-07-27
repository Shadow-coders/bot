const Discord = require('discord.js')
module.exports = {
name: 'message',
once: false,
async execute(message, client) {
if(!message.guild) {
message.guild = null
}
client.users.cache.forEach(async user => {
  const words = await client.db.get('hil_' + user.id) || []
  if(!words.some(w => message.content.includes(w))) return;
  if(!message.guild.members.cache.some(m => m.id === user.id)) return;
  const embed = new Discord.MessageEmbed()
  .setDescription(message.channel.messages.cache.map(m => `**[${require('ms')(m.createdTimestamp)}]${m.author.username}**: ${m.content}`).slice(message.channel.messages.cache.size - 5, message.channel.messages.cache.size).join('\n'))
.setColor('GREEN')
.addField('Message link', `[Jump to message](${message.url})`, true)
.setAuthor(user.tag, user.displayAvatarURL())
.setTimestamp()
.setURL(message.url)
user.send({ embeds: [embed], content: `in ${message.guild.name} ${message.channel} you were highlighted by the word \'${words.find(w => message.content.includes(w))}\' `})
})
const cacheMsgs = client.cache
let MyStickyChannelID = await client.db.get('stickychannels_'+ message.guild.id)
async function remove(id) {
  const msg = message.channel.messages.cache.get(id);
  cacheMsgs.shift();
  if (msg) await msg.delete().catch(_e => {});
  if(!MyStickyChannelID) MyStickyChannelID = []
}
async function sticky() {
 if(message.author.bot) return;
  if (MyStickyChannelID.some(ch => message.channel.id === ch)) {
    let StickyMessage = await client.db.get('stickymessage_' + message.channel.id)
    // if length is more or 2 but not 0 then queue delete all and return without a message
    if (cacheMsgs.length >= 4 && cacheMsgs.length !== 0) return cacheMsgs.forEach(async id => remove(id)); 
    // if cache is more then 0 then queue delete all AND send a message
    // if (cacheMsgs.length > 0) {
    //   cacheMsgs.forEach(async id => await remove(id));
    // }
    // Send message and add to cache
    // console.log(cacheMsgs)
    const m = await message.channel.send(StickyMessage.replace('{user}', message.author.toString()))

    return cacheMsgs.push(m.id);
  }
  
}
if(MyStickyChannelID) {
  sticky()
}
// check channel is the sticky channel
// console.log(message.content)
let prefix = await client.dab.get('prefix_' + message.guild.id) || client.config.prefix
let fetched = new Set()
if(!fetched.has(message.guild.id)) {
  message.guild.members.fetch()
  fetched.add(message.guild.id, true)
}
if(!prefix) {
  prefix = client.config.prefix
}

if (!message.content.startsWith(prefix) || message.author.bot) return;

  
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	let cmd = args.shift().toLowerCase();
const validPermissions = [
    "CREATE_INSTANT_INVITE",
    "KICK_MEMBERS",
    "BAN_MEMBERS",
    "ADMINISTRATOR",
    "MANAGE_CHANNELS",
    "MANAGE_GUILD",
    "ADD_REACTIONS",
    "VIEW_AUDIT_LOG",
    "PRIORITY_SPEAKER",
    "STREAM",
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "SEND_TTS_MESSAGES",
    "MANAGE_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "READ_MESSAGE_HISTORY",
    "MENTION_EVERYONE",
    "USE_EXTERNAL_EMOJIS",
    "VIEW_GUILD_INSIGHTS",
    "CONNECT",
    "SPEAK",
    "MUTE_MEMBERS",
    "DEAFEN_MEMBERS",
    "MOVE_MEMBERS",
    "USE_VAD",
    "CHANGE_NICKNAME",
    "MANAGE_NICKNAMES",
    "MANAGE_ROLES",
    "MANAGE_WEBHOOKS",
    "MANAGE_EMOJIS",
  ]

  
let error;
error = new Discord.MessageEmbed()
.setTitle('um.')
.setDescription('The command ' + cmd + ' does not exist')
.setColor('#ff0000' || client.config.color)
.setTimestamp();
error.dms =  new Discord.MessageEmbed()
.setTitle('um.')
.setDescription('dms = no commands sir')
.setColor('#ff0000' || client.config.color)
.setTimestamp();
	if (!client.commands.has(cmd) ?  !client.commands.has(client.aliases.get(cmd)) : null) { 
if(cmd === '') return;
console.log(client.commands.has(client.aliases.get(cmd)))
message.channel.send({ embeds: [error] }).catch(e => {
  message.channel.send('Hey! the command ' + cmd + ' is not a command!')
})
return;
}


if(message.channel.type === 'dm') return message.reply(error.dms)
cmd = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd))

if(cmd.permissions && Array.isArray(cmd.permissions)) {
  let invalidPerms = []
    for(const perm of cmd.permissions){
      if(!validPermissions.includes(perm)){
        return client.error(`Invalid Permissions ${perm} for command ${cmd.name}`);
      }
      if(!message.member.permissions.has(perm)){
        invalidPerms.push(perm)
      }
    }
    if (invalidPerms > 0){
      return message.channel.send(`Missing Permissions: \`${invalidPerms.join('``')}\``);
    }
}
if(cmd.cooldown) {
  if(typeof cmd.cooldown !== 'number') {
    cmd.cooldown = 1000
  }
  if(await client.db.get(`${cmd.name}_${message.author.id}`)) {
return message.channel.send('You are on cooldown for ' + require('ms')(await client.db.get(`${cmd.name}_${message.author.id}`) - Date.now()))
  } else {
   await client.db.set(`${cmd.name}_${message.author.id}`, Date.now())
    setTimeout(async () => {
      await client.db.delete(`${cmd.name}_${message.author.id}`)
    }, cmd.cooldown);
  }
}
	try {
		cmd.execute(message, args, client);
	} catch (error) {
		// console.error(error);
client.error(error)
message.channel.send('ERROR! report this to the dev with an id of `' + Date.now() * client.errorCount + '`')
	}
}
}