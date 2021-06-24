const Discord = require('discord.js')
module.exports = {
name: 'message',
once: false,
async execute(message, client) {
if(!message.guild) {
message.guild = null
}
// console.log(message.content)
let prefix =  client.db.get('prefix_' + message.guild.id) || client.config.prefix

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
  if(client.db.get(`${cmd.name}_${message.author.id}`)) {
return message.channel.send('You are on cooldown for ' + require('ms')(Date.now() - client.db.get(`${cmd.name}_${message.author.id}`)))
  } else {
    client.db.set(`${cmd.name}_${message.author.id}`, Date.now())
    setTimeout(() => {
      client.db.delete(`${cmd.name}_${message.author.id}`)
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