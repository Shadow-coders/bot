const {joinVoiceChannel } = require('@discordjs/voice')
module.exports = {
name: "join",
aliases: ['j'],
description: "Joins a voice or stage channel",
usage: "join",
async execute(message,args,client) {
if(message.member.voice.channel.type !== 'GUILD_STAGE_VOICE') {
joinVoiceChannel({
    channelId: message.member.voice.channel.id,
    guildId: message.member.voice.channel.guild.id,
    adapterCreator: message.member.voice.channel.guild.voiceAdapterCreator,
});
return message.channel.send(`Joined channel: ${message.member.voice.channel}`)
}
let connection;
try {
 connection = await joinVoiceChannel({
    channelId: message.member.voice.channel.id,
    guildId: message.member.voice.channel.guild.id,
    adapterCreator: message.member.voice.channel.guild.voiceAdapterCreator,
});

} finally {
// client.queue.set(message.guild.id, { connection, })
message.channel.send('Joined stage channel: ' + message.member.voice.channel.name).then(m => setTimeout(() => {
message.guild.me.voice.setSuppressed(false).catch(err => {
client.error(err)
message.guild.me.voice.setRequestToSpeak(true);
m.reply("Faild to set as speaking request send.")
})
}, 3000))
}
}
}