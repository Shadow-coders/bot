const { SlashCommandBuilder } = require('@discordjs/builders')
const { STATUS_CODES } = require('http')

export default [{
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
    } else {
      interaction.reply({ emphral: true, content: 'Invalid http status code' })
    }
  },
  type: 'slash',
  data: new SlashCommandBuilder().setName('http').setDescription('Get http status codes').addIntegerOption(i => {
    return i.setName('code').setDescription('The http status code').setRequired(true)
  })
}]