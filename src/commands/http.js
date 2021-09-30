const { SlashCommandBuilder } = require('@discordjs/builders')
const { STATUS_CODES } = require('http')

module.exports = [{
  name: 'http',
  async execute(message,args,client) {
    const codes = STATUS_CODES
  const numb = args[0]
  if(codes[numb]) {
    message.reply(`**${numb},**\n> **${codes[numb]}**`)
  } else {
    message.reply('Not found')
  }
  }
}, {
  name: 'http',
  async execute(interaction,cmd,args,client) {
    const codes = STATUS_CODES
    const numb = args[0]
    if(codes[numb]) {
      interaction.reply(`**${numb},**\n> **${codes[numb]}**`)
    }
  },
  type: 'slash',
  data: new SlashCommandBuilder().setName('http').setDescription('Get http status codes').addStringOption(s => {
   Object.entries(require('http').STATUS_CODES).forEach(code => s.addChoice(code[1], code[1]))
    return s.setName('code').setDescription('The status code').setRequired(true)
  })
}]