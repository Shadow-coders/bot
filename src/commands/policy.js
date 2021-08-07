let policy = require('fs').readFileSync('/home/container/src/POLICY').toString()
module.exports = [{
name: 'policy',
async execute(message,args,client) {
message.reply({ embeds: [{ title: 'Policy', description: policy }]})
}
}]