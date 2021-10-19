import {
  ButtonInteraction,
  Interaction,
  SelectMenuInteraction,
} from "discord.js";
import {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
  Message,
  CommandInteraction,
  Shadow,
} from "../client";
import { Command } from "../util/commands";
const commands = async function (
  client: Shadow,
  message: Message,
  min: Number,
  max: Number
) {
  if (!min) {
    min = 0;
  }
  if (!max) {
    max = 10;
  }
  if (typeof max !== "number" || typeof min !== "number") return "NaN";

  try {
    let prefix = (await client.db.get("prefix_" + message.guild?.id)) || "!!";
    const res = client.commands
      .filter((c: any) => c)
      .map((cmd: Command) => {
        return `\`${prefix + cmd.name}\` ${
          cmd.description || "None"
        } \n Usage: ${cmd.usage ? prefix + cmd.usage : "None"}`;
      })
      .slice(min, max)
      .join("\n");
    return res;
  } catch (err) {
    client.error ? client.error(err, "[HELP_COMMAND_MENU]") : null;
    return "None";
  }
};
export default [
  {
    name: "help",
    async execute(message: Message, args: String[], client: Shadow) {
      const row = new MessageActionRow();
      row.addComponents(
        new MessageButton()
          .setCustomId("next_page")
          .setStyle("PRIMARY")
          .setLabel("Next"),
        new MessageButton()
          .setStyle("PRIMARY")
          .setLabel("Back")
          .setCustomId("back_page_none")
      );
      //@ts-ignore
      row.addComponents(
        new MessageSelectMenu().setCustomId("help_select_catagory").addOptions(
          client.catagory.map((cat) => {
            return {
              label: cat.name,
              emoji: cat.emoji ? cat.emoji : undefined,
              description: `Commands of ${cat.name}`,
            };
          })
        )
      );
    },
  },
];
