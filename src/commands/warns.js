const { MessageEmbed } = require('discord.js')
function gwarns(client, message, user) {
return client.db.get('cases_' + user.id).filter(u => u.type === 'warn').map(u => ` ID: ${u.id} \ mod: ${u.author.username} \n Reason ${u.description}`).join('\n')
}
module.exports = {
name: 'warns', 
async execute(message, args, client) {
let user = client.users.cache.get(args[0])
if(!user) {
user = message.author
}
const m = await message.channel.send('fetching warns...')
const warns = client.db.get('cases_' + user.id)
if(!warns) return m.edit(user.username + ' has No cases!')
if(!warns.filter(t => t.type === 'warns')) return m.edit(user.username + ' has No warns!')
const embed = new MessageEmbed()
.setTitle('Warns')
.setDescription(gwarns(client, message, user))
.setColor('#ff0000')
.setFooter(`${user.username}'s warns`)
setTimeout(() => m.edit(embed),1000)
}
}