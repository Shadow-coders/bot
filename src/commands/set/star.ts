export default [
  {
    name: "starboard",
    description: "Change or update starboard",
    async execute(message, args, client) {
      if (!args) return message.channel.send("Missing args");
      message.send = message.channel.send;
      const command = args[0];
      if (!command)
        return message.channel.send(
          "No method supplied, valid options are:  `" +
            ["set", "remove", "get"].join("``") +
            "`"
        );
      if (command !== "set" && command !== "get" && command !== "get")
        return message.channel.send("Invalid Method");
      if (!args[1])
        return message.channel.send(
          `No option supplied, valid options are: ${
            "`" + ["channel", "emoji", "limit"].join("``") + "`"
          }`
        );
      let option = args[1];
      if (args[1] !== "set" && args[1] !== "remove" && args[1] !== "get")
        return message.channel.send("Invalid option");
      if (command === "set" && !args[2])
        return message.channel.send(
          "No value suplied for the " + args[1].toLowerCase()
        );
      if (command === "set") {
        if (option === "channel") {
          let channel;
          if (option.split("<")[1].slice(1).split(">")[0])
            channel = option.split("<")[1].slice(1).split(">")[0];
          else channel = option;
          channel = message.guild.channels.cache.get(option);
          if (!channel)
            return message.channel.send("Invalid channel id " + option);
          await client.db
            .set("starchannel_" + message.guild.id, channel.id)
            .then((d) => message.channel.send(`Set star channel to <#${d}>`));
          return;
        } else if (option === "limit") {
          let numb = parseInit(args[2]);
        }
      }
    },
  },
];
