var colors = require('colors')
const DB = require("./util/mongo")
// Using Node.js `require()`
const mongoose = require('mongoose');
const checkconfig = () => {
try {
return require('./server.js')
} catch (e) {
return require('../../server.js')
}
}

// e
const logger = require('./log')
// const util = require('./util')
const CommandH = require('./util/commands.js')
const fs = require('fs')
let Discord = require('discord.js')
// let shadow = require('./util/Client')

let client = new Discord.Client({ intents: [ 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'DIRECT_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_REACTIONS', 'GUILDS', 'DIRECT_MESSAGE_TYPING', 'GUILD_INVITES', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_INTEGRATIONS', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_WEBHOOKS'], allowedMentions: { parse: ['users'], repliedUser: false }, partials: ['CHANNEL']  })
//let client = new shadow({ intents: [ 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'DIRECT_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_REACTIONS', 'GUILDS', 'DIRECT_MESSAGE_TYPING', 'GUILD_INVITES', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_INTEGRATIONS'], allowedMentions: { parse: ['users'], repliedUser: true }  })
// require('discord-buttons')(client);
let { token, prefix, mongo } = checkconfig()
mongoose.connect(mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
const connection = mongoose.createConnection(mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
connection.on("open", () => { client.error("connected") 
                            console.log("connected mongo")})
client.login(token)
let db = new DB()
db.focus = function() {
return undefined;
}
// db.get("ping").then(console.log)
// {
 //   reciver: false,
 //   username: 'SH@D0Wb0T',
  //  password: '$h@d0.wB0t.$',
 //   uri: 'https://DB-LMAO.nongmerbot.repl.co'
//}
console.log(db)
client.debug = []

client.slash_commands = new Discord.Collection();
client.commands = new Discord.Collection();
client.events = new Discord.Collection()
client.awaited_commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.db = db
client.dab = db
client.cache = []
client.commandsM = new CommandH({ path: __dirname + '/commands/', client: client })
client.casino = db.focus('casino')
client.queue = new Map();
client.vars = {}
client.storage = {}
client.package = require('../package.json')
client.files = fs.readdirSync('./')
client.config = checkconfig()
client.errorCount = 0
client.on('warn', console.warn)
client.fetch = require('node-fetch')
const { GiveawaysManager } = require('discord-giveaways');
class giveaways extends GiveawaysManager {
    // This function is called when the manager needs to get all giveaways which are stored in the database.
    async getAllGiveaways() {
        // Get all giveaways from the database
        return db.get('giveaways');
    }

    // This function is called when a giveaway needs to be saved in the database.
    async saveGiveaway(messageID, giveawayData) {
        // Add the new giveaway to the database
    const ar = db.get('giveaways') || []
    ar.push(giveawayData),
    db.set('giveaways', ar)
        // Don't forget to return something!
        return true;
    }

    // This function is called when a giveaway needs to be edited in the database.
    async editGiveaway(messageID, giveawayData) {
        // Get all giveaways from the database
        const giveaways = db.get('giveaways');
        // Remove the unedited giveaway from the array
        const newGiveawaysArray = giveaways.filter((giveaway) => giveaway.messageID !== messageID);
        // Push the edited giveaway into the array
        newGiveawaysArray.push(giveawayData);
        // Save the updated array
        db.set('giveaways', newGiveawaysArray);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a giveaway needs to be deleted from the database.
    async deleteGiveaway(messageID) {
        // Get all giveaways from the database
        const giveaways = db.get('giveaways');
        // Remove the giveaway from the array
        const newGiveawaysArray = giveaways.filter((giveaway) => giveaway.messageID !== messageID);
        // Save the updated array
        db.set('giveaways', newGiveawaysArray);
        // Don't forget to return something!
        return true;
    }
};
db.on('debug', info => client.emit('debug', info))
const Logger = require('./log')
client.giveaways = new GiveawaysManager(client, {
    storage: './giveaways.json',
    updateCountdownEvery: 10000,
    hasGuildMembersIntent: true,
    default: {
        botsCanWin: false,
        exemptPermissions: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
        embedColor: '#FF0000',
        embedColorEnd: '#000000',
        reaction: '🎉'
    }
});

client.getapi = async function(endpoint, prams) {
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
    require('node-fetch')('https://apiv2.jastinch.xyz/' + endpoint + '?key=' + client.config.api_key[0] + query, {
method: 'GET'
    }).then(res => res.text()).then(j => result = j)
    return await result;
}
}
client.shutdown = function(reason) {
try {
    client.channels.cache.get('832295919797010503').send('shuting down...')
    // db.close(1)
    client.emit('debug', "[DEBUG] => ( Shutting down...)")
} catch (e) {
e = {}
} finally {
client.destroy()
}
}
client.error =  async function(error, type) {
if(!type) {
    type = '[UNHANDLED]'
}
    try {
    if(typeof error !== 'string') {
error = require('util').inspect(error)
}
client.errorCount++
 await client.db.set('errors', await client.db.get('errors')+1)
const embed = new Discord.MessageEmbed()
.setTitle('Error')
.setDescription('```bash\n' + error + '```')
.setColor('#ff0000')
.setFooter(`with in total of ${await client.db.get('errors')} and in this session error count of ${client.errorCount} type: ${type}`)
const m = await client.channels.cache.get('829753754713718816').send({ embeds: [embed] })
await client.db.set('error_' + m.id, { errorcount: { cache: await client.db.get('errors'), startup: client.errorCount }, date: Date.now() })
} catch (e) {
    console.error(e)
    console.error(error)
}

}

client.commandsM.loadthings()
/*
const commandFiles = fs.readdirSync(__dirname + '/commands/').filter(file => file.endsWith('.js'));
const slashcommands = fs.readdirSync(__dirname + '/slash/').filter(file => file.endsWith('.js'));
for(const file of slashcommands) {
const command = require(__dirname + '/slash/' + file);
if(!command.name || !command || !command.execute) throw `Slash command ${file} is missing a name!`
client.slash_commands.set(command.name, command)
}
for (const file of commandFiles) {
	const command = require(`./commands/${file}`); 
    console.log('|---------------------|')
if(Array.isArray(command)) {
for(const cmd of command) {
if(!cmd.name) throw 'Command ' + file.split('.')[0] + ' needs a name!'
if(cmd.aliases && Array.isArray(cmd.aliases)) {
cmd.aliases.forEach(ali => client.aliases.set(ali, cmd.name))
console.log('| loaded command ' + cmd.name)
}
client.commands.set(cmd.name, cmd);
} 
} else {
const cmd = command
if(!cmd.name) throw 'Command ' + file.split('.')[0] + ' needs a name!'
if(cmd.aliases && Array.isArray(cmd.aliases)) {
cmd.aliases.forEach(ali => client.aliases.set(ali, cmd.name))
}
console.log('| loaded command ' + cmd.name)
client.commands.set(cmd.name, cmd);
}
	
}

const eventFiles = fs.readdirSync(__dirname + '/events/')
console.log(eventFiles)
for (const file of eventFiles) {
	const event = require(__dirname + `/events/${file}`);
if(!event.name) { console.error('Event ' + file.split('.')[0] + ' needs a name') 
continue;
}
client.events.set(event.name, event)
console.log(' loaded ' + event.name)
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}
/*
/*
module.exports = {
	name: 'name',
	once: true/false,
	execute(..args, client) {
		// code
	},
};
*/
    
client.on('interaction', async (interaction, op2) => {
	console.log(interaction);
    if (!interaction.isCommand()) return;
    const cmd = !interaction.options._subcommand && !interaction.options_group ? interaction.commandName : ( !interaction.options._group ? interaction.options._subcommand : interaction.options._subcommand)
    const args = []
    interaction.options.data.map((x) => {
        args.push(x.value)
    })
   
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
    if(!client.slash_commands.find(c => c.name === cmd )) return interaction.send({ content: 'cannot get command ' + cmd,  ephemeral: true })



try {
await client.slash_commands.find(c => c.name === cmd).execute(interaction, cmd, args, client)
} catch (e) {
client.error(e)
interaction.send({ content: 'faild to run this command!', ephemeral: true }) 
}

})
process.on('uncaughtException', err => {
    client.error(err)
  })
  process.on('unhandledRejection', (reason, promise) => {
    client.error(reason)
  })
  
setInterval(() => console.log(`Pong! ${client.ws.ping}`), 3000)
