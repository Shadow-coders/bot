let policy = () =>
  require("node-fetch")(
    "https://raw.githubusercontent.com/Shadow-coders/bot/main/src/POLICY"
  )
    .then((r: any) => r.text())
    .then((text: String) => text);
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message, Shadow } from "../client";
export default [
  {
    name: "policy",
    async execute(message: Message, args: String[], client: Shadow) {
      message.reply({
        embeds: [
          { title: "Policy", description: await policy(), color: 0x111 },
        ],
      });
    },
  },
  {
    name: "policy",
    description: "The policy of shadow",
    async execute(interaction: CommandInteraction) {
      interaction.reply({
        embeds: [
          { title: "Policy", description: await policy(), color: 0x111 },
        ],
      });
    },
    type: "slash",
  },
];
