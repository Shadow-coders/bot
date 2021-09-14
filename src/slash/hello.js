module.exports = {
  name: "hello",
  execute(interaction, command, args, client) {
    interaction.send("hello World");
  },
};
