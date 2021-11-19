//let { MessageEmbed, version, Client } = require("discord.js");
import { NewsChannel, TextChannel, version } from "discord.js";
import os = require("os");
import { Shadow, MessageEmbed, Message } from "../../client";
function bytesToMB(bytes: any) {
  return (Math.round(bytes / 1024) / 1024).toFixed(1);
}

export default {
  name: "ready",
  once: true,
  type: "event",
  /**
   *
   * @param {Client} client
   */
  async execute(client: Shadow) {
    console.log(client.user?.tag);
    //  await client?.application?.fetch();
    const neon = "566766267046821888";
    client.devs = [neon, "818495703718035487", "476737878588915723"]; //e
    (client.channels.cache.get("765669027552559149") as TextChannel)?.send({
      content:
        "ready on djs @everyone " +
        `<@${client.devs.join("> <@")}> ${client.dab.ping}`,
    });
    (client.channels.cache.get("881552094610460682") as TextChannel).send(
      `Bruh I am online bois come and test me <@${client.devs.join("> <@")}>`
    );
    (client.channels.cache.get("832694631459192903") as NewsChannel)
      .send({
        embeds: [
          new MessageEmbed()
            .setTitle("Ready")
            .setColor("GREEN")
            .setTimestamp()
            .setAuthor(
              client.user ? client.user.tag : "",
              client.user?.displayAvatarURL({ dynamic: true })
            )
            .setThumbnail(
              client.guilds.cache.get("778350378445832233")
                ? `${client.guilds.cache.get("778350378445832233")?.iconURL()}`
                : ""
            )
            .setDescription(
              "Im ready and loaded from my vps! \n you should now be able to interact wiith me! need help? contact the devs \n <@" +
                client.devs.join("> <@") +
                ">"
            ),
        ],
      })
      .then((m) => {
        m.crosspost();
      });
    // console.log(client.dab)
    client.error ? client.error(client.devs) : null;
    const wait = require("util").promisify(setTimeout);
    const logger = require("../log").default;
    const log = new logger(client, "829753754713718816");
    client.db.logger = log;
    client.logger = log;
    client.channels.cache.get("830471074193080381")?.fetch();
    (
      client.channels.cache.get("830471074193080381") as TextChannel
    )?.messages.fetch();
    setInterval(() => {
      let m = (
        client.channels.cache.get("830471074193080381") as TextChannel
      ).messages.cache.get("830471635589005312");
      if (!m) return;
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
            .setThumbnail(client.user ? client.user.displayAvatarURL() : "")
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
• Owner(s): <@${client.devs?.join("> <@")}> `
            )
            .setFooter("Updates every 9s")
            .setThumbnail(client.user ? client.user.displayAvatarURL() : "")
            .setColor("#2f3136")
            .setTimestamp(),
        ],
      });
    }, 9000);
    !client.application?.owner ? await client.application?.fetch() : null;
    const commands: any[] = [];

    client.slash_commands.forEach((cmd: any) => {
      if (cmd.data) {
        return commands.push(cmd.data.toJSON());
      } else {
        commands.push({
          name: cmd.name.toLowerCase(),
          description: cmd.description || "None yet",
          options: cmd.options || [],
        });
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
    // Start express server
    //@ts-ignore
    client.expressApp.listen(800, () =>
      client.logger?.log("Enabled webserver")
    );
  },
};
