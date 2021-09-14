module.exports = [
  {
    name: "channeljoin",
    once: false,
    type: "event",
    async execute(voice, client) {
      if (!voice) return;
      let { channel, member, guild, user } = voice;
      if (!user) user = member.user;
      if (channel.id === "873272852323926016") {
        let ch = await guild.channels.create(
          member.user.tag || "NEON FIX YOU CODE",
          {
            parent: channel.parent.id,
            reason: `PRIVATE VC FOR: ${user.id} (${user.username})`,
            permissionOverwrites: [
              {
                id: member.user.id,
                allow: ["CONNECT", "VIEW_CHANNEL"],
              },
              { id: guild.id, deny: ["CONNECT"] },
            ],
            type: "GUILD_VOICE",
          }
        );
        client.db.set("vc_" + member.user.id, ch.id);
        client.db.set("owner_" + ch.id, member.user.id);
        member.voice.setChannel(ch.id);
      }
    },
  },
  {
    name: "channelleave",
    type: "event",
    async execute(voice, client) {
      if (!(await client.db.get("owner_" + voice.channel.id))) return;
      if (
        !voice.channel.members.get(
          await client.db.get("owner_" + voice.channel.id)
        )
      ) {
        client.db.delete(
          "vc_" + (await client.db.get("owner_" + voice.channel.id))
        );
        client.db.delete("owner_" + voice.channel.id);
        voice.channel.delete();
      }
    },
  },
];
