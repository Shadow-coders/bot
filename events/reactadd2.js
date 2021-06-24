module.exports = {
    name : "messageReactionAdd",
    once: false,
    async execute(reaction, user, client) {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return console.log(1+1);
        if (!reaction.message.guild) return console.log(1);
const { message } = reaction
console.log(reaction)
const emojis = ['⭐']
if(emojis.some(em => em === reaction.emoji.name) && reaction.count >= 2) {
    console.log(true)
message.channel.send('Hi! ' + reaction.count + ` from ${message.author} & ${user}`)    
}
    }
}