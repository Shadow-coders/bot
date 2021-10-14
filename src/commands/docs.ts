const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction } = require("discord.js");

export default [
  {
    name: "docs",
    type: "slash",
    data: new SlashCommandBuilder()
          .setName("djsdocs")
          .setDescription("Info from the docs")
          .addStringOption((op:any) => {
            return op
              .setName("query")
              .setDescription("The query to search")
              .setRequired(true);
          })
          .addUserOption((op:any) => {
            return op.setName("target").setDescription("The user to refence");
          }),
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {String} cmd
     * @param {String[]} args
     * @param {Client} client
     * @returns
     */
    async execute(interaction, cmd, args, client) {
      const query = interaction.options.get("query").value;
      // if(!query) return message.reply("Please specify something to search for!")
      require("node-fetch")(
        `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(
          query
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          interaction.reply({
            content: interaction.options.get("target")
              ? `*  Refrence for <@${
                  interaction.options.get("target").user.id
                }> * `
              : undefined,
            embeds: [data],
          });
        })
        .catch((err) => {
          client.error(err);
          interaction.reply("**Invalid request**");
        });
    },
  },
];
