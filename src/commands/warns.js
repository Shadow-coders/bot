const { MessageEmbed, Client, Message, SnowflakeUtil, Snowflake, Util } = require('discord.js')
const { re } = require('mathjs')
async function gwarns(client, message, user) {
return client.db.get('cases_' + user.id).filter(u => u.type === 'warn').map(u => ` ID: ${u.id} \ mod: ${u.author.username} \n Reason ${u.description}`).join('\n')
}
module.exports = [{
name: 'warns', 
async execute(message, args, client) {
let user = message.mentions.users.first() || client.users.cache.get(args[0])
if(!user) {
user = message.author
}
const m = await message.channel.send('fetching warns...')
const warns = await client.db.get('cases_' + user.id)
if(!warns) return m.edit(user.username + ' has No cases!')
if(!warns.filter(t => t.type === 'warns')) return m.edit(user.username + ' has No warns!')
const embed = new MessageEmbed()
.setTitle('Warns')
.setDescription(await gwarns(client, message, user))
.setColor('#ff0000')
.setFooter(`${user.username}'s warns`)
setTimeout(() => m.edit({ embeds: [embed] }),1000)
}
}, {
name: 'warn',
/**
 * 
 * @param {Message} message 
 * @param {String[]} args 
 * @param {Client} client 
 */
async execute(message,args,client) {
const NotGoodUser = () => message.reply('Invalid user, it cannot be \n Urself\n the owner \n or me ');
let member = await message.guild.members.fetch(message.mentions.users.first().id) || await message.guild.members.fetch(args[0])
if(!member) return message.reply('Invalid user')
let { user, bannable, kickable, roles, } = member
if(roles.highest.rawPosition > message.guild.me.roles.highest.rawPosition) return message.reply('this user is higher than mine')
if(roles.highest.rawPosition > message.member.roles.highest.rawPosition) return message.reply('This user has a higher role than you');
if(user.id === message.author.id) return NotGoodUser()
if(user.id === message.guild.ownerId) return NotGoodUser()
if(user.id === client.user.id) return NotGoodUser()
if(!bannable || !kickable) return message.reply('This user cant be kicked or banned. why should i be able to warn them!');
if(!message.member.permissions.has('MANAGE_MESSAGES')) return message.reply('Missing Perms! | MannageMessages ') 
let cases = await client.db.get('cases_' + user.id);
if(!cases) {
    client.db.set('cases_' + user.id, [])
    cases = []

}
const m = await message.channel.send('Warning...')
cases.push({ type: 'warn', author: message.author, description: args.slice(1).join(' '), id: SnowflakeUtil.generate(message.author.createdTimestamp)})
user.send({ embeds: [new MessageEmbed().set]})

}
}]