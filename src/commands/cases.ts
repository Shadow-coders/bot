import { Message, Shadow, MessageEmbed } from "../client";
function gwarns(client: Shadow, message: Message, user: any) {
  return client.db
    .get("cases_" + user.id)
    .map(
      (u: any) =>
        ` ID: ${u.id} \ mod: ${u.author.username} \n Reason ${u.description}`
    )
    .join("\n");
}
export default {
  name: "cases",
  async execute(message: Message, args: String[], client: Shadow) {
    //@ts-ignore
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
      m.edit({ embeds: [embed] });
    }, 2500);
  },
};
