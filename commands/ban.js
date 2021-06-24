const Discord = require('discord.js');

module.exports = {
    name: 'ban',
    description: "Ban a person",
usage: '<prefix>ban [user]',
    execute(message, args, client){
const error = function(text) {
if(typeof text !== 'string') {
text = text.toString()
}
message.channel.send(text)
}
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send("Invalid Permissions")
        let User = message.guild.members.cache.get(message.mentions.users.first()) || message.guild.members.cache.get(args[0])
let user = User
        if (!User) return message.channel.send("Invalid User")
if(user.id === client.user.id || user.id === message.guild.ownerID) return error('Higher perms | user is me or the owner')
    //    if (User.permissions.has("BAN_MEMBERS") && !User.roles.highest.position > message.guild.members.resolve(message.author).roles.highest.position && message.author.id !== message.guild.owner.id) return message.reply(" both are = ")
//if(User.roles.highest.position > message.guild.members.resolve(client.user).roles.highest.position)
  //  return message.channel.send("My highest role is lower than the mentioned user's role");
//if(User.roles.highest.position > message.guild.members.resolve(message.author).roles.highest.position && message.author.id !== message.guild.owner.id)
    // return message.channel.send(":x: this user has a higher role then you!");
        let banReason = args.join(" ").slice(22);
        if (!banReason) {
            banReason = "None provided by "
        }
        User.send('You were banned for a reason of ' + banReason).catch(e => { error(e.message)})
        message.channel.send('Banned ' + User.username + ' for a reason of ' + banReason)
        User.ban({reason: banReason  + ` ${message.author.tag} (${message.author.id})`}).catch(e=>client.error(e))
const id = Date.now() * client.errorCount
const cases_thing = client.db.get('cases_' + User.id) 
cases_thing.push({
type: 'ban',
description: banReason,
author: message.author,
id: id
})
client.db.set('cases_' + user.id, cases_thing)
client.db.set(`case_${id}_${User.id}`, {
type: 'ban',
description: banReason,
author: message.author,
banid: id
})
}
}