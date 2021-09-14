module.exports = {
  name: "shutdown",
  execute(message, args, client) {
    if (!client.devs.some((d) => d === message.author.id)) return;
    message.channel
      .send("do you want to shutdown me?\n respond with yes or no")
      .then(() => {
        message.channel
          .awaitMessages(
            (m) => m.author.id === message.author.id && m.content === "yes",
            { max: 1, time: 30000, errors: ["time"] }
          )
          .then((collected) => {
            message.channel.send("down");
            client.shutdown("e");
          })
          .catch((collected) => {
            message.channel.send("aborted");
          });
      });
  },
};
