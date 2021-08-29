module.exports = class Util extends require('events').EventEmitter {
    constructor(client) {
super()        
this.client = client
    }
    async load() {
        return {
            Util: require('discord.js').Util
        }
    }
}