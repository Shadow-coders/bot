const { MessageEmbed } = require("discord.js");
function gwarns(client, message, user) {
  return client.db
    .get("cases_" + user.id)
    .map(
      (u) =>
        ` ID: ${u.id} \ mod: ${u.author.username} \n Reason ${u.description}`
    )
    .join("\n");
}
module.exports = {
  name: "cases",
  async execute(message, args, client) {
    let user = client.users.cache.get(args[0]);
    if (!user) {
      user = message.author;
    }
    const m = await message.channel.send("Fetching cases....");
    const warns = client.db.get("cases_" + user.id);
    if (!warns) return m.edit(user.username + " has No cases!");
    const embed = new MessageEmbed()
      .setTitle("Cases")
      .setDescription(gwarns(client, message, user))
      .setColor("#ff0000")
      .setFooter(`${user.username}'s Cases`);
    setTimeout(() => {
      m.edit(embed);
    }, 2500);
  },
};
