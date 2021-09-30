const {
  MessageEmbed,
  Message,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const MessageConstructor = require("../util/message");
module.exports = {
  name: "balance",
  aliases: ["bal", "bl"],
  permissions: [],
  description: "Check the user balance",
  /**
   *
   * @param {Message} message
   * @param {String[]} args
   * @param {Client} client
   */
 async execute(message, args, client) {
   const user = message.mentions.users.first() || message.author
    let profileData = user.casino;
    let ArrayContent = {
      embeds: [
        new MessageEmbed()
          .setColor("GOLD")
          .setDescription(
            `\`${profileData.coins}\` coins \n \`${profileData.bank}\`: Bank coins`
          )
          .setAuthor(user.tag, user.displayAvatarURL()),
      ],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle("PRIMARY")
            .setLabel("Refrash")
            .setCustomId("refreash_casino")
        ),
      ],
    };
    const msg = await message.channel.send(ArrayContent);
    const collector = message.createMessageComponentCollector({
      filter: (i) =>
        i.customId === "refreash_casino" && i.message.id === msg.id,
      time: 60 * 1000,
    });
    collector.on("collect", (i) => {
      ArrayContent.embeds[0].setDescription(
        `\`${profileData.coins}\` coins \n \`${profileData.bank}\`: Bank coins`
      );
      msg.edit(ArrayContent);
    });
    collector.on("end", (collected) => {
      ArrayContent.components[0].components[0].setStyle("SECONDERY");
      ArrayContent.components.components[0].disabled = true;
      msg.edit(ArrayContent);
    });
  },
};
