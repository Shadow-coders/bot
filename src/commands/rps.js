const { RockPaperScissors } = require('discord-gamecord');

module.exports = {
    name: "rps",
    permissions: [],
    description: "Play a Game of Rock, Paper, Scissors with someone.",
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
        let game = new RockPaperScissors({
            message: message,
            opponent: message.mentions.users.first(),
            embed: {
                title: 'Rock, Paper, Scissors',
                description: 'Press any choice below to lock it in.',
                color: '#fffff',
            },
            buttons: {
                rock: 'Rock',
                paper: 'Paper',
                scissors: 'Scissors',
            },
            othersMessage: 'You may not use these Buttons.',
            chooseMessage: 'You chose {emoji}.',
            noChangeMessage: 'You cannot change your Choice.',
            askMessage: '{opponent}, {challenger} wants to beat you at a game of Rock, Paper, Scissors.\n\n`You have 60 Seconds to Accept`',
            cancelMessage: 'The opponent did not Accept.',
            timeEndMessage: 'The opponent did not Respond.',
            drawMessage: 'It\'s a Tie!',
            winMessage: '{winner} won!',
            gameEndMessage: 'It\'s a Tie!',
        })
        try {
            game.startGame();
        } catch (err) {
            return message.reply({
                embeds: [errorMention]
            }, {
                message_reference: message.id
            });
        }
    }
  }
