var color = require('colors')
const Discord = require('discord.js')
let fs = require('fs')
class Logger extends require('events').EventEmitter {
    constructor(client, id) {
        super()
        this.client = client
        this.channel = id ? '829753754713718816' : '829753754713718816'
        this.id = this.channel
        this.logs = []
        console.log('[LOGGER]'.bold + ' logger has started');
        this.on('logCreate', text => {
if(!this.file) {
    this.file = '/home/container/src/logs/' + new Date.toString()
    fs.writeFileSync(this.file)
}
        })
    }
    log(log, ops) {
        if(typeof log !== 'string') {
            log = require('util').inspect(log)
        }
        console.log('[LOGGER]'.bold + ' ' + log)
        const embed = new Discord.MessageEmbed()
        .setTitle('[LOG]')
        .setDescription('```bash\n' + log + '```')
        .setColor('#00ff00')
       
        this.client.channels.cache.get(this.id).send({ embeds: [embed] })
    }
    error(error) {
        if(typeof error !== 'string') {
            error = require('util').inspect(error)
            }
console.error('[ERROR]'.bgRed.bold + ` ${error}`)
            const embed = new Discord.MessageEmbed()
            .setTitle('[ERROR]')
            .setDescription('```bash\n' + error + '```')
            .setColor('#ff0000')
            if(!this.channel) return;
            if(!this.client.user) return;
            this.client.channels.cache.get(this.id).send({ embeds: [embed] })
            } 
            warn(log) {
        if(typeof log !== 'string') {
            log = require('util').inspect(log)
            }
            console.warn('[WARN]'.bgYellow.black.bold  + ' ' + log)
        const embed = new Discord.MessageEmbed()
        .setTitle('[WARN]')
        .setDescription('```bash\n' + log + '```')
        .setColor('#ffff00')
       
        this.client.channels.cache.get(this.id).send({ embeds: [embed] })
            }
    debug(log) {
        console.debug('[DEBUG]'.bgBlack.white.bold + ' ' + log)
        if(10 > this.logs.length) return this.logs.push(log)
        const embed = new Discord.MessageEmbed()
        .setTitle('[DEBUG]')
        .setDescription('```bash\n' + this.logs.join('\n----------\n') + '```')
        .setColor('#ffffff')
       this.client.channels.cache.get(this.id).send({ embeds: [embed] }).then(m => this.logs = [])
    }
        }
        const times = []
        process.on('uncaughtException', (err) => { 
        console.error(err.message, err.name)})
module.exports = Logger;