module.exports = {
  name: "http",
  execute(message, args, client) {
    const codes = require("http").STATUS_CODES
    if (codes[args[0]]) {
      message.channel.send(`​**${args[0]}**,\n **${codes[args[0]]}**`​);
    } else {
      message.channel.send(" Invalid http status code!");
    }
  },
};