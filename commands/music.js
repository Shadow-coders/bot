
const ytdl = require('ytdl-core')
const { joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, NoSubscriberBehavior, } = require('@discordjs/voice')
function changeVol(message, serverQueue, args) {
    message.channel.send("set volume to " + parseInt(args));
    serverQueue.volume = parseInt(args);
      serverQueue.connection.dispatcher.setVolumeLogarithmic(parseInt(args[0]) / 5)
};

async function execute(message, serverQueue, args) {

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }
    const yts = require( 'yt-search' )
const video = await yts(args[0])
if(video.all.length === 0) {
message.channel.send({ content: `Cannot find song **${args[0]}** ` })
return;
}
  const songInfo = video.all[0]
  const song = {
        title: songInfo.title,
        url: songInfo.url,
other: songInfo
   };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };
console.log(song.other)
    message.client.queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.member.guild.id,
        adapterCreator: message.member.guild.voiceAdapterCreator,
    })
      queueContruct.connection = connection;
      play(message, queueContruct.songs[0]);
    } catch (err) {
      message.client.error(err);
      message.client.queue.delete(message.guild.id);
      return message.channel.send(err.message);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
    
  if (!serverQueue)
    return message.channel.send("There is no song that I could stop!");
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
if(serverQueue.voiceChannel) {
serverQueue.voiceChannel.leave()
}
message.channel.send(' the queue has ended!')
}

function play(message, song) {
const guild = message.guild  
const serverQueue = message.client.queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    message.client.queue.delete(guild.id);
message.channel.send(' the queue has ended!')
    return;
  }

  const dispatcher = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
    },
  })
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(message, serverQueue.songs[0]);
    })
    .on("error", error => client.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  connection.on(VoiceConnectionStatus.Playing, () => {
    console.log('The audio player has started playing!');
  });
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

module.exports = [{
name: 'play',
execute(message, args, client) {
const serverQueue = client.queue.get(message.guild.id);
    execute(message, serverQueue, args);
return;
}
},
{
  name: 'pause',
  aliases: ['pa'],
  execute(message,args,client) {
    const server_queue = client.queue.get(message.guild.id)
    if(!server_queue) return message.channel.send('There is no queue')
    if(server_queue.connection.dispatcher.paused) return message.channel.send("Song is already paused!");//Checks if the song is already paused.
    server_queue.connection.dispatcher.pause();//If the song isn't paused this will pause it.
    message.channel.send("Paused the song!");//Sends a message to the channel the command was used in after it pauses.
  }
},
{
  name: 'resume',
  aliases: ['r', 'unpause'],
  description: "Resume the song if any",
  execute(message,args,client) {
    const server_queue = client.queue.get(message.guild.id)
    if(!server_queue) return message.channel.send('There is no queue')
    if(!server_queue.connection.dispatcher.paused) return message.channel.send("Song isn't paused!");//Checks if the song isn't paused.
    server_queue.connection.dispatcher.resume();//If the song is paused this will unpause it.
    message.channel.send("Unpaused the song!");//Sends a message to the channel the command was used in after it unpauses.
  }
},
{ 
name: 'skip', 
execute(message, args, client) {
const serverQueue = client.queue.get(message.guild.id);
if(!serverQueue) return message.channel.send('There is no song playing!')
skip(message, serverQueue);
    return; 
}
}, {
name:'stop',
execute(message, args, client) {
const serverQueue = client.queue.get(message.guild.id);
if(!serverQueue) return message.channel.send('There is no song to stop')
stop(message, serverQueue);
    return;  
}
}, {
name: 'queue',
aliases: ['q'],
execute(message, args, client) {
const queue = client.queue.get(message.guild.id).songs.map(song => `${song.title}`).slice(0, 10).join('\n')
if(!queue) return message.channel.send('There is no song playing') 
message.channel.send(queue).catch(client.error)
}
},
{
    name: 'volume',
    execute(message, args, client) {
       const serverQueue = client.queue.get(message.guild.id);
       if(!serverQueue) return message.channel.send('There is no queue!');
       const missingArgs = async function(query) { 
         switch(query) {
           case 1: 
            message.channel.send('Missing volume argument!')
            break;
            case 2: 
             message.channel.send('The volume argument is not a number!')
             break;
             default:
               message.channel.send('Missing something!')
               break;
         }
       }
       if(!args[0]) return missingArgs(1)
       if(NaN(args[0])) return missingArgs(2)
       changeVol(message, serverQueue, args);
    }
}]