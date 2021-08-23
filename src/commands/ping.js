const ms = require('ms')
module.exports = [{
	name: 'ping',
	description: 'Ping!',
	cooldown: 4,
	async execute(message, args, client) {
		let m  = await message.channel.send('pinging...')
const ping = client.ws.ping + Date.now() - message.createdTimestamp + Date.now() - m.createdTimestamp + (client.db.ping / 10)
		m.edit('> Pong ' + client.ws.ping + `(\`${ms(client.ws.ping)}\`) \n > latency: ` + `${Date.now() - message.createdTimestamp} (\`${ms(Date.now() - message.createdTimestamp)}\`)\n > edit latency: ${Date.now() - m.createdTimestamp} (\`${ms(Date.now() - m.createdTimestamp)}\`) \n > DB latency ${client.db.ping / 10} (\`${ms(client.db.ping / 10)}\`) \n > overall ping: \`${ping}\` (\`${ms(ping)}\`)` );
	},
}, {
name: 'ping',
execute(interaction,cmd,args,client) {
interaction.reply('Pong! ' + client.ws.ping)
},
type: "slash"
}];