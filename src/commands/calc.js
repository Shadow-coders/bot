module.exports = [
  {
    name: "calc",
    description: "get a calculater!",
    usage: "calc",
    execute(message, args, client) {
      const simplydjs = require("simply-djs");

      // messageCreate event
      // calculator command
      simplydjs.calculator(message, {
        embedColor: "#FF0000",
      });
    },
  },
  {
    name: "calculator",
    async execute(interaction, cmd, args, client) {
      const simplydjs = require("simply-djs");

      // messageCreate event
      // calculator command
      simplydjs.calculator(interaction, {
        embedColor: "#FF0000",
        slash: true,
      });
    },
  },
];
