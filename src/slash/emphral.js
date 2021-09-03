module.exports = {
  name: "say",
  execute(interaction, command, args, client) {
    const code = args.find((arg) => arg.name.toLowerCase() == "message").value;
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: code,
          flags: 64,
        },
      },
    });
  },
};
