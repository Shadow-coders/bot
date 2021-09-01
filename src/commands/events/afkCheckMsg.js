const { MessageEmbed, Message } = require('discord.js')
module.exports = {
    name: 'message',
    once: false,
    type: 'event',
    async execute(message, client) {
       if(message.author.bot) return;
       if(await client.db.get(`afk_${message.author.id}`) === null) return;
        try {
            const sukdik = new MessageEmbed()
            .setAuthor('Is Not AFK Anymore', message.author.displayAvatarURL({ dynamic : true }))
            .setDescription(`User <@${message.author.id}> just came Back from Being AFK.`)
            .setColor('#f5f50a')
            let data = await client.db.get("afk_" + message.author.id);
            message.member.setNickname(data.name);
            message.channel.send({ embeds: [sukdik] }).then(msg => {
setTimeout(() => { msg.delete() }, 5000)
}); // I like that embed name very lot mao
            await client.db.delete("afk_" + message.author.id)
           } catch(error) {
               client.error(error)
           }
    }
}
