import {
  GuildMemberResolvable,
  Shadow,
  GuildMember,
  TextChannel,
} from "../../client";
export default {
  name: "guildMemberAdd",
  type: "event",
  /**
   *
   * @param {GuildMember} member
   * @param {Client} client
   */
  async execute(member: GuildMember, client: Shadow) {
    const GuildRoles = await client.db.get("autoroles_" + member.guild.id);
    if (!Array.isArray(GuildRoles)) return;
    if (!member.guild.me?.permissions.has("MANAGE_ROLES")) return;
    GuildRoles.forEach(async (r, i) => {
      const role: any = await member.guild.roles.fetch(r);
      member.roles.add(role, "Autorole");
    });
  },
};
