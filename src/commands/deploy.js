module.exports = {
    name: 'deploy',
    async execute(message,args,client) {
        if(!client.devs.some(d => d === message.author.id)) return;
        let date = Date.now()
        if(!args[0]) return message.reply('format: ' + message.content + ' <name> <GuildorGlobal>');
const command = args[0]
const isGlobal = args[1] ? args[1] === 'global' : false
if(!client.slash_commands.find(c => c.name == command)) return message.reply('Command ' + command + ' does not exist');
let cmd = client.slash_commands.find(c => c.name == command);
client.error(cmd)
let { name, description, options } = cmd
let cmddata = cmd.data ? cmd.data.toJSON() : { name, description, options }
client.error(cmddata)
if(!isGlobal) message.guild.commands.create(cmddata).then(() => message.reply(`Deployed '${command}' took ${Date.now() - date}ms to this guild`))
if(isGlobal) client.application.commands.create(cmddata).then(() => message.reply(`Deployed '${command}' took ${Date.now() - date}ms to global`))
}
}