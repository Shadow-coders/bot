const fs = require("fs");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, EndBehaviorType, VoiceConnection, StreamType, AudioPlayerStatus } = require('@discordjs/voice')
module.exports = {
    name: 'record',
    async execute(message,args,client) {
        if(client.queue.get(message.guild.id)) return message.reply('Im playing music')
        if(message.guild.me.voice.channel) return message.reply('Im already in a channel')
const player = createAudioPlayer()
/**
 * @returns {VoiceConnection}
 */
const connection = joinVoiceChannel({ selfDeaf: false, channelId: message.member?.voice.channel.id, guildId: message.guild.id, adapterCreator: message.guild.adapterCreator })
const stream = voiceConnection.receiver.subscribe(message.author.id, {
    end: {
      behavior: EndBehaviorType.AfterSilence,
      duration: 10000,
    },
  });

  const resource = createAudioResource(stream, { inputType: StreamType.Opus }); 
  connection.subscribe(player)
  player.play(resource)
  player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy()
  })
    }
}