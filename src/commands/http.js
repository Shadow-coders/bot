module.exports = {
  name: "http",
  execute(message, args, client) {
    const codes = require("http").STATUS_CODES
    const numb = args[0]
    if (codes[numb]) {

      message.channel.send((`**${numb}**, 
      \n **${codes[numb]}**`​));
    } else {
      message.channel.send(" Invalid http status code!");
    }
  },
};