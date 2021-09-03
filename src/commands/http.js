module.exports = {
  name: "http",
  execute(message, args, client) {
    const codes = require("../util/http");
    if (codes[args[0]]) {
      message.channel.send(codes[args[0]]);
    } else {
      message.channel.send(" Invalid http status code!");
    }
  },
};
