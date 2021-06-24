module.exports = {
name: "calc",
execute(interaction,cmd,args,client) {
const message = {
    channel: {
        send: async  function(text) {
interaction.send({ content: text })
        }
    },
    author: interaction.member.user,
    member: interaction.member
}
require('weky').Calculator(message)
}
}