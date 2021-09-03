module.exports = {
  name: "rr-add",
  permissions: ["MANAGE_GUILD"],
  execute(message, args, client) {
    if (!args) return message.channel.send(" missing args");
    if (!message.guild.roles.cache.find((r) => r.id === args[2]))
      return message.channel.send(" invalid error ");
    if (
      !message.guild.channels.cache.find((ch) => ch.messages.cache.get(args[0]))
    )
      return message.channel.send("no message");
    client.db.set("rr_" + args[0], {
      role_id: args[2],
      emoji: args[1],
    });
    message.guild.channels.cache
      .find((ch) => ch.messages.cache.get(args[0]))
      .react(args[1]);
  },
};
