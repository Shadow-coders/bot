let policy = () => require("node-fetch")("https://raw.githubusercontent.com/Shadow-coders/bot/main/src/POLICY")
    .then((r) => r.text())
    .then((text) => text)
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = [
  {
    name: "policy",
    async execute(message, args, client) {
      message.reply({ embeds: [{ title: "Policy", description: await policy(), color: 0x111 }] });
    },
  },
  {
    name: "policy",
    description: "The policy of shadow",
    async execute(interaction) {
      interaction.reply({ embeds: [{ title: "Policy", description: await policy(), color: 0x111 }] });
    },
    type: "slash",
  },
];
