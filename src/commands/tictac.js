const { TicTacToe } = require('discord-gamecord');
const Discord = require("discord.js")
module.exports = {
    name: "tictactoe",
    aliases: ["ttt"],
    permissions: [],
    description: "Play a Game of Tic Tac Toe.",
    async execute(message, args, client) {
      let errorMention = new Discord.MessageEmbed().setTitle("Eroare...").setDescription("You must mention a user.").setColor("RED");
      let errorUser = new Discord.MessageEmbed().setTitle("Eroare...").setDescription("You cannot play with Yourself.").setColor("RED");
      let errorBot = new Discord.MessageEmbed().setTitle("Eroare...").setDescription("Your opponent may not be a bot.").setColor("RED");

      if (!message.mentions.users.first()) return message.reply({
            embeds: [errorMention]
        }, {
            message_reference: message.id
        });
        if (message.mentions.users.first().id === message.author.id) return message.reply({
            embeds: [errorUser]
        }, {
            messageReference: message.id
        });
        if (message.mentions.users.first().bot === true) return message.reply({
            embeds: [errorBot]
        }, {
            messageReference: message.id
        });
        if (!message.mentions.users.first()) return message.reply({
            embeds: [errorMention]
        }, {
            message_reference: message.id
        });
        if (message.mentions.users.first().id === message.author.id) return message.reply({
            embeds: [errorUser]
        }, {
            messageReference: message.id
        });
        if (message.mentions.users.first().bot === true) return message.reply({
            embeds: [errorBot]
        }, {
            messageReference: message.id
        });
        let game = new TicTacToe({
            message: message,
            opponent: message.mentions.users.first(),
            embed: {
                title: 'Tic Tac Toe',
                color: '#ddcfd4',
            },
            oEmoji: '🔵',
            xEmoji: '❌',
            oColor: 'PRIMARY',
            xColor: 'DANGER',
            othersMessage: 'You may not use these Buttons.',
            turnMessage: '{emoji} | It\'s **{player}\'s** turn now.',
            waitMessage: 'You must wait for your opponent to Pick.',
            askMessage: '{opponent}, {challenger} wants to beat you at a game of Tic Tac Toe.\n\n`You have 60 seconds to Accept`',
            cancelMessage: 'The opponent did not accept.',
            timeEndMessage: 'The opponent did not respond.',
            drawMessage: 'It\'s a Tie!',
            winMessage: '{emoji} | **{winner}** won!',
            gameEndMessage: 'It\'s a Tie!',
        });
        try {
            game.startGame();
        } catch (err) {
            return message.reply({
                embeds: [errorMention]
            }, {
                messageReference: message.id
            })
        }
    }
  }
