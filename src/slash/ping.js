module.exports = {
name: 'ping',
execute(interaction,cmd,args,client) {
interaction.send('Pong! ' + client.ws.ping)
},
type: "slash"
}