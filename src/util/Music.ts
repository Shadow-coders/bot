//import {raw as ytdl} from 'youtube-dl-exec'
import ytdl from 'ytdl-core'
import {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Client,
  CommandInteraction,
  Message,
} from "discord.js"
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  entersState,
  StreamType,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  getVoiceConnection,
  demuxProbe,
} = require("@discordjs/voice");
const { getData, getPreview, getTracks } = require("spotify-url-info");
const yts = require("yt-search");

class Song {
  title: any
    url: any
author: any
type: any
user?:any
songs?: any
unsuported?: any
fetch: any
  /**
   *
   * @param {Object} song
   * @param {String} type
   * @name SongDetials
   */
  constructor(song:any, type:any) {
    
    switch (type) {
      case "YOUTUBE_SEARCH":
        this.title = song.title;
        this.url = song.url;
        (this.author = song.author), (this.user = song.user);
        this.type = type;
        break;
      case "YOUTUBE_SONG":
        yts(song.videoDetails.video_url).then((data:any) => {
          Object.entries(new Song(data.videos[0], "YOUTUBE_SEARCH")).forEach(
            (obj) => {
            //@ts-ignore
              this[obj[0]] = obj[1];
            }
          );
        });
        break;
      case "SPOTIFY_TRACK":
        Object.entries(song).forEach((s) => {
         //@ts-ignore
          this[s[0]] = s[1];
        });
        this.type = type;

        break;
      case "SPOTIFY_PLAYLIST":
        //@ts-ignore
        if (!Array.isArray(song)) return (this.unsuported = true);
        this.songs = [];
        //let songs = this.songs;
        this.type = type;
        this.fetch = async () => {
          process.emit("uncaughtException", new Error("Loading songs...."));
          song.forEach(async (d) => {
        //   process.emit("musictest", "Fetching... " + d.name);
            this.songs.push(d);
            // await yts(`${d.name} - ${d.artists[0]?.name}`).then(Fetched => {
            //   process.emit('got ' + Fetched.videos[0])
            //  this.songs.push(new Song(Fetched.videos[0], 'YOUTUBE_SEARCH'))
            // })
          });
        };
        break;
      case "SPOTIFY_TRACK--env":
        this.title = song.name;
        this.author = song.artists[0].name;
        this.type = type;
        break;
      default:
        this.unsuported = true;
        break;
    }
  }
}

class Music {
  Regex: RegExp;
  ops: any
  constructor(ops = {}) {
    this.Regex =
      /(?:https:\/\/open\.spotify\.com\/|spotify:)(?:.+)?(track|playlist|album)[\/:]([A-Za-z0-9]+)/;
    this.ops = ops;
    console.log("FOUND_DEBUG");
    process.on("unhandledRejection", console.error);
  }
  static READY() {
    //@ts-ignore
    return this !== {};
  }
  changeVol(message:Message | CommandInteraction, serverQueue:Map<String, any> | null, args:String[]) {
    message.reply("set volume to " + parseInt(args.join('')));
    //serverQueue.volume = parseInt(args);
    //  serverQueue.connection.dispatcher.setVolumeLogarithmic(parseInt(args[0]) / 5)
  }
   /**
   *
   * @param {Message|CommandInteraction} message
   * @param {Map} serverQueue
   * @param {String[]} args
   * @param {Boolean} NoMessage
   * @param {Object} options
   * @returns {Object}
   */
 
