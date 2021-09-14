let { Client, Message, MessageEmbed } = require("discord.js");
module.exports = {
  name: "messageDelete",
  type: "event",
  once: false,
  /**
   *
   * @param {Message} message
   * @param {Client} client
   * @returns {Void}
   */
  async execute(message, client) {
    // Ignore direct messages
    if (!message.guild) return;
    const fetchedLogs = await message.guild.fetchAuditLogs({
      limit: 1,
      type: "MESSAGE_DELETE",
    }).catch(e => null)
    let ch = await client.db.get("mlogs_" + message.guild.id);
    /**
     *
     * @param {Object|String} content
     * @returns {Message}
     */
    const send = (content) => {
     if(!ch) return;
     if(typeof ch === 'string') ch = client.channels.cache.get(ch)
     ch?.send(content)
    };
    // Since there's only 1 audit log entry in this collection, grab the first one
    const deletionLog = fetchedLogs?.entries?.first();

    // Perform a coherence check to make sure that there's *something*
    if (!deletionLog)
      return send(
        `A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`
      );

    // Now grab the user object of the person who deleted the message
    // Also grab the target of this action to double-check things
    const { executor, target } = deletionLog;

    // Update the output with a bit more information
    // Also run a check to make sure that the log returned was for the same author's message
    if (target.id === message.author.id) {
      send(
        `A message by ${message.author.tag} was deleted by ${executor.tag}.`
      );
    } else {
      send(
        `A message by ${message.author.tag} was deleted, but we don't know by who.`
      );
    }
  },
};
