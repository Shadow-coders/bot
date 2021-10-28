import ms from "ms";
import { CommandInteraction, Message } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Shadow } from "../client";
export default [
  {
    name: "ping",
    description: "Ping!",
    cooldown: 4,
    catagory: "basic",
    async execute(message: Message, args: String[], client: Shadow) {
      let m = await message.channel.send("pinging...");
      const ping =
        client.ws.ping +
        (Date.now() - message.createdTimestamp) +
        (Date.now() - m.createdTimestamp) +
        client.db.ping;
      //     console.log(m.createdTimestamp)
      m.edit(
        "> Pong " +
          client.ws.ping +
          `(\`${ms(client.ws.ping)}\`) \n > latency: ` +
          `${Date.now() - message.createdTimestamp} (\`${ms(
            Date.now() - message.createdTimestamp
          )}\`)\n > edit latency: ${Date.now() - m.createdTimestamp} (\`${ms(
            Date.now() - m.createdTimestamp
          )}\`) \n > DB latency ${client.db.ping} (\`${ms(
            client.db.ping
          )}\`) \n > overall ping: \`${ping}\` (\`${ms(ping)}\`)`
      );
    },
  },
  {
    name: "ping",
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {*} cmd
     * @param {*} args
     * @param {*} client
     */
    async execute(
      interaction: CommandInteraction,
      cmd: String,
      args: any[],
      client: Shadow
    ) {
      const date = Date.now();
      let m: any = await interaction.reply({
        content: "pinging...",
        fetchReply: true,
      });
      m = await interaction.channel?.messages.fetch(m.id);
      const ping =
        client.ws.ping +
        (Date.now() - m.createdTimestamp) +
        client.db.ping +
        Date.now() -
        date;
      m.edit(
        "> Pong " +
          client.ws.ping +
          `(\`${ms(client.ws.ping)}\`) \n > latency: ` +
          `${Date.now() - date} (\`${ms(
            Date.now() - date
          )}\`)\n > edit latency: ${Date.now() - m.createdTimestamp} (\`${ms(
            m.createdTimestamp - Date.now()
          )}\`) \n > DB latency ${client.db.ping} (\`${ms(
            client.db.ping
          )}\`) \n > overall ping: \`${ping}\` (\`${ms(ping)}\`)`
      );
    },
    type: "slash",
    data: new SlashCommandBuilder()
      .setName("ping")
      .setDescription("The latency of the bot"),
  },
];
