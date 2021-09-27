var colors = require("colors");
const DB = require("./util/mongo");
// Using Node.js `require()`
const mongoose = require("mongoose");
//while(true) console.log(require.cache[require.resolve('./server.js')], require.cache[require.resolve('../server.js')])
const checkconfig = () => {
  return require("../server.js");
};

// e
const logger = require("./log");
// const util = require('./util')
const CommandH = require("./util/commands.js");
const fs = require("fs");
let Discord = require("discord.js");
// let shadow = require('./util/Client')
let client = new Discord.Client({
  intents: 30463,
  allowedMentions: { parse: ["users", "roles"], repliedUser: false },
  partials: ["CHANNEL"],
  makeCache: manager => {
		if (manager.name === 'MessageManager') return new Discord.Collection({ maxSize: 0 });
		return new Discord.Collection();
	}
});
client.options.ws.properties.$os = "Discord Andriod";
//let client = new shadow({ intents: [ 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'DIRECT_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_REACTIONS', 'GUILDS', 'DIRECT_MESSAGE_TYPING', 'GUILD_INVITES', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_INTEGRATIONS'], allowedMentions: { parse: ['users'], repliedUser: true }  })
// require('discord-buttons')(client);
let { token, prefix, mongo } = require("../server.js");
mongoose.connect(mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
const connection = mongoose.createConnection(mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
connection.on("open", () => {
  client.error("connected");
  console.log("connected mongo");
});
client.login(token);
let db = new DB();
db.focus = function () {
  return undefined;
};
// db.get("ping").then(console.log)
// {
//   reciver: false,
//   username: 'SH@D0Wb0T',
//  password: '$h@d0.wB0t.$',
//   uri: 'https://DB-LMAO.nongmerbot.repl.co'
//}
//console.log(db);
client.debug = [];
client.util = require("./util");
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
client.commandsM = new CommandH({
  path: __dirname + "/commands/",
  client: client,
});
/**
 * @returns {undefined}
 */
client.casino = db.focus("casino");
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
client.errorCount = 0;
setTimeout(() => client.on("warn", client.logger.warn), 6e6);
client.fetch = require("node-fetch");
const { GiveawaysManager } = require("discord-giveaways");
class giveaways extends GiveawaysManager {
  // This function is called when the manager needs to get all giveaways which are stored in the database.
  async getAllGiveaways() {
    // Get all giveaways from the database
    return await db.get("giveaways");
  }

  // This function is called when a giveaway needs to be saved in the database.
  async saveGiveaway(messageID, giveawayData) {
    // Add the new giveaway to the database
    const ar = (await db.get("giveaways")) || [];
    ar.push(giveawayData), db.set("giveaways", ar);
    // Don't forget to return something!
    return true;
  }

  // This function is called when a giveaway needs to be edited in the database.
  async editGiveaway(messageID, giveawayData) {
    // Get all giveaways from the database
    const giveaways = await db.get("giveaways");
    // Remove the unedited giveaway from the array
    const newGiveawaysArray = giveaways.filter(
      (giveaway) => giveaway.messageID !== messageID
    );
    // Push the edited giveaway into the array
    newGiveawaysArray.push(giveawayData);
    // Save the updated array
    await db.set("giveaways", newGiveawaysArray);
    // Don't forget to return something!
    return true;
  }

  // This function is called when a giveaway needs to be deleted from the database.
  async deleteGiveaway(messageID) {
    // Get all giveaways from the database
    const giveaways = await db.get("giveaways");
    // Remove the giveaway from the array
    const newGiveawaysArray = giveaways.filter(
      (giveaway) => giveaway.messageID !== messageID
    );
    // Save the updated array
    await db.set("giveaways", newGiveawaysArray);
    // Don't forget to return something!
    return true;
  }
}
setTimeout(() => db.on("debug", (info) => client.logger?.debug(info)), 3e4);
const Logger = require("./log");
const { type } = require("os");
client.giveaways = new giveaways(client, {
  storage: "./giveaways.json",
  updateCountdownEvery: 10000,
  hasGuildMembersIntent: true,
  default: {
    botsCanWin: false,
    exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
    embedColor: "#FF0000",
    embedColorEnd: "#000000",
    reaction: "🎉",
  },
});

client.getapi = async function (endpoint, prams) {
  if (!endpoint) return;
  let type;
  let params = prams;
  if (!type) {
    type = 0;
  }

  if (typeof prams !== "object") {
    if (typeof prams == "undefined") {
      prams = null;
    } else {
      prams = JSON.stringify(prams);
    }
  }
  let result;
  const query = Object.keys(params)
    .map((k) => `${esc(k)}=${esc(params[k])}`)
    .join("&");
  if ((type = 0)) {
    require("node-fetch")(
      "https://apiv2.jastinch.xyz/" +
        endpoint +
        "?key=" +
        client.config.api_key[0] +
        query,
      {
        method: "GET",
      }
    )
      .then((res) => res.text())
      .then((j) => (result = j));
    return await result;
  }
};
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
    const ch = client.channels.cache.get("832694631459192903");
    await ch.send({
      content: "<@&882669704102150225>",
      embeds: [
        new Discord.MessageEmbed()
          .setTitle("Shutting down")
          .setDescription(desc)
          .setColor("RED")
          .setTimestamp(),
      ],
    });
    // db.close(1)
    //  await client.error('shuting down')
    await client.emit("debug", "[DEBUG] => ( Shutting down...)");
  } catch (e) {
    client.error(e);
    e = {};
  } finally {
    await client.error("finally down");
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
client.error = async function (error, type) {
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
    const m = await client.channels.cache
      .get("829753754713718816")
      .send({ embeds: [embed] });
    await client.db.set("error_" + m.id, {
      errorcount: {
        cache: await client.db.get("errors"),
        startup: client.errorCount,
      },
      date: Date.now(),
    });
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
   */ async (interaction, op2) => {
    console.log(interaction);
    if (!interaction.isCommand()) return;
    const cmd =
      !interaction.options._subcommand && !interaction.options_group
        ? interaction.commandName
        : !interaction.options._group
        ? interaction.options._subcommand
        : interaction.options._subcommand;
    const args = [];
    interaction.options.data.map((x) => {
      args.push(x.value);
    });

    const wait = require("util").promisify(setTimeout);
    interaction.send = interaction.reply;
    interaction.think = function (emp) {
      if (emp) {
        interaction.defer({ ephemeral: true });
      } else {
        interaction.defer();
      }
    };
    interaction.delete = interaction.deleteReply;
    if (!client.slash_commands.find((c) => c.name === cmd))
      return interaction.send({
        content: "cannot get command " + cmd,
        ephemeral: true,
      });

    try {
      await client.slash_commands
        .find((c) => c.name === cmd)
        .execute(interaction, cmd, args, client);
    } catch (e) {
      client.error(e);
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
  () => process.on("warning", (info) => client.logger?.warn(info)),
  6e6
);
process.on("uncaughtException", (err) => {
  console.error(err);
  client.error(err);
});
process.on("unhandledRejection", (reason, promise) => {
  client.error(reason);
});
process.on("SIGINT", () => client.shutdown("SIGINT"));
process.on("exit", (code) => client.shutdown(code));
process.on("beforeExit", () => console.log("exiting..."));
