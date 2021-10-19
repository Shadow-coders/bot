import { Shadow, Message } from "../../client";
export default {
  name: "messageUpdate",
  once: false,
  type: "event",
  async execute(oldMessage: Message, newMessage: Message, client: Shadow) {
    if (newMessage.author.bot) return;
    try {
      if (!(await client.db.get("mlogs_" + oldMessage.guild?.id))) return;
      const sukdik = new MessageEmbed()
        .setAuthor(
          "Message Edited",
          newMessage.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(
          `**User:** <@${newMessage.author.id}> - ${newMessage.author.id}\n**Channel:** <#${newMessage.channel.id}> - [Jump to Messages](https://discordapp.com/channels/${newMessage.guild?.id}/${newMessage.channel.id}/${oldMessage.id})`
        )
        .addField("Before:", `${oldMessage.content}`, true)
        .addField("After:", `${newMessage.content}`, true)
        .setFooter(`Message ID: ${oldMessage.id}`)
        .setTimestamp()
        .setColor("#f5f50a");

      return (
        oldMessage.guild?.channels.cache.get(
          await client.db.get("mlogs_" + oldMessage.guild?.id)
        ) as any
      ).send({ embeds: [sukdik] });
    } catch (error) {
      client.error ? client.error(error) : null;
    }
  },
};
