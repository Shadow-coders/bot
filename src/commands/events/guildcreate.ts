import { Guild } from "discord.js";

export default {
  name: "guildCreate", // also guildDelete
  execute(guild: Guild, client: any) {
    const ch = client.channels.cache.get("829754497398997053");

    ch.send({
      content:
        "New guild " +
        guild.name +
        ` and first ch ${guild.channels.cache.first()?.name} and ${
          client.guilds.cache.size
        }`,
    }).then(() => {
      if (
        guild.channels.cache.first()?.type === "GUILD_TEXT" &&
        guild.me?.permissions.has("SEND_MESSAGES")
      ) {
        (guild.channels.cache.first() as any)
          ?.send({ content: "Hellow" })
          .catch(client.error);
      }
    });
  },
  type: "event",
};
