const { MessageEmbed, Message } = require('discord.js')
module.exports = {
    name: 'messageUpdate',
    once: false,
    execute(oldMessage, newMessage, client) {
       if(newMessage.author.bot) return;
        try {
            const sukdik = new MessageEmbed()
            .setAuthor('Message Edited', newMessage.author.displayAvatarURL({ dynamic : true }))
            .setDescription(`**User:** <@${newMessage.author.id}> - ${newMessage.author.id}\n**Channel:** <#${newMessage.channel.id}> - [Jump to Messages](https://discordapp.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${oldMessage.id})`)
            .addField('Before:', `${oldMessage.content}`, true)
            .addField('After:', `${newMessage.content}`, true)
            .setFooter(`Message ID: ${oldMessage.id}`)
            .setTimestamp()
            .setColor('#f5f50a')
        
            return oldMessage.guild.channels.cache.get(client.db.get('mlogs_' + oldMessage.guild.id)).send({ embeds: [sukdik] });
           } catch(error) {
               client.error(error)
           }
    }
}