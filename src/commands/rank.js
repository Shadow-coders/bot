const Xp = require('../models/Xp');
module.exports = [{
    name: 'rank',
    async execute(message, args, client) {
        const Canvas = require("discord-canvas"),
  Discord = require("discord.js");
  let user = message.mentions.users.first() || message.guild.members.cache.get(args[0])?.user
  if(!user) user = message.author
 let data = await Xp.findOne({ userId: user.id, guildId: message.guild.id })
 let pos = await Xp.find({ guildId: message.guild.id })
const image = new Canvas.RankCard()
.setAvatar(user.displayAvatarURL({ format: 'png' }))    
.setXP("current", data.xp)
    .setXP("needed", data.reqxp)
    .setLevel(data.level)
    .setRank(pos.map((d,i) => {
        if(d.userId === user.id) return i === 0 ? 1 : i;
        return undefined;
    }).find(d =>  typeof d === 'number'))
    .setUsername(message.author.tag)
.setBackground('https://media.istockphoto.com/photos/neon-background-abstract-blue-and-pink-with-light-shapes-line-picture-id1191658515?b=1&k=20&m=1191658515&s=170667a&w=0&h=cS0xPQx1SaV6awUuT62L1MFTNB68Bz7WtAiXkEpfUN4=')
    .toAttachment().then(d => {
 
const attachment = new Discord.MessageAttachment(d.toBuffer(), "rank-card.png");
 
message.reply({ files: [attachment] });
})
    }
}]