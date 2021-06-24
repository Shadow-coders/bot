module.exports = {
name: 'reload',
execute(message, args, client) {
if(!client.devs.some(dev => dev.id === message.author.id)) return;
const fs = require('fs')
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./${file}`);
if(Array.isArray(command)) {
for(const cmd of command) {
if(!cmd.name) throw 'Command ' + file.split('.')[0] + ' needs a name!'
if(cmd.aliases && Array.isArray(cmd)) {
cmd.aliases.forEach(ali => client.commands.set(ali, cmd))
}
client.commands.set(cmd.name, cmd);
} 
} else {
const cmd = command
if(!cmd.name) throw 'Command ' + file.split('.')[0] + ' needs a name!'
if(cmd.aliases && Array.isArray(cmd)) {
cmd.aliases.forEach(ali => client.commands.set(ali, cmd))
}
client.commands.set(cmd.name, cmd);
message.channel.send(`| Loaded ${cmd.name}`)
}
    
}
}
}