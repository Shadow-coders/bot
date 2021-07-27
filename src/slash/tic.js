module.exports = {
    name: "tictactoe",
    execute(interaction,cmd,args,client) {
        const opponent = client.users.cache.get(args.find(a => a.name === 'user').value)
if(opponent.bot) return interaction.send('you cannot challange a bot')
const { TicTacToe } = require('weky')
const message = {
    author: interaction.user,
    member: interaction.member,
    client: client,
    channel: {
         send: async function(msg) {
            interaction.send(msg).catch(e => client.error(e + '[FATAL]'))
        }
    }
}
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