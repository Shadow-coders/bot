module.exports = {
name: 'afk',
type: 'slash',
data: {
  options: [
    SlashCommandStringOption {
      name: 'reason',
      description: 'Why you wana go afk',
      required: false,
      type: 3,
      choices: undefined
    }
  ],
  name: 'afk',
  description: 'Go afk or something'
},
execute(interaction,cmd,args,client) {
const { message, member } = interaction;
let afkC = require("../commands/afk").execute(message, 
interaction.options.get('reason'), client);
}
