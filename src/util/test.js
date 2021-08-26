const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('test')
	.setDescription('Ticket options')
    .addSubcommandGroup(option => option.addSubcommand(o => o.setName('hola')).setName("testtwo"))
    data.toJSON()
    message.guild.commands.create(data.toJSON())