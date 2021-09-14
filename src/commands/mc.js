const ping = require("minecraft-server-util");
const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "mc",
  description: "Get a servers stats",
  usage: "mc <ip of server> <port>",
  async execute(message, args, client) {
    if (!args[0])
      return message.channel.send("You must type a minecraft server ip");
    if (!args[1]) {
      args = [args[0], "25565"];
    }
    const m = await message.channel.send("Finding `" + args.join(":") + "`");
    ping.status(args[0], { port: parseInt(args[1]) }, (error, reponse) => {
      if (error) return;
      client.error(error);
      const Embed = new MessageEmbed()
        .setTitle("Server Status")
        .addField("Server IP", reponse.host)
        .addField("Server Version", reponse.version)
        .addField("Online Players", reponse.onlinePlayers)
        .addField("Max Players", reponse.maxPlayers);

      message.edit({ embeds: [Embed] });
    });
  },
};
