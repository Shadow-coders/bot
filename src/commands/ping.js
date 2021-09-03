const ms = require("ms");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = [
  {
    name: "ping",
    description: "Ping!",
    cooldown: 4,
    async execute(message, args, client) {
      let m = await message.channel.send("pinging...");
      const ping =
        client.ws.ping +
        Date.now() -
        message.createdTimestamp +
        Date.now() -
        m.createdTimestamp +
        client.db.ping / 10;
      m.edit(
        "> Pong " +
          client.ws.ping +
          `(\`${ms(client.ws.ping)}\`) \n > latency: ` +
          `${Date.now() - message.createdTimestamp} (\`${ms(
            Date.now() - message.createdTimestamp
          )}\`)\n > edit latency: ${Date.now() - m.createdTimestamp} (\`${ms(
            Date.now() - m.createdTimestamp
          )}\`) \n > DB latency ${client.db.ping / 10} (\`${ms(
            client.db.ping / 10
          )}\`) \n > overall ping: \`${ping}\` (\`${ms(ping)}\`)`
      );
    },
  },
  {
    name: "ping",
    async execute(interaction, cmd, args, client) {
      const date = Date.now();
      let m = await interaction.reply("pinging...", { fetchReply: true });
      console.log(m.id);
      const ping =
        client.ws.ping +
        Date.now() -
        date +
        Date.now() -
        m.createdTimestamp +
        client.db.ping;
      interaction.editReply(
        "> Pong " +
          client.ws.ping +
          `(\`${ms(client.ws.ping)}\`) \n > latency: ` +
          `${Date.now() - date} (\`${ms(
            Date.now() - date
          )}\`)\n > edit latency: ${Date.now() - m.createdTimestamp} (\`${ms(
            Date.now() - m.createdTimestamp
          )}\`) \n > DB latency ${client.db.ping} (\`${ms(
            client.db.ping
          )}\`) \n > overall ping: \`${ping}\` (\`${ms(ping)}\`)`
      );
    },
    type: "slash",
    data: new SlashCommandBuilder()
      .setName("stat")
      .setDescription("The stats of the bot section")
      .addSubcommand((sub) =>
        sub.setName("ping").setDescription("The latency of the bot")
      ),
  },
];
