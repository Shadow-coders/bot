const { Client, GuildMember } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  type: "event",
  /**
   *
   * @param {GuildMember} member
   * @param {Client} client
   */
  async execute(member, client) {
    const GuildRoles = await client.db.get("autoroles_" + member.guild.id);
    if (!Array.isArray(GuildRoles)) return;
    if (!member.guild.me.permissions.has("MANAGE_ROLES")) return;
    GuildRoles.forEach(async (r, i) => {
      const role = await member.guild.roles.fetch(r);
      member.roles.add(role, { reason: "Autorole" });
    });
  },
};
