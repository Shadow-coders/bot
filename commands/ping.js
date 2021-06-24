module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, args, client) {
		message.channel.send('> Pong ' + client.ws.ping + ' \n > latency: ' + `${Date.now() - message.createdTimestamp}` );
	},
};