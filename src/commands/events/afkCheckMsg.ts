import { Message, Shadow, MessageEmbed } from "../../client";
export default {
  name: "message",
  once: false,
  type: "event",
  /**
   *
   * @param {Message} message
   * @param {Client} client
   * @returns
   */
  async execute(message: Message, client: Shadow) {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (await client.db.get(`afk_${message.author.id}_${message.guild.id}`)) {
      try {
        let data = await client.db.get(
          "afk_" + message.author.id + "_" + message.guild.id
        );
        const sukdik = new MessageEmbed()
          .setAuthor(
            "Is Not AFK Anymore",
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setDescription(
            `User <@${
              message.author.id
            }> just came Back from Being AFK.\n you had ${
              data.pings ? data.pings : 0
            } ping(s) \n and here are the link to the messages  \n ${
              data.ping_links ? data.ping_links : ""
            }`
          )
          .setColor("#f5f50a");
        //   let data = await client.db.get("afk_" + message.author.id);
        message.member?.setNickname(data.name);
        message.channel.send({ embeds: [sukdik] }).then((msg) => {
          setTimeout(() => {
            msg.delete();
          }, 50000);
        }); // I like that embed name very lot mao
        await client.db.delete(
          "afk_" + message.author.id + "_" + message.guild.id
        );
      } catch (error) {
        client.error ? client.error(error) : null;
      }
    } else {
      let user = await client.db.get(
        "afk_" + message.mentions?.users.first()?.id + "_" + message.guild.id
      );
      if (user) {
        let userData = await client.db.get(
          "afk_" + message.mentions?.users?.first()?.id + "_" + message.guild.id
        );
        user = message.mentions.users.first();
        if (!userData.pings) userData.pings = 0;
        if (!userData.ping_links) userData.ping_links = "";
        userData.pings++;
        userData.ping_links += "\n" + `[${message.author.tag}](${message.url})`;
        message
          .reply({
            embeds: [
              new MessageEmbed()
                .setTitle("Afk")
                .setAuthor(
                  message.author.tag,
                  message.author.displayAvatarURL({ dynamic: true })
                )
                .setDescription(
                  `<@${user.id}> is afk, \n ${
                    userData.reason ? userData.reason : ""
                  }`
                )
                .setTimestamp()
                .setFooter("Please leave them alone")
                .setColor("#f5f50a"),
            ],
          })
          .then((m) => {
            setTimeout(m.delete, 3000);
            client.db.set("afk_" + user.id + "_" + message.guild?.id, userData);
          });
      }
    }
  },
};
