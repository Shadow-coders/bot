export default [
  {
    name: "sticky-add",
    async execute(message, args, client) {
      if (!message.member.permissions.has("MANAGE_GUILD"))
        return message.channel.send("missing perms");
      if (!args[0]) message.channel.send("I need a channel id");
      let findChannel = message.mentions.crosspostedChannels
        ? message.crosspostedChannels.first().id
        : args[0];
      if (args[0] === "null") {
        findChannel = message.channel.id;
      }
      const ch =
        client.channels.cache.get(findChannel) ||
        client.channels.cache.get(args[0]);
      if (!ch) return message.channel.send("Invalid channel ID or mention ");
      if (!args[1])
        return message.channel.send("I need a message to make sticky");
      const msg = args.slice(1).join(" ");
      await client.db.set("stickymessage_" + ch.id, msg);
      let exits = await client.db.get("stickychannels_" + message.guild.id);
      if (!exits) {
        client.db.set("stickychannels_" + message.guild.id, []);
        exits = await client.db.get("stickychannels_" + message.guild.id);
      }
      exits.push(ch.id);
      client.db._save();
      message.channel.send("done!");
    },
  },
];
