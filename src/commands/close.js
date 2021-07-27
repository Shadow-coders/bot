module.exports = {
name: 'close',
async execute(message,args,client) {
const isTick = await client.db.get('ticket_'+message.channel.id)
if(!isTick) return message.channel.send('err');
console.log(isTick)
await client.db.delete(`ticket_${isTick}_${message.guild.id}`)
await client.db.delete(`ticket_${message.channel.id}`)
message.channel.send('i will delete this ticket in `5s`!').then(m => {
setTimeout(() => {
m.delete().then(re => message.channel.delete())
}, 4900)
})
}
}