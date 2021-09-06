let { MessageEmbed, version, Client } = require("discord.js");
const os = require("os");

function bytesToMB(bytes) {
  return (Math.round(bytes / 1024) / 1024).toFixed(1);
}

module.exports = {
  name: "ready",
  once: true,
  type: "event",
  /**
   *
   * @param {Client} client
   */
  async execute(client) {
    console.log(client.user.tag);
  //  await client?.application?.fetch();
    const neon = "566766267046821888";
    client.devs = [neon, "818495703718035487", "476737878588915723"];
    client.channels.cache
      .get("765669027552559149")
      .send({
        content:
          "ready on djs @everyone " +
          `<@${client.devs.join("> <@")}> ${client.dab.ping}`,
      });
      client.on('messageCreate', async m => {
      if(!m.guildId === '765669027552559145') return;
     if(message.content.startsWith('>>>eval')) {
       let args = message.content.split(/ +/).slice(1)
       let message = m
       try {
        let evaled = await eval(args.join(' '));
        if(!typeof evaled === 'string') evaled = require('util').inspect(evaled);
        return m.channel.send('```\n'+evaled+'```')
       } catch(e) {
         m.channel.send(e.message)
         client.error(e)
       }
     }
     else m.channel.send('message event = true')
      })
    client.channels.cache
      .get("881551832059621459")
      .send(
        `Bruh I am online bois come and test me <@${client.devs.join("> <@")}>`
      );
    // console.log(client.dab)
    client.error(client.devs);
    const wait = require("util").promisify(setTimeout);
    const logger = require("../log");
    const log = new logger(client, "829753754713718816");
    client.db.logger = log;
    client.logger = log;
    client.channels.cache.get("830471074193080381").fetch();
    client.channels.cache.get("830471074193080381").messages.fetch();
    setInterval(() => {
      let m = client.channels.cache
        .get("830471074193080381")
        .messages.cache.get("830471635589005312");
      m.edit({
        embeds: [
          new MessageEmbed()
            .setDescription(
              `RAM Status:
 - ${bytesToMB(process.memoryUsage().rss)} MiB RAM
 - ${bytesToMB(process.memoryUsage().heapTotal)} MiB Total
 - ${bytesToMB(process.memoryUsage().heapUsed)} Used
 - System Usage: ${bytesToMB(os.totalmem() - os.freemem())}/${bytesToMB(
                os.totalmem()
              )} MiB 
 CPU Status:
 - Now Usage: ${os.loadavg()[0].toFixed(1)} (%)
 - Total Usage: ${os
   .loadavg()
   .map((a) => a.toFixed(1))
   .join("/")} (1m/5m/15m)
 - CPU Based: ${os.arch()}
 - CPU Model: ${os.cpus()[0].model}
 - CPU Rate: ${os.cpus()[0].speed} MHz

 Versions:
 - Node: ${process.version}
- discord.js: ${version}
 System Status
 - System Platfrom: ${os.platform()} (${os.release()})
 - Server Name: ${os.hostname()}
 - Home Directory: ${os.homedir()}
`
            )
            .setTitle("Server stats")
            .setThumbnail(client.user.displayAvatarURL())
            .setColor("#2f3136")
            .setTimestamp(),
          new MessageEmbed()
            .setTitle("Client stats")
            .setDescription(
              `• Users: ${client.users.cache.size}
• Servers: ${client.guilds.cache.size}
• Channels: ${client.channels.cache.size}
- ${
                client.channels.cache.filter((c) => c.type === "GUILD_CATEGORY")
                  .size
              } Categories
- ${
                client.channels.cache.filter(
                  (c) => c.type === "GUILD_TEXT" || c.type === "GUILD_NEWS"
                ).size
              } Text
-  ${client.channels.cache.filter((c) => c.type === "GUILD_VOICE").size} Voice
- ${
                client.channels.cache.filter(
                  (c) => c.type === "GUILD_STAGE_VOICE"
                ).size
              } stages
- ${
                client.channels.cache.filter(
                  (c) => c.type === "GUILD_PUBLIC_THREAD"
                ).size
              }  threads
• Total commands: ${client.commands.size}
• Latency: ${client.ws.ping} ms
• Uptime: ${require("ms")(client.uptime)}
• Owner(s): <@${client.devs.join("> <@")}> `
            )
            .setFooter("Updates every 9s")
            .setThumbnail(client.user.displayAvatarURL())
            .setColor("#2f3136")
            .setTimestamp(),
        ],
      });
    }, 9000);
    !client.application?.owner ? await client.application.fetch() : null;
    const commands = [];

    client.slash_commands.forEach((cmd) => {
      if (cmd.data) {
        if (commands.find((c) => cmd.name === c.name)) {
          return;
        }
        return commands.push(cmd.data.toJSON());
      }
    });
    client.commands.set(commands);
    client.slash_commands.set(0, commands);
    /*client.fetchCache = function() { client.guilds.cache.forEach(guild => {
    console.log(' | loaded guild ' + guild.name)
    guild.members.fetch().then(() => {
        await wait(2000)
        guild.channels.fetch().then(() => {
            guild.channels.cache.forEach(ch => {
               await wait(2000) // console.log(`/discord/shadow/@me/${guild.id}/${ch.id}`)
                ch.messages.fetch({ limit: 1000 })
            })
        })
    })
})
}*/
  },
};