  async execute(message: Message | CommandInteraction, serverQueue = null, args = [], options = { NoMessage: false, interaction: false, reply: null }) {
    /**
     * @param {Boolean} NoMessage
     * @param {Boolean} interaction
     */
    let { NoMessage = false, interaction = false } = options;
  //@ts-ignore //@ts-ignore //@ts-ignore 
    if (interaction && !message.replied) message.deferReply();
    const reply = (msg:any) => {
      if (interaction)
       //@ts-ignore
        return message.deferred
        //@ts-ignore  
        ? message.editReply(msg)
        //@ts-ignore 
        : message.followUp(msg);
      //@ts-ignore
          return message.channel.send(msg);
    };
    //@ts-ignore
    const voiceChannel = message?.member?.voice?.channel;
    if (!voiceChannel) {
      !options.interaction
        ? reply("You need to be in a voice channel to play music!")
        : reply({
            content: "You need to be in a voice channel to play music!",
            ephemeral: true,
          });
      return;
    }
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return !interaction
        ? reply(
            "I need the permissions to join and speak in your voice channel!"
          )
        : reply({
            content:
              "I need the permissions to join and speak in your voice channel!",
            ephemeral: true,
          });
    }
    //@ts-ignore
    let song;
    // console.log(this)
    if (!args.join("")) return reply({ content: "Missing Args!" });
    let SEARCH_TYPE = Music.findType(args[0]);
  //  message.client.error([SEARCH_TYPE, args.join(" ")]);
    switch (SEARCH_TYPE) {
      case "YOUTUBE_SEARCH":
        const yts = require("yt-search");
        let video = await yts(args.join(" "));
        video = { all: video.all.filter((v:any) => v.type === "video") };
        if (video.all.length === 0) {
          if (!NoMessage && !options.interaction)
            reply({ content: `Cannot find song **${args.join(" ")}** ` });
          if (!NoMessage && interaction)
            reply({
              content: `Cannot find song **${args.join(" ")}** `,
              ephemeral: true,
            });
          return;
        }
        song = new Song(video.all[0], SEARCH_TYPE);
        break;
      case "YOUTUBE_SONG":
        let data = args[0]
        if (!data)
          return !options.interaction
            ? reply({ content: `Invalid youtube URL!`, embeds: [] })
            : reply({ content: "Error", ephemeral: true });
        song = new Song(data, SEARCH_TYPE);
        break;
      case `SPOTIFY_TRACK`:
        song = new Song(await getPreview(args[0]), SEARCH_TYPE);
        break;
      case "SPOTIFY_PLAYLIST":
        // client.error(data)
        song = new Song(await getTracks(args[0]), SEARCH_TYPE);
        break;
      default:
        !interaction
          ? reply(
              "idk what song i just recived so uh " +
                SEARCH_TYPE +
                " does not exist"
            )
          : reply({
              content:
                "idk what song i just recived so uh " +
                SEARCH_TYPE +
                " does not exist",
              ephemeral: true,
            });
    }

    if (!serverQueue) {
      let queueContruct = {
        songs: [],
        voiceChannel: voiceChannel,
        textChannel: message.channel,
        player: null,
        playing: true,
        connection: null,
        volume: 5,
      };
      // console.log(song.other)
//      message.client.error(song);
//@ts-ignore      
message.client.queue.set(message.guild.id, queueContruct);
      if (Array.isArray(song?.songs)) {
        //@ts-ignore
        await song.fetch().then(() => message.client.error(song.songs[0]));
        //@ts-ignore
        let origonalsong:any = new Array(song.songs)[0];
        //@ts-ignore
        song.songs.slice(1).forEach((s) => {
          s.type = "SPOTIFY_PLAYLIST_TRACK";
         //@ts-ignore
          queueContruct.songs?.push(s);
        });
        reply({ 
          embeds: [{
            //@ts-ignore
            title: `Enquing ${song.songs.length} tracks...`,
            color: 0x111
          }]
        });
        origonalsong.type = "SPOTIFY_PLAYLIST_TRACK";
       //@ts-ignore
        message.client.error(origonalsong);
        song = origonalsong;
      //@ts-ignore
      } else queueContruct.songs.push(song);
      try {
        var connection = joinVoiceChannel({
          //@ts-ignore
          channelId: message.member.voice.channel.id,
         //@ts-ignore
          guildId: message.member.guild.id,
         //@ts-ignore
          adapterCreator: message.member.guild.voiceAdapterCreator,
        });
        // console.log(connection)
        queueContruct.connection = connection;
        //@ts-ignore
        if (message.member?.voice?.channel.type === "GUILD_STAGE_VOICE") {
          setTimeout(() => {
            //@ts-ignore
            message.guild.me.voice.setSuppressed(false).catch((err) => {
             //@ts-ignore
              message.client.error(err);
              //@ts-ignore
              message.guild.me.voice.setRequestToSpeak(true);
              !interaction
                ? reply("Faild to set as speaking request send.")
                : 
                //@ts-ignore
                message.followUp({
                    content: "Faild to set request as speaking",
                  });
            });
          }, 2000);
        }
        reply("Starting Testssss");
        //@ts-ignore
        options.reply = reply;
        Music.play(message, queueContruct.songs[0], options);
      } catch (err) {
        //@ts-ignore
        message.client.error(err);
        if (queueContruct.connection) {
          //@ts-ignore
          queueContruct.connection.destroy();
        }
        //  message.client.queue.delete(message.guild.id);
      //@ts-ignore
        return reply(err.message);
      }
    } else {
      //@ts-ignore
      serverQueue?.songs?.push(song);
      return reply(
        `${song ? song.title : "BAD_SONG_REQUEST"} has been added to the queue!`
      );
    }
  }
  static findType(query:any, type?:any) {
    let reg =
      /(?:https:\/\/open\.spotify\.com\/|spotify:)(?:.+)?(track|playlist|album)[\/:]([A-Za-z0-9]+)/;
    if (query.match(reg)?.[1]?.toUpperCase() === "PLAYLIST")
      return "SPOTIFY_PLAYLIST";
    if (query.match(reg)?.[1]?.toUpperCase() === "TRACK")
      return "SPOTIFY_TRACK";
    if (query.match(reg)?.[1]?.toUpperCase() === "ALBUM")
      return "SPOTIFY_ALBUM";
    if (/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/.test(query))
      return "YOUTUBE_SONG";
    return "YOUTUBE_SEARCH";

    // return url.match(this.Regex)?.[1]?.toUpperCase() === type
  }
  skip(message:Message | CommandInteraction,serverQueue:Map<string, any>, interaction:any) {
   //@ts-ignore
    if(interaction) message.deferReply()
    const reply = (msg:any) => {
      if (interaction)
      //@ts-ignore  
      return message.deferred
          ? 
          //@ts-ignore
          message.editReply(msg)
          : 
          //@ts-ignore
          message.followUp(msg);
          //@ts-ignore
      return message.channel.send(msg);
    };
    //@ts-ignore
    if (!message.member.voice.channel)
      return reply("You have to be in a voice channel to stop the music!");
    if (!serverQueue) return reply("There is no song that I could skip!");
   //@ts-ignore
    serverQueue.songs[0].looped = false;
    //@ts-ignore
    serverQueue.songs[0].skipped = true;
    //@ts-ignore
    serverQueue.player.stop();
  }
