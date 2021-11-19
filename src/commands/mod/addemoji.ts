import {
  CommandInteraction,
  Client,
  MessageEmbed,
  Util,
  Shadow,
} from "../../client";

export default {
  name: "stealemoji",
  description: "Steal an emoji from another server",
  type: "slash",
  options: [
    {
      name: "emoji",
      type: "STRING",
      description: "The emoji you want to steal",
      require: true,
    },
  ], // you dont have to include these in some commands
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  execute: async (
    interaction: CommandInteraction,
    cmd: String,
    args: any[],
    client: Shadow
  ) => {
    //@ts-ignore
    if (!interaction.member?.permissions.has("MANAGE_EMOJIS_AND_STICKERS"))
      return interaction.reply({
        content: `You are not a staff member!`,
        ephemeral: true,
      });
    if (!args.length)
      return interaction.reply({
        content: `Please supply some emojis`,
        ephemeral: true,
      });
    if (args.length > 10)
      return interaction.reply({
        content: `Can only added 10 emojis at each time!`,
        ephemeral: true,
      });
    for (const rawEmojis of args) {
      const parsedEmoji = Util.parseEmoji(rawEmojis);
      if (parsedEmoji?.id) {
        const exe = parsedEmoji.animated ? ".gif" : ".png";
        const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + exe}`;
        interaction.guild?.emojis.create(url, parsedEmoji.name).then((e) => {
          interaction.reply({
            content: `Added ${e} - \`${e.url}\``,
            ephemeral: true,
          });
        });
      }
    }
  },
};
// e
