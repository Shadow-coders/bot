import { Shadow, Message } from "../../client";
const { Connect4 } = require("discord-gamecord");
const Discord = require("discord.js");
export default {
  name: "connect4",
  permissions: [],
  description: "Play a Game of Connect 4 with someone.",
  async execute(message: Message, args: String[], client: Shadow) {
    let errorMention = new Discord.MessageEmbed()
      .setTitle("Eroare...")
      .setDescription("You must mention a user.")
      .setColor("RED");
    let errorUser = new Discord.MessageEmbed()
      .setTitle("Eroare...")
      .setDescription("You cannot play with Yourself.")
      .setColor("RED");
    let errorBot = new Discord.MessageEmbed()
      .setTitle("Eroare...")
      .setDescription("Your opponent may not be a bot.")
      .setColor("RED");

    if (!message.mentions.users.first())
      return message.reply({
        embeds: [errorMention],
      });
    if (message.mentions.users.first()?.id === message.author.id)
      return message.reply({
        embeds: [errorUser],
      });
    if (message.mentions.users.first()?.bot === true)
      return message.reply({
        embeds: [errorBot],
      });
    if (!message.mentions.users.first())
      return message.reply({
        embeds: [errorMention],
      });
    if (message.mentions.users.first()?.id === message.author.id)
      return message.reply({
        embeds: [errorUser],
      });
    if (message.mentions.users.first()?.bot === true)
      return message.reply({
        embeds: [errorBot],
      });
    let game = new Connect4({
      message: message,
      opponent: message.mentions.users.first(),
      embed: {
        title: "Connect 4",
        color: "#fffff",
      },
      emojis: {
        player1: "🔵",
        player2: "🟡",
      },
      othersMessage: "You may not use these Buttons.",
      turnMessage: "{emoji} | It's **{player}'s** turn now.",
      winMessage: "{emoji} | **{winner}** won!",
      gameEndMessage: "Nobody Won.",
      drawMessage: "It's a Tie!",
      askMessage:
        "{opponent}, {challenger} wants to beat you at a game of Connect 4.\n\n`You have 60 seconds to Accept`",
      cancelMessage: "The opponent did not Accept.",
      timeEndMessage: "The opponent did not Respond.",
    });
    try {
      game.startGame();
    } catch (err) {
      return message.reply({
        embeds: [errorMention],
      });
    }
  },
};
