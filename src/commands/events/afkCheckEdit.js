const { MessageEmbed, Message } = require('discord.js')
module.exports = {
    name: 'messageUpdate',
    once: false,
    type: 'event',
    async execute(oldMessage, newMessage, client) {
       if(newMessage.author.bot) return;
       if (await client.db.get(`afk_${newMessage.author.id}_${newMessage.guild.id}`) === null) return;
        try {
            let data = await client.db.get("afk_" + newMessage.author.id + "_" + newMessage.guild.id);
            let message = newMessage
            const sukdik = new MessageEmbed()
            .setAuthor('Is Not AFK Anymore', newMessage.author.displayAvatarURL({ dynamic : true }))
            .setDescription(`**User** <@${newMessage.author.id}> just came Back from Being AFK. \n you had ${data.pings ? data.pings : 0} ping(s) \n and here are the link to the messages (if any) \n ${data.ping_links ? data.ping_links : ""}`)
            .setColor('#f5f50a')
           
            newMessage.member.setNickname(data.name);
            newMessage.reply({ embeds: [sukdik] }, { messageReference: newMessage.id }).then(msg => {
              setTimeout(()=>{
                  msg.delete();
              }, 5000)
            }); // I like that embed name very lot mao
            await client.db.delete("afk_" + newMessage.author.id + "_" + newMessage.guild.id);
           } catch(error) {
               client.error(error)
           }
    }
}
