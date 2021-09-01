const { MessageEmbed, Message } = require('discord.js')
module.exports = {
    name: 'messageUpdate',
    once: false,
    type: 'event',
    async execute(oldMessage, newMessage, client) {
       if(newMessage.author.bot) return;
       if(await client.db.get(`afk_${newMessage.author.id}`) !== null) return;
        try {
            const sukdik = new MessageEmbed()
            .setAuthor('Is Not AFK Anymore', newMessage.author.displayAvatarURL({ dynamic : true }))
            .setDescription(`**User** <@${newMessage.author.id}> just came Back from Being AFK.`)
            .setColor('#f5f50a')
            let data = await client.db.get("afk_" + message.author.id);
            message.member.setNickname(data.name);
            return newMessage.channel.send({ embeds: [sukdik] }).then(msg => {
              setTimeout(()=>{
                  msg.delete();
              }, 5000)
            }); // I like that embed name very lot mao
            await client.db.delete("afk_" + newMessage.author.id)
           } catch(error) {
               client.error(error)
           }
    }
}
