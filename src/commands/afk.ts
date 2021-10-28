import { SlashCommandBuilder } from "@discordjs/builders";
let s = [
  {
    name: "afk",
    permissions: [],
    // type: "command",
    catagory: "basic",
    description: "Set your Status to AFK.",
    async execute(message: any, args: any, client: any) {
      if (
        await client.db.get("afk_" + message.author.id + "_" + message.guild.id)
      )
        return;
      let reason = args.join(" ") || null;
      let oldName = message.member.nickname || message.author.username;

      await client.db.set(`afk_${message.author.id}_${message.guild.id}`, {
        reason,
        name: oldName,
      });

      if (
        message.guild.me.permissions.has("MANAGE_NICKNAMES") &&
        message.author.id !== message.guild.ownerId
      )
        message.member.setNickname("[AFK] " + oldName);
      return message.reply(
        `${message.author.username}, your Status was Set to "AFK". ${
          reason === null ? "" : "\nYour Reasoning is: " + reason
        }`
      );
    },
  },
];
s.push({
  name: "afk",
  type: "slash",
  data: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Go afk or something")
    .addStringOption((s: any) =>
      s.setName("reason").setDescription("Why you wana go afk")
    ),
  //@ts-ignore idgaf
  async execute(interaction: any, cmd: any, args: any, client: any) {
    interaction.author = interaction.member.user;
    s[0].execute(
      interaction,
      [
        interaction.options.get("reason")
          ? interaction.options.get("reason").value
          : "",
      ],
      client
    );

    // interaction.reply("test");
  },
});

export default s;
