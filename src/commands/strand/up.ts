import { Shadow, Message, CommandInteraction, TextChannel } from "../../client";
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
export default [
  {
    name: "uptime",
    catagory: "basic",
    /**
     *
     * @param {Message} message
     * @param {String[]} args
     * @param {Client} client
     */
    execute(message: Message, args: String[], client: any) {
      let days = Math.floor((client.uptime as number) / 86400000);
      let hours = Math.floor((client.uptime as number) / 3600000) % 24;
      let minutes = Math.floor((client.uptime as number) / 60000) % 60;
      let seconds = Math.floor((client.uptime as number) / 1000) % 60;

      message.channel
        .send(`__Uptime:__\n${days}d ${hours}h ${minutes}m ${seconds}s \n
total time in ms: ${client.uptime}`);
    },
  },
  {
    name: "uptime",
    data: new SlashCommandBuilder()
      .setName("uptime")
      .setDescription("the uptime of the bot"),
    type: "slash",
    async execute(
      interaction: CommandInteraction,
      cmd: String,
      args: any[],
      client: any
    ) {
      let days = Math.floor((client.uptime as number) / 86400000);
      let hours = Math.floor((client.uptime as number) / 3600000) % 24;
      let minutes = Math.floor((client.uptime as number) / 60000) % 60;
      let seconds = Math.floor((client.uptime as number) / 1000) % 60;

      interaction.reply(
        `__Uptime:__\n${days}d ${hours}h ${minutes}m ${seconds}s \nor\n ${require("ms")(
          client.uptime
        )} `
      );
    },
  },
  {
    name: "stat",
    async execute(message: Message, args: String[], client: Shadow) {
      const m = await message.reply({ content: "Fetching stats.." });
      const msg = await (
        client.channels.cache.get("830471074193080381") as TextChannel
      )?.messages.fetch("830471635589005312");
      m.edit({
        content: "Fetched",
        embeds: msg.embeds,
        components: [
          new MessageActionRow().addComponents(
            new MessageButton()
              .setStyle("LINK")
              .setURL(msg.url)
              .setLabel("Message link")
          ),
        ],
      });
    },
  },
];
