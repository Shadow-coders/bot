module.exports = {
name: 'http',
execute(interaction,cmd,args,client) {
const codes = require('../util/http')
const arg = args.find(a => a.name === 'status').value
if(codes[arg]) {
interaction.send({ content: codes[arg] })
} else {
interaction.send({ content: 'Invalid http status code', ephemeral: true })
}
}
}