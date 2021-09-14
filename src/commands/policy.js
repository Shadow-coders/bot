let policy = Promise.all([require('node-fetch')('').then(r => r.text()).then(text => text)])
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = [
  {
    name: "policy",
    async execute(message, args, client) {
      message.reply({ embeds: [{ title: "Policy", description: policy }] });
    },
  },
  {
    name: "policy",
    description: "The policy of shadow",
    async execute(interaction) {
      interaction.reply({ embeds: [{ title: "Policy", description: policy }] });
    },
    type: "slash",
  },
];
