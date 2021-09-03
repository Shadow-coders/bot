module.exports = {
  name: "balance",
  aliases: ["bal", "bl"],
  permissions: [],
  description: "Check the user balance",
  execute(message, args, client) {
    let profileData = message.author.casino;
    message.channel.send(
      `Your wallet bal is ${profileData.coins}, you banks bal is ${profileData.bank}`
    );
  },
};
