
module.exports = {
name: 'voiceStateUpdate',
once: false,
type: 'event',
async execute(oldState, newState, client) { 
    if(!oldState.channel && newState.channel) {
        client.emit('channeljoin', newState)
    }  else if(oldState.channel && !newState.channel) {
        client.emit('channelleave', oldState)
    }
}
}