module.exports = {
    name: 'guildCreate', // also guildDelete
    execute(guild,client) {
        const ch = client.channels.cache.get('829754497398997053')
        
        ch.send({ content: 'New guild ' + guild.name + ` and first ch ${guild.channels.cache.first().name} and ${client.guilds.cache.size}`,}).then(() => {
        if(guild.channels.cache.first().type === 'text' && guild.me.permissions.has('SEND_MESSAGES')) {
            guild.channels.cache.first().send({ content: 'Hellow' }).catch(client.error)
        }
        })
    },
type: 'event'
}