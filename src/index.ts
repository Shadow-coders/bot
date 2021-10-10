import colors from 'colors'
import DB from './util/mongo'
import mongoose from 'mongoose'
import Server from './server'
import logger from './log'
import CommandH from './util/commands'
import fs from 'fs'
import Discord from 'discord.js'
import Fetch from 'node-fetch'
import { Shadow } from './client'
import { GiveawaysManager } from "discord-giveaways"
// Using Node.js `require()`
//while(true) console.log(require.cache[require.resolve('./server.js')], require.cache[require.resolve('../server.js')])
const checkconfig = () => {
  return Server
};

// e
// const util = require('./util')
// let shadow = require('./util/Client')
let client:Shadow = new Discord.Client({
  intents: 30463,
  allowedMentions: { parse: ["users", "roles"], repliedUser: false },
  partials: ["CHANNEL"],
  ws: { properties: { $browser: 'Discord Android' }}
});
//let client = new shadow({ intents: [ 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'DIRECT_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_REACTIONS', 'GUILDS', 'DIRECT_MESSAGE_TYPING', 'GUILD_INVITES', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_INTEGRATIONS'], allowedMentions: { parse: ['users'], repliedUser: true }  })
// require('discord-buttons')(client);
let { token, prefix, mongo } = Server

const connection = await mongoose.connect(mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

//mongoose.createConnection(mongo/*, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true,
// }
//*/);
connection.on("open", () => {
  client?.error ? client.error("connected") : null
  console.log("connected mongo");
  // client.db.all().then((d:any) => {
  //   d.forEach((data:any) => {
  //     if(data.key.startsWith('error_')) data.remove()
  //   });
  // })
});
client.login(token);
let db = new DB();
// db.get("ping").then(console.log)
// {
//   reciver: false,
//   username: 'SH@D0Wb0T',
//  password: '$h@d0.wB0t.$',
//   uri: 'https://DB-LMAO.nongmerbot.repl.co'
//}
//console.log(db);
client.debug = [];
client.util = require("./util").default;
client.Util = require("discord.js").Util;
client.slash_commands = new Discord.Collection();
client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.awaited_commands = new Discord.Collection();
client.aliases = new Discord.Collection();
/**
 * @returns {DB}
 * @name Db
 */
client.db = db;
client.dab = db;
client.cache = [];
/**
 * @returns {CommandH}
 */
//@ts-ignore
client.commandsM = new CommandH({
  path: __dirname + "/commands/",
  //@ts-ignore
  client: client,
});

client.catagory = [{ name: 'basic', emoji: '894959651270033410' }]
client.queue = new Map();
client.vars = {};
client.storage = {};
/**
 * @returns {Object}
 * @name packager file
 */
client.package = require("./package.json");
/**
 * @returns {Array}
 */
client.files = fs.readdirSync("./");
client.config = checkconfig();
client.storage.fetched = { channels: {} }
client.errorCount = 0;
setTimeout(() => client.on("warn", client.logger.warn), 6e6);
client.fetch = Fetch
// @ts-ignore
// class giveaways extends GiveawaysManager {
//   constructor(client:any, ops:any) {
// super(client,ops)
//   }
//   // This function is called when the manager needs to get all giveaways which are stored in the database.
//   async getAllGiveaways() {
//     // Get all giveaways from the database
//     return await db.get("giveaways");
//   }

//   // This function is called when a giveaway needs to be saved in the database.
//   async saveGiveaway(messageID:any, giveawayData:any) {
//     // Add the new giveaway to the database
//     const ar = (await db.get("giveaways")) || [];
//     ar.push(giveawayData), db.set("giveaways", ar);
//     // Don't forget to return something!
//     return true;
//   }

//   // This function is called when a giveaway needs to be edited in the database.
//   async editGiveaway(messageID:any, giveawayData:any) {
//     // Get all giveaways from the database
//     const giveaways = await db.get("giveaways");
//     // Remove the unedited giveaway from the array
//     const newGiveawaysArray = giveaways.filter(
//       (giveaway:any) => giveaway.messageID !== messageID
//     );
//     // Push the edited giveaway into the array
//     newGiveawaysArray.push(giveawayData);
//     // Save the updated array
//     await db.set("giveaways", newGiveawaysArray);
//     // Don't forget to return something!
//     return true;
//   }

//   // This function is called when a giveaway needs to be deleted from the database.
//   async deleteGiveaway(messageID:any) {
//     // Get all giveaways from the database
//     const giveaways = await db.get("giveaways");
//     // Remove the giveaway from the array
//     const newGiveawaysArray = giveaways.filter(
//       (giveaway:any) => giveaway.messageID !== messageID
//     );
//     // Save the updated array
//     await db.set("giveaways", newGiveawaysArray);
//     // Don't forget to return something!
//   }
// }
setTimeout(() => db.on("debug", (info:String) => client.logger?.debug(info)), 3e4);
// client.giveaways = new giveaways(client, {
//   storage: "./giveaways.json",
//   updateCountdownEvery: 10000,
//   hasGuildMembersIntent: true,
//   default: {
//     botsCanWin: false,
//     exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
//     embedColor: "#FF0000",
//     embedColorEnd: "#000000",
//     reaction: "🎉",
//   },
// });

// client.getapi = async function (endpoint:any, prams:any) {
//   if (!endpoint) return;
//   let type;
//   let params = prams;
//   if (!type) {
//     type = 0;
//   }

//   if (typeof prams !== "object") {
//     if (typeof prams == "undefined") {
//       prams = null;
//     } else {
//       prams = JSON.stringify(prams);
//     }
//   }
//   let result;
//   const query = Object.keys(params)
//     .map((k) => `${esc(k)}=${esc(params[k])}`)
//     .join("&");
//   if ((type = 0)) {
//     require("node-fetch")(
//       "https://apiv2.jastinch.xyz/" +
//         endpoint +
//         "?key=" +
//         client.config.api_key[0] +
//         query,
//       {
//         method: "GET",
//       }
//     )
//       .then((res:any) => res.text())
//       .then((j:any) => (result = j));
//     return await result;
//   }
// };
/**
 *
 * @param {String||Number} reason
 */
client.shutdown = async function (reason = "None provided") {
  const descc =
    typeof reason === "number"
      ? `Exiting with code ` + reason
      : reason || "None provided";
  let desc = `\n reason: \`\`\`bash\n${descc}\`\`\``;
  try {
    /**
     * @returns {Discord.NewsChannel}
     * @implements {Discord.NewsChannel}
     */
    const ch = client.channels.cache.get("832694631459192903") as Discord.NewsChannel
    await ch?.send({
      content: "<@&882669704102150225>",
      embeds: [
        new Discord.MessageEmbed()
          .setTitle("Shutting down")
          .setDescription(desc)
          .setColor("RED")
          .setTimestamp(),
      ],
    }).then((m:any) => m.crosspost())
    // db.close(1)
    //  await client.error('shuting down')
    await client.emit("debug", "[DEBUG] => ( Shutting down...)");
  } catch (e) {
    client.error ? client.error(e) : null;
    e = {};
  } finally {
    await (client.error ? client.error("finally down") :null )
    if (client.isReady()) client.destroy();
    setTimeout(
      () => process.exit(typeof reason === "number" ? reason : 1),
      500
    );
  }
};
/**
 *
 * @param {Error} error
 * @param {String} type
 * @returns {Void}
 * @name Error
 */
client.error = async function (error:any, type?: String) {
  if (!type) {
    type = "[UNHANDLED]";
  }
  try {
    if (typeof error !== "string") {
      error = require("util").inspect(error);
    }
    client.errorCount++;
    await client.db.set("errors", (await client.db.get("errors")) + 1);
    const embed = new Discord.MessageEmbed()
      .setTitle("Error")
      .setDescription("```bash\n" + error + "```")
      .setColor("#ff0000")
      .setFooter(
        `with in total of ${await client.db.get(
          "errors"
        )} and in this session error count of ${
          client.errorCount
        } type: ${type}`
      );
    const m = await (client.channels.cache
      .get("829753754713718816") as Discord.TextChannel).send({ embeds: [embed] });
  } catch (e) {
    console.error(e);
    console.error(error);
  }
};
setInterval(() => {
  console.log(
    `Pong! ${client.ws.ping} && stuff`,
    require("discord.js").version,
    client.constructor.name
  );
}, 3000);
// const DisTube = require('distube')
// try{
//   const distube = new DisTube(client, { searchSongs: true, emitNewSongOnly: true });
//   client.disbute = distube;
// } catch(e) {
//   client.error('FALID_TO_LOAD_MUSIC').then(() => console.error('MUSIC_ERROR'))
// }

// const { Manager } = require("erela.js");
// const Spotify = require("erela.js-spotify");
// const Deezer = require("erela.js-deezer");
// const Facebook = require("erela.js-facebook");
// const filter  = require("erela.js-filters");
// client.manager = new Manager({
//   nodes: [{
//     host: "127.00.1",
//     retryDelay: 5000,
//     password: "lavalinkshadow",
//     port: 2333
//   }],
//   plugins: [new Spotify({
//     clientID: "45910922e14f453f8e1a17a29a1465c6",
//     clientSecret: require('../server.js').spotify_secret
//   }),
//   new Deezer(),
//   new Facebook(),
//   new filter()
// ],
//   autoPlay: true,
//   send: (id, payload) => {
//     const guild = client.guilds.cache.get(id);
//     if (guild) guild.shard.send(payload);
//   }
// }).on("nodeConnect", node => client?.logger.debug(`Node "${node.options.identifier}" connected.`))
// .on("nodeError", (node, error) => client.error(
//   `Node "${node.options.identifier}" encountered an error: ${error.message}.`
// ))
// .on("trackStart", (player, track) => {
//   const channel = client.channels.cache.get(player.textChannel);
//   channel.send(`Now playing: \`${track.title}\`, requested by \`${track.requester.tag}\`.`);
// })
// .on("queueEnd", player => {
//   const channel = client.channels.cache.get(player.textChannel);
//   channel.send("Queue has ended.");
//   player.destroy();
// });

// client.once("ready", () => {
//   client.manager.init(client.user.id);
//  setTimeout(() => client.logger.log(`Logged in as ${client.user.tag}`), 1500)
// });

// client.on("raw", d => client.manager.updateVoiceState(d));

client.commandsM.loadthings();
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

client.on(
  "interaction",
  /**
   * @name interaction
   */ async (interaction:any, op2?:any) => {
    console.log(interaction);
    if (!interaction.isCommand()) return;
    const cmd =
      !interaction.options._subcommand && !interaction.options_group
        ? interaction.commandName
        : !interaction.options._group
        ? interaction.options._subcommand
        : interaction.options._subcommand;
    const args:any[] = [];
    interaction.options.data.map((x:any) => {
      args.push(x.value);
    });

    const wait = require("util").promisify(setTimeout);
    interaction.send = interaction.reply;
    interaction.think = function (emp:Boolean) {
      if (emp) {
        interaction.defer({ ephemeral: true });
      } else {
        interaction.defer();
      }
    };
    interaction.delete = interaction.deleteReply;
    if (!client.slash_commands.find((c:any) => c.name === cmd))
      return interaction.send({
        content: "cannot get command " + cmd,
        ephemeral: true,
      });

    try {
      await client.slash_commands
        .find((c:any) => c.name === cmd)
        .execute(interaction, cmd, args, client);
    } catch (e) {
      client.error ?    client.error(e) : null;
      interaction.send({
        content: "faild to run this command!",
        ephemeral: true,
      });
    }
  }
);
// Queue status template
// const status = (queue) =>
//   `Volume: \`${queue.volume}%\` | Filter: \`${
//     queue.filter || "Off"
//   }\` | Loop: \`${
//     queue.repeatMode
//       ? queue.repeatMode == 2
//         ? "All Queue"
//         : "This Song"
//       : "Off"
//   }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

// // DisTube event listeners, more in the documentation page
// distube
//   .on("playSong", (message, queue, song) =>
//     message.channel.send(
//       `Playing \`${song.name}\` - \`${
//         song.formattedDuration
//       }\`\nRequested by: ${song.user}\n${status(queue)}`
//     )
//   )
//   .on("addSong", (message, queue, song) =>
//     message.channel.send(
//       `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
//     )
//   )
//   .on("playList", (message, queue, playlist, song) =>
//     message.channel.send(
//       `Play \`${playlist.name}\` playlist (${
//         playlist.songs.length
//       } songs).\nRequested by: ${song.user}\nNow playing \`${song.name}\` - \`${
//         song.formattedDuration
//       }\`\n${status(queue)}`
//     )
//   )
//   .on("addList", (message, queue, playlist) =>
//     message.channel.send(
//       `Added \`${playlist.name}\` playlist (${
//         playlist.songs.length
//       } songs) to queue\n${status(queue)}`
//     )
//   )
//   // DisTubeOptions.searchSongs = true
//   .on("searchResult", (message, result) => {
//     let i = 0;
//     message.channel.send(
//       `**Choose an option from below**\n${result
//         .map(
//           (song) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``
//         )
//         .join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`
//     );
//   })
//   // DisTubeOptions.searchSongs = true
//   .on("searchCancel", (message) => message.channel.send(`Searching canceled`))
//   .on("error", (message, e) => {
//     console.error(e);
//     message.channel.send("An error encountered: " + e);
//   });
setTimeout(
  () => process.on("warning", (info:any) => client.logger?.warn(info)),
  6e6
);
process.on("uncaughtException", (err:any) => {
  console.error(err);
  client.error ? client.error(err) : null;
});
process.on("unhandledRejection", (reason:any, promise:Promise<any>) => {
  client.error ? client.error(reason) : null
});
process.on("SIGINT", () => client.shutdown ? client?.shutdown("SIGINT") : null);
process.on("exit", (code:any) => client.shutdown ? client?.shutdown(`CODE ${code}`) : null);
process.on("beforeExit", () => console.log("exiting..."));
process.on('SIGBREAK', () => client.shutdown ? client?.shutdown("SIGBREAK") : null)
process.on('SIGKILL', () => client.shutdown ? client?.shutdown("SIGKILL") : null);
process.on('SIGTERM', () => client.shutdown ? client?.shutdown("SIGTERM") : null)
process.on('SIGSTOP', () => client.shutdown ? client?.shutdown("SIGSTOP") : null)