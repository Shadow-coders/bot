const { Snake } = require("discord-gamecord");
const Discord = require("discord.js");
export default {
  name: "snake",
  permissions: [],
  description: "Play a Game of snake when you have no friends.",
  async execute(message, args, client) {
    new Snake({
      message: message,
      embed: {
        title: "Snake",
        color: "#fffff",
        OverTitle: "You Lost",
      },
      snake: {
        head: "🐍",
        body: "🟩",
        tail: "🟢",
      },
      emojis: {
        board: "⬛",
        food: "🍎",
        up: "⬆️",
        right: "➡️",
        down: "⬇️",
        left: "⬅️",
      },
      othersMessage: "You may not use these Buttons.",
    }).startGame();
  },
};
