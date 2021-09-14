const { MessageEmbed, APIMessage } = require("discord.js");
async function createAPIMessage(interaction, content, client) {
  const apiMessage = await APIMessage.create(
    client.channels.resolve(interaction.channel_id),
    content
  )
    .resolveData()
    .resolveFiles();

  return { ...apiMessage.data, files: apiMessage.files };
}

module.exports = {
  name: "blep",
  async execute(interaction, command, args, client) {
    const description = args;
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: "```js\n" + require("util").inspect(args) + "```",
        },
      },
    });
  },
};
