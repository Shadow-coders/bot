const S = require('@discordjs/builders').SlashCommandBuilder

module.exports = {
name: 'afk',
type: 'slash',
data: new S().setName('afk').setDescription('Go afk or something').addStringOption(s => s.setName('reason').setDescription('Why you wana go afk')),
execute(interaction,cmd,args,client) {
let afkC = require("../commands/afk").execute(interaction, 
interaction.options.get('reason'), client);
}
}
