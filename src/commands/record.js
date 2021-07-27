const fs = require("fs");
module.exports = {
    name: 'record',
    async execute(message,args,client) {
    const msg = await message.channel.send('start')
        const voicechannel = message.member.voice.id;
        if (!voicechannel) return message.channel.send("Please join a voice channel first!");
    msg.edit('2')
        const connection = await message.member.voice.channel.join();
        msg.edit('3')
        const receiver = connection.receiver.createStream(message.member, {
            mode: "pcm",
            end: "silence"
        })
        msg.edit('4')
    
        const writer = receiver.pipe(fs.createWriteStream(`./recordings/${message.author.id}.pcm`));
        msg.edit('5')
        writer.on("finish", () => {
            message.member.voice.channel.leave();
            message.channel.send("Finished writing audio");
            msg.edit('6')
        });
    }
}