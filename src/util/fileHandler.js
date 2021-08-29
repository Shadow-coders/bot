let events = require('events').EventEmitter
module.exports = class Files extends events { 
constructor(client) {
    super()
    this.interval = setInterval(() => {
        Object.entries(require.cache).filter(arg => arg[0].includes('/commands/')).forEach(arg => {
            delete require.cache[arg[0]]
        })
    }, 1000);
}
stop() {
    clearInterval(this.interval)
    this.interval = null
}

}