//@ts-ignore
  stop(message, serverQueue, interaction = false) {
    interaction ? message.deferReply() : null
    const reply = (msg:any) => {
      if (interaction)
        return message.deferred
          ? message.editReply(msg)
          : message.followUp(msg);
      return message.channel.send(msg);
    };
    if (!message.member.voice.channel)
      return reply("You have to be in a voice channel to stop the music!");

    if (!serverQueue) return reply("There is no song that I could stop!");
    reply("The queue has ended!");
    serverQueue.songs = [];
    if (serverQueue.connection) {
      serverQueue.connection.destroy();
      serverQueue.connection = null;
      serverQueue.player = null;
      serverQueue.playing = false;
    }
    message.client.queue.delete(message.guild.id);
  }
//@ts-ignore
  static async play(message, song, ops) {
    if (!ops) ops = {};
    let { NoMessage, interaction, reply } = ops;
    const guild = message.guild;
    const send = reply;
    const serverQueue = message.client.queue.get(guild.id);

    if (!song) {
      serverQueue.connection.destroy();
      message.client.queue.delete(guild.id);
      send(" the queue has ended!");
      return;
    }
    if (song.type === "SPOTIFY_PLAYLIST_TRACK") {
      const songdata =  await yts(song.external_urls.spotify)
    message.client.error(songdata.videos[0])
    message.client.error(!songdata.videos[0])
      if(!songdata.videos[0]) {
        message.client.error('Bad thingy')
      song = null
      message.client.queue.get(guild.id).player.emit(AudioPlayerStatus.Idle)
      return;
    }
      song.url = songdata.videos[0].url
    }
    const player = createAudioPlayer();
    // if(Array.isArray(song.songs)) {
    //   let origonalsong = new Array(song.songs)[0]
    //   song.songs.slice(1).forEach(s => serverQueue.songs?.push(s))
    // song = origonalsong
    // }
    const data = await ytdl(song.url, { filter: "audioonly" });
    let resource = createAudioResource(data, {
      inputType: StreamType.Arbitrary,
    });

    let date = Date.now();
    player.on(AudioPlayerStatus.Idle, () => {
      if (1000 > Date.now() - date) return;
    //  message.reply(`IDLE ${Date.now() - date}`);
      // console.log(serverQueue.songs[0]);

      if (serverQueue.songs[0].looped && !serverQueue.songs[0].skipped)
        return Music.play(message, serverQueue.songs[0], {
          interaction: ops.interaction,
          NoMessage: true,
          reply: ops.reply,
        });

      serverQueue.songs.shift();
      Music.play(message, serverQueue.songs[0], ops);
    });
    //@ts-ignore
    player.on("error", (error:any) => message.client.error(error.message));
    // dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.player = player;
    // message.client.error(dispatcher)
    serverQueue.connection.on(VoiceConnectionStatus.Playing, () => {
      message.client.error("The audio player has started playing!");
    });
    serverQueue.connection.subscribe(player);
    player.play(resource);
    if (!NoMessage) {
      send(`Start playing: **${song.title || song.name}**`);
    }
  }
}
module.exports.Music = Music;
