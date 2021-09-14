const {
  Client,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

module.exports = {
  name: "nuke",
  aliases: ["bomb"],
  categories: "moderation",
  UserPerms: ["ADMINISTRATOR"],
  description: "Nuke channel your channel",
  cooldown: 5,
  usage: "",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  execute: async (message, args, client) => {
    if (!message.member.permissions.has("MANAGE_CHANNELS"))
      return message.reply({
        content: "Missing perms",
        allowedMentions: { repliedUser: true },
      });
    let nukeButton = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("YES")
        .setStyle("SUCCESS")
        .setLabel("Yes"),

      new MessageButton().setCustomId("NO").setStyle("DANGER").setLabel("No")
    );

    message.reply({
      content: "**Are you sure nuke this channel?** sure click this buttons!",
      components: [nukeButton],
    });
    const filter = (interaction) => {
      if (interaction.user.id === message.author.id) return true;
      return interaction.reply({
        content: "Only owner this buttons to use this button",
        ephemeral: true,
      });
    };

    const collector = message.channel.createMessageComponentCollector({
      filter,
      max: 1,
    });

    collector.on("collect", (buttonInteraction) => {
      const id = buttonInteraction.customId;

      if (id === "YES") {
        message.channel.clone().then((ch) => {
          let reason = args.join(" ") || "No Reason";
          let embed = new MessageEmbed()
            .setTitle("**Channel Succesfuly Nuked**")
            .setColor("RANDOM")
            .setDescription(reason)
            .setImage("https://media0.giphy.com/media/oe33xf3B50fsc/200.gif");
          ch.setParent(message.channel.parent);
          ch.setPosition(message.channel.position);
          message.channel.delete().then(() => {
            ch.send({ embeds: [embed] }).then((msg) => {
              setTimeout(() => msg.delete(), 5e4);
            });
          });
        });
      }
      if (id === "NO") {
        buttonInteraction.reply({ ephemeral: true, content: "Aborted" });
        return message.channel.bulkDelete("1", true).then(message.react("👍"));
      }
    });
  },
};
