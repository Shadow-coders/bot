module.exports = {
name: 'afk',
type: 'slash',
execute(interaction,cmd,args,client) {
const { message, member } = interaction;
let afkC = require("../commands/afk").execute(message, 
interaction.options.get('reason'), client);
}
