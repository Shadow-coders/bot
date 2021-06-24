const message = require('./message')

module.exports = {
name: 'ready',
once: true,
async execute(client) {
console.log(client.user.tag)
await client.application.fetch()
const neon = '566766267046821888'
client.devs = [ neon, '818495703718035487' ]
client.channels.cache.get('765669027552559149').send({ content: 'ready on djs @everyone ' + `<@${client.devs.join('> <@')}>` })

client.error(client.devs)
const wait = require('util').promisify(setTimeout)
const logger = require('../log')
const log = new logger(client, '829753754713718816')
client.db.logger = log
client.logger = log
/*client.fetchCache = function() { client.guilds.cache.forEach(guild => {
    console.log(' | loaded guild ' + guild.name)
    guild.members.fetch().then(() => {
        await wait(2000)
        guild.channels.fetch().then(() => {
            guild.channels.cache.forEach(ch => {
               await wait(2000) // console.log(`/discord/shadow/@me/${guild.id}/${ch.id}`)
                ch.messages.fetch({ limit: 1000 })
            })
        })
    })
})
}*/
}
}