module.exports = {
  name: "8ball",
  aliases: ["ball", 8, "8balls"],
  description: "the magic 8ball with your question",
  usage: "8ball <q>",
  permissions: ["SEND_MESSAGES"],
  bot_perms: ["SEND_MESSAGES"],
  execute(message, args, client) {
    if (!args[0]) return message.channel.send("Missing args");
    const responses = [
      "indeeed i belive",
      "no",
      "yes",
      "OFC DO " + args[0],
      "OMG NO DOING THAT",
      "NO NEVER DO " + args[0],
      "YES",
      "NO",
      "maybe",
      "tbh idk",
      "im busy",
      "cant think",
      "i cant think of " + args[0],
    ];
    let res = responses[Math.round(Math.random() * responses.length)];
    if (!res) {
      message.channel.send(":x: error");
      client.error({
        message: "error fetchinng 8ball",
        num: Math.round(Math.random() * responses.length),
      });
    }
    message.channel.send(res);
  },
};
