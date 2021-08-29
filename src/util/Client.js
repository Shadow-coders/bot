const { Client, Util } = require('discord.js')
const Uti = require('../util')
const DB = require('../util/db')
const fs = require('fs')
const CommandH = require('./commands')
const Discord = require('discord.js')
module.exports = class Shadow extends Client {
    constructor(ops = {}) {
        super(ops)
        this.ops = ops
__dirname = '/home/container/src/'
        this.config = require('../server.js')
        this.token = this.config.token
this.commands = new Map()
this.util = new Uti(this)
this.discord = require('discord.js')
   this.util.on('ready', () => {
       console.log()
   })
   const db = new DB({
    reciver: false,
    username: 'SH@D0Wb0T',
    password: '$h@d0.wB0t.$',
    uri: 'https://DB-LMAO.nongmerbot.repl.co'
})
this.db = db
   this.debug = []
 const Discord = this.discord
this.slash_commands = new Discord.Collection();
this.commands = new Discord.Collection();
this.events = new Discord.Collection()
this.awaited_commands = new Discord.Collection()
this.aliases = new Discord.Collection()
this.db = db
this.dab = db
this.cache = []
this.commandsM = new CommandH({ path: __dirname + '/commands/', client: this })
this.casino = db.focus('casino')
this.queue = new Map();
this.vars = {}
this.storage = {}
this.package = require('../package.json')
this.files = fs.readdirSync('../')
this.config = require('../server.js')
this.errorCount = 0
this.getapi = async function(endpoint, prams) {
    if(!endpoint) return;
    let type;
    let params = prams
    if(!type) { type = 0 }
    
    if(typeof prams !== 'object') {
        if(typeof prams == 'undefined') {
            prams = null
        }else {
            prams = JSON.stringify(prams)
        }
    }
    let result;
    const query = Object.keys(params).map(k => `${esc(k)}=${esc(params[k])}`).join('&')
    if(type = 0) {
        require('node-fetch')('https://apiv2.jastinch.xyz/' + endpoint + '?key=' + this.config.api_key[0] + query, {
    method: 'GET'
        }).then(res => res.text()).then(j => result = j)
        return await result;
    }
    }
    this.shutdown = function(reason) {
    try {
        this.channels.cache.get('832295919797010503').send('shuting down...')
        // db.close(1)
        this.emit('debug', "[DEBUG] => ( Shutting down...)")
    } catch (e) {
    e = {}
    } finally {
    this.destroy()
    }
    }
    this.error =  async function(error, type) {
        if(!type) {
            type = '[UNHANDLED]'
        }
            try {
            if(typeof error !== 'string') {
        error = require('util').inspect(error)
        }
        this.errorCount++
         await this.db.set('errors', await this.db.get('errors')+1)
        const embed = new Discord.MessageEmbed()
        .setTitle('Error')
        .setDescription('```bash\n' + error + '```')
        .setColor('#ff0000')
        .setFooter(`with in total of ${await await this.db.get('errors')} and in this session error count of ${this.errorCount} type: ${type}`)
        const m = await this.channels.cache.get('829753754713718816').send({ embeds: [embed] })
        await this.db.set('error_' + m.id, { errorcount: { cache: await this.db.get('errors'), startup: this.errorCount }, date: Date.now() })
        } catch (e) {
            console.error(e)
            console.error(error)
        }
        
        }
        this.on('interaction', async (interaction, op2) => {
            console.log(interaction);
            if (!interaction.isCommand()) return;
            const cmd = interaction.commandName
            const args = interaction.options
            const wait = require('util').promisify(setTimeout);
            interaction.send = interaction.reply
            interaction.think = function(emp) {
             if(emp) {
                 interaction.defer({ ephemeral: true })
             } else {
                 interaction.defer()
             }
            }
            interaction.delete = interaction.deleteReply
            if(!this.slash_commands.get(cmd)) return interaction.send('cannot get command ' + cmd, { ephemeral: true })
        
        
        
        try {
        this.slash_commands.get(cmd).execute(interaction, cmd, args, this)
        } catch (e) {
        this.error(e)
        interaction.send('faild to run this command!', { ephemeral: true }) 
        }
        
        })
        process.on('uncaughtException', err => {
            this.error(err)
          })
          process.on('unhandledRejection', (reason, promise) => {
            this.error(reason)
          })
}

async login(token = this.token) {
    await this.login(token)
   // this.util_loaded = this.util.load()
this.commandsM.loadthings()
}
}