export default {
  name: "messageCreate",
  type: "event",
  once: false,
  async execute(message: any, client: any) {
    if (message.channel.partial) await message.channel.fetch();
    try {
      if (message.channel.type === "DM") {
        require("../m/modmail.js").default(message, client);
      }
    } catch (e: any) {
      client.error(e);
      if (message.channel.type == "DM") message.channel.send(e.message);
    }
  },
};
