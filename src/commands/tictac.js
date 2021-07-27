module.exports = {
    name: "tictactoe",
    execute(message,args,client) {
        const opponent = message.mentions.users.first() || client.users.cache.get(args[0])
if (!opponent) return message.channel.send(`Please mention who you want to challenge at tictactoe.`);
if(opponent.bot) return message.channel.send('you need a REAL person')
const { TicTacToe } = require('weky')
const game = new TicTacToe({
    message: message,
    opponent: opponent, // opponent
    xColor: 'red', // x's color
    oColor: 'blurple', //zero's color
    xEmoji: '❌',  //t he x emoji
    oEmoji: '0️⃣' ,// the zero emoji
})
game.start()// start da game

    }
}