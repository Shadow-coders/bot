let policy = require('fs').readFileSync('/home/container/src/POLICY').toString()
const { SlashCommandBuilder } = require("@discordjs/builders")
module.exports = [{
name: 'policy',
async execute(message,args,client) {
message.reply({ embeds: [{ title: 'Policy', description: policy }]})
}, 
},{
    name: 'policy',
    async execute(interaction) {
        interaction.reply({ embeds: [{title: 'Policy', description: policy}] });
    },
    type: 'slash',
    data: new SlashCommandBuilder().setName('stat').setDescription('Stats').addSubcommand(c => c.setName('policy').setDescription('The policy of Shadow Bot'))
}]