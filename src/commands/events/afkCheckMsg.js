const { MessageEmbed, Message } = require('discord.js')
module.exports = {
    name: 'message',
    once: false,
    type: 'event',
    async execute(message, client) {
       if(message.author.bot) return;
       if (await client.db.get(`afk_${message.author.id}`) === null) {
      message.mentions.users.forEach((user) => {
        if (await client.db.get(`afk_${user.id}`) !== null) {
        try {
         const data = await client.db.get(`afk_${user.id}`);
         const suk = new MessageEmbed()
        .setAuthor(user.username + " AFK", `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`)
        .setDescription(`User <@${user.id}> is AFK. ${(data.reason === null) ? "" : "\nReason: " + data.reason}`)
        .setColor('#f5f50a')
          return message.channel.send({ embeds: [suk] }, {allowedMentions: { users: []}}).then(msg => {
            setTimeout(() => {
              msg.delete();
            }, 4000)
          })
        } catch(err) {
          client.error(err);
        }
        }
      });
    };
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
