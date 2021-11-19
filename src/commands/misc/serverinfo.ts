import {
  Message,
  CommandInteraction,
  Shadow,
  MessageEmbed,
} from "../../client";
import { Command } from "../../util/commands";
const ops = {
  name: "serverinfo",
  description: "Get info on the server!",
  aliases: [],
};
export default [
  {
    name: ops.name,
    descripton: ops.description,
    aliases: ops.aliases,
    type: "command",
    async execute(message: Message, args: String[], client: Shadow) {
      const guild = message.guild;
      let desc = "";
      const embed = new MessageEmbed();
      embed.setTitle("Guild Info");
      embed.addField("Name", guild?.name as string, true);
      embed.addField(
        "Created at",
        `<t:${Math.floor((guild?.createdTimestamp as number) / 1000)}:R>`
      );
      desc +=
        "\n**Roles:** \n" +
        guild?.roles.cache.map((r) => "<@&" + r.id + ">").join(", ");

      embed.setDescription(desc);
      if (guild?.icon) embed.setThumbnail(guild?.iconURL() as any);
      message.reply({ embeds: [embed] });
    },
  },

  {
    name: ops.name,
    description: ops.description,
    aliases: ops.aliases,
    type: "slash",
    async execute(
      interaction: CommandInteraction,
      cmd: string,
      args: any[],
      client: Shadow
    ) {},
  },
] as Array<Command>;
