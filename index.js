var colors = require('colors')
const DB = require('./util/db')
const logger = require('./log')
const fs = require('fs')
let Discord = require('discord.js')
let client = new Discord.Client({ intents: [ 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'DIRECT_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_REACTIONS', 'GUILDS', 'DIRECT_MESSAGE_TYPING', 'GUILD_INVITES', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_INTEGRATIONS'], allowedMentions: { parse: ['users'], repliedUser: true }  })
require('discord-buttons')(client);
let { token, prefix } = require('./server.js')
client.login(token)
const db = new DB({ logger: console, path: __dirname + '/db/main.json' })
client.debug = []
client.slash_commands = new Discord.Collection();
client.commands = new Discord.Collection();
client.events = new Discord.Collection()
client.awaited_commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.db = db
client.casino = new DB({ logger: console, path: __dirname + '/db/casino.json'})
client.queue = new Map();
client.vars = {}
client.storage = {}
client.package = require('./package.json')
client.files = fs.readdirSync('./')
client.config = require('./server.js')
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
client.error =  function(error, type) {
if(!type) {
    type = '[UNHANDLED]'
}
    try {
    if(typeof error !== 'string') {
error = require('util').inspect(error)
}
client.errorCount++
client.db.set('errors', client.db.get('errors')+1)
const embed = new Discord.MessageEmbed()
.setTitle('Error')
.setDescription('```bash\n' + error + '```')
.setColor('#ff0000')
.setFooter(`with in total of ${client.db.get('errors')} and in this session error count of ${client.errorCount} type: ${type}`)
client.channels.cache.get('829753754713718816').send({ embeds: [embed] })
} catch (e) {
    console.error(e)
    console.error(error)
}

}

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const slashcommands = fs.readdirSync('./slash').filter(file => file.endsWith('.js'));
for(const file of slashcommands) {
const command = require('./slash/' + file);
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

const eventFiles = fs.readdirSync('./events/')
console.log(eventFiles)
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
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
module.exports = {
	name: 'name',
	once: true/false,
	execute(..args, client) {
		// code
	},
};
*/client.on('ready', () => {
    console.log('creating slash commands...');
client.api.applications(client.user.id).guilds('765669027552559145').commands.post({
        data: {
            name: "ping",
            description: "ping! me"
        }
    });
    client.api.applications(client.user.id).guilds('765669027552559145').commands.post({
        data: {
            name: "hello",
            description: "Replies with Hello World!"
        }
    });

    client.api.applications(client.user.id).guilds('765669027552559145').commands.post({
        data: {
            name: "echo",
            description: "Echos your text as an embed!",

            options: [
                {
                    name: "content",
                    description: "Content of the embed",
                    type: 3,
                    required: true
                }
            ]
        }
    });
});

    
client.on('interaction', async (interaction, op2) => {
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
    if(!client.slash_commands.get(cmd)) return interaction.send('cannot get command ' + cmd, { ephemeral: true })



try {
client.slash_commands.get(cmd).execute(interaction, cmd, args, client)
} catch (e) {
client.error(e)
interaction.send('faild to run this command!', { ephemeral: true }) 
}

})
process.on('uncaughtException', err => {
    client.error(err)
  })
  process.on('unhandledRejection', (reason, promise) => {
    client.error(reason)
  })
  
