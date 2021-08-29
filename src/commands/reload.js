module.exports = {
name: 'reload',
execute(message, args, client) {
if(!client.devs.some(dev => dev === message.author.id)) return;
const fs = require('fs')
let err;
const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js'));
const commands = []
try {
for (const file of commandFiles) {
    const command = require(`./${file}`);
if(Array.isArray(command)) {
let i = 0;
for(const cmd of command) {
i++
if(!cmd.name) throw 'Command ' + file.split('.')[0] + ' needs a name!'
if(cmd.aliases && Array.isArray(cmd.aliases)) {
cmd.aliases.forEach(ali => client.aliases.set(ali, cmd.name))
}

commands.push(`| Loaded ${cmd.name} ${cmd.aliases && Array.isArray(cmd.aliases) ? `(${cmd.aliases.join(' , ')})` : '' } at ${i}`)
client.commands.set(cmd.name, cmd);
} 
} else {
const cmd = command
if(!cmd.name) throw 'Command ' + file.split('.')[0] + ' needs a name!'
if(cmd.aliases && Array.isArray(cmd.aliases)) {
cmd.aliases.forEach(ali => client.aliases.set(ali, cmd.name))
}
client.commands.set(cmd.name, cmd);
commands.push(`| Loaded ${cmd.name} ${cmd.aliases && Array.isArray(cmd.aliases) ? `(${cmd.aliases.join(' , ')})` : '' } `)
}
    
}
} catch (e) {
client.error(e) 
err = e
} finally {
if(err) return message.channel.send(err.message)
message.channel.send(commands.join('\n'))
}
}
}