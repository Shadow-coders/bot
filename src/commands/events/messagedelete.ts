import {
  GuildMemberResolvable,
  Shadow,
  GuildMember,
  TextChannel,
  Message,
  User,
} from "../../client";
export default {
  name: "messageDelete",
  type: "event",
  once: false,
  /**
   *
   * @param {Message} message
   * @param {Client} client
   * @returns {Void}
   */
  async execute(message: Message, client: Shadow) {
    // Ignore direct messages
    if (!message.guild) return;
    const fetchedLogs = await message.guild
      .fetchAuditLogs({
        limit: 1,
        type: "MESSAGE_DELETE",
      })
      .catch((e) => {});
    if (!fetchedLogs) return;
    let ch = await client.db.get("mlogs_" + message.guild.id);
    /**
     *
     * @param {Object|String} content
     * @returns {Message}
     */
    const send = (content: any) => {
      if (!ch) return;
      if (typeof ch === "string") ch = client.channels.cache.get(ch);
      ch.send(content);
    };

    let data: any = {
      embeds: [
        new MessageEmbed()
          .setTitle("Message deleted")
          .addField("Channel", message.channel.toString(), true)
          .addField("Author", message.author.toString(), true)
          .setColor("RED"),
      ],
      files: [],
    };
    if (message.content) {
      data.embeds[0].addField("Content", message.content, true);
    }
    if (message.attachments.size > 0) {
      data.embeds[0].addField(
        "Attachments",
        `[attachments/${message.attachments.size}]`,
        true
      );
      // Log.addField('Attachments', `[attachments/${message.attachments.size}]`, true)
      data.files = message.attachments.toJSON();
    }
    if (message.embeds.length > 0) {
      data.embeds[0].addField(
        "Embeds",
        `[embeds/${message.embeds.length}]`,
        true
      );
      message.embeds.forEach((dat) => data.embeds.push(dat));
    }
    // Since there's only 1 audit log entry in this collection, grab the first one
    const deletionLog = fetchedLogs.entries.first();

    // Perform a coherence check to make sure that there's *something*
    if (!deletionLog) return send(data);

    // Now grab the user object of the person who deleted the message
    // Also grab the target of this action to double-check things
    const { executor, target } = deletionLog;

    // Update the output with a bit more information
    // Also run a check to make sure that the log returned was for the same author's message
    if ((target as User).id === message.author.id) {
      data.embeds[0].addField("Deleted by", executor?.toString(), true);
      send(data);
    } else {
      send(data);
    }
  },
};
