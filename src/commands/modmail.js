module.exports = {
  name: "messageCreate",
  type: "event",
  once: false,
  async execute(message, client) {
    if (message.channel.partial) await message.channel.fetch();
    try {
      if (message.channel.type === "DM") {
        require("../m/modmail.js")(message, client);
      }
    } catch (e) {
      client.error(e);
      if (message.channel.type == "DM") message.channel.send(e.message);
    }
  },
};
