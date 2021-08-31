module.exports = [{
name: "clap",
execute(message,args,client) {
if(!args) return message.channel.send('You need a message to 👏 clap 👏')
return message.channel.send(args.join('👏'))
}
}, {
name: "clap",
execute(interaction,cmd,args,client) {
interaction.send(args[0].split(/ +/).join('👏'))
},
type: "slash",
create(create) {
return create({ name: "clap", description: "clap your message!", options: [{
				name: 'message',
				type: 'STRING',
				description: 'the message to add 👏 to',
				required: true,
			}]
})
}

}]