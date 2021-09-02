const { MessageEmbed, Message } = require('discord.js')
module.exports = {
    name: 'message',
    once: false,
    type: 'event',
    /**
     * 
     * @param {Message} message 
     * @param {Client} client 
     * @returns 
     */
    async execute(message, client) {
       if(message.author.bot) return;
       if (await client.db.get(`afk_${message.author.id}`)) {
        try {
            let data = await client.db.get("afk_" + message.author.id);
            const sukdik = new MessageEmbed()
            .setAuthor('Is Not AFK Anymore', message.author.displayAvatarURL({ dynamic : true }))
            .setDescription(`User <@${message.author.id}> just came Back from Being AFK.\n you had ${data.pings ? data.pings : 0} ping(s) \n and here are the link to the messages  \n ${data.ping_links ? data.ping_links : ""}`)
            .setColor('#f5f50a')
         //   let data = await client.db.get("afk_" + message.author.id);
            message.member.setNickname(data.name);
            message.channel.send({ embeds: [sukdik] }).then(msg => {
setTimeout(() => { msg.delete() }, 5000)
}); // I like that embed name very lot mao
            await client.db.delete("afk_" + message.author.id)
           } catch(error) {
               client.error(error)
           }
       } else {
           let user = await message.mentions.users.find(u => await client.db.get('afk_' + u.id))
           if(user) {
               let userData = await client.db.get('afk_' + user.id)
               if(!userData.pings) userData.pings = 0;
               if(!userData.ping_links) userData.ping_links = ''
               userData.pings++
               userData.ping_links += '\n' + `[${message.author.tag}](${message.url})`
            message.reply({ embeds: [new MessageEmbed().setTitle('Afk').setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true })).setDescription(`<@${user.id}> is afk, \n ${userData.reason ? userData.reason : ""}`).setTimestamp().setFooter('Please leave them alone').setColor('#f5f50a')]}).then(m => {
                setTimeout(m.delete,3000)
                client.db.set('afk_'+user.id, userData)
            })
           }
       }
      
    }
}
