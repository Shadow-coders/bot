module.exports = {
  name: "calc",
  description: "get a calculater!",
  usage: "calc",
  execute(message, client, args) {
    const { Calculator } = require("weky");
    Calculator(message).then(console.log).catch(client.error);
  },
};
