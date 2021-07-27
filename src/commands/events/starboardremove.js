const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "messageReactionRemove",
    once: false,
    async execute(reaction,user,client) {
        const emojis = client.db.get('staremojis_' + reaction.message.guild.id) ? client.db.get('staremojis_' + reaction.message.guild.id) : ['⭐', '🌟']
        const channel = await client.db.get('starchannel_'+reaction.message.guild.id) || null
         const size = await client.db.get('starlimit_' + reaction.message.guild.id) || 0 
        const handleStarboard = async () => {
             const starboard = reaction.message.guild.channels.cache.find(ch => ch.id === channel)
             const msgs = await starboard.messages.fetch({ limit: 100 });
             const existingMsg = msgs.find(msg => 
                 msg.embeds.length === 1 ? 
                 (msg.embeds[0].footer.text.startsWith(reaction.message.id) ? true : false) : false);
             if(existingMsg) {
                 if(reaction.count === 0)
                     setTimeout(() => existingMsg.delete(), 2500)
                 else
                     existingMsg.edit(`${reaction.count} - ${ reaction.emoji.id ? `<${reaction.emoji.animated ? 'a' : '' }:${reaction.emoji.name}:${reaction.emoji.id}>` : reaction.emoji.name}`)
             };
         }
         if(reaction.emoji.id ? emojis.some(e => e === reaction.emoji.id) : emojis.some(e => e === reaction.emoji.name)) {
             if(reaction.message.channel.id === channel) return;
             if(reaction.count < size) return;
             if(reaction.message.partial) {
                 await reaction.fetch();
                 await reaction.message.fetch();
                 handleStarboard();
             }
             else
                 handleStarboard();
         }
    }
}