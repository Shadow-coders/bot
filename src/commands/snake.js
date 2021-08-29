module.exports = {
    name: 'snake',
    execute(message,args,client) {
        const { Snake } = require('weky');
new Snake({
    message: message,
    embed: {
    title: 'Snake', //embed title
    color: "#gt4668", //embed color
    gameOverTitle: "Game Over", //game over embed title
    },
    emojis: {
      empty: '⬛', //zone emoji
      snakeBody: '🐍', //snake
      food: '🍎', //food emoji
      //control
      up: '⬆️', 
      right: '⬅️',
      down: '⬇️',
      left: '➡️',
      },
    }).start()
  //Errors or questions? https://discord.gg/2EZSpxNB5z (Support server for weky npm)
    }
}