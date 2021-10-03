const { Client, Message } = require("discord.js")
export default [{
    name: 'deploy',
    /**
     * 
     * @param {Message} message 
     * @param {String[]} args 
     * @param {Client} client 
     * @returns 
     */
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
},
{
    name: 'undeploy',
    /**
     * 
     * @param {Message} message 
     * @param {String[]} args 
     * @param {Client} client 
     * @returns 
     */
    async execute(message,args,client) {
        if(!client.devs.some(d => d === message.author.id)) return;
        let date = Date.now()
        await message.guild.commands.fetch();
        await client.application.commands.fetch()
        if(!args[0]) return message.reply('format: ' + message.content + ' <name> <GuildorGlobal>');
const command = args[0]
const isGlobal = args[1] ? args[1] === 'global' : false
let cmddata = isGlobal ? client.application.commands.cache.find(c => c.name === command) : message.guild.commands.cache.find(c => c.name === command)
if(!cmddata) return message.reply( ' command does not exist ' )
cmddata = cmddata.id
client.error(cmddata)
if(!isGlobal) message.guild.commands.delete(cmddata).then(() => message.reply(`Undeployed '${command}' took ${Date.now() - date}ms to this guild`))
if(isGlobal) client.application.commands.delete(cmddata).then(() => message.reply(`Uneployed '${command}' took ${Date.now() - date}ms to global`))
    }
}]