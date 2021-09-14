const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "avatar",
  async execute(interaction, cmd, args, client) {
    let userid;
    if (!args) {
      userid = interaction.member.user.id;
    } else {
      userid = args.find((a) => a.name === "user").value;
    }
    const user = client.users.cache.get(userid) || interaction.member.user;
    const member = client.users.cache.get(interaction.member.user.id);
    const embed = new MessageEmbed()
      .setTitle(user.username + "'s avatar!")
      .setImage(user.displayAvatarURL())
      .setColor("#ff000")
      .setAuthor(member.username, member.displayAvatarURL());

    interaction.send({ embeds: embed });
  },
};
