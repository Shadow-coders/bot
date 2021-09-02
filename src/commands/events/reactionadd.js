module.exports = {
    name : "messageReactionAdd",
    once: false,
    type: "event",
    async execute(reaction, user, client) {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;
        if (!reaction.message.guild) return;
const { message } = reaction

const isRR = await client.db.get('rr_'+ message.id)
if(!isRR) return;
if(reaction.emoji.id) { 
    reaction.emoji.name = reaction.emoji.id
}
if(Array.isArray(isRR)) {
    const rr = isRR.find(r => r.emoji === reaction.emoji.name)
    if(reaction.message.guild.members.cache.get(user.id).roles.cache.has(rr.role_id)) {
        reaction.message.guild.members.cache.get(user.id).roles.remove(rr.role_id).then(r => reaction.message.reactions.cache.get(reaction.emoji.name).remove(user.id))
    }
    reaction.message.guild.members.cache.get(user.id).roles.add(rr.role_id).then(r => reaction.message.reactions.cache.get(reaction.emoji.name).remove(user.id))
} else {
   if(!reaction.emoji.name === isRR.emoji) return;
    if(reaction.message.guild.members.cache.get(user.id).roles.cache.has(isRR.role_id)) {
        reaction.message.guild.members.cache.get(user.id).roles.remove(isRR.role_id).then(r => reaction.message.reactions.cache.get(reaction.emoji.name).remove(user.id))
    }
    reaction.message.guild.members.cache.get(user.id).roles.add(isRR.role_id).then(r => reaction.message.reactions.cache.get(reaction.emoji.name).remove(user.id).catch(client.error))
}
    },
type: 'event'
}