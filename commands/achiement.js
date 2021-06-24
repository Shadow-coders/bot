const Discord = require("discord.js")

module.exports = {
  name : "achivement",
  description : "Your standard Minecraft achievement cmd ⛏️", // Oh yeah

  async execute(client , message , args) {
   const sentence = args.join("+")
       let sntnce = message.content.split(' ');
    sntnce.shift();
    sntnce = sntnce.join(' ');
    if (!sentence) return message.inlineReply('Please specify a query.', { allowedMentions: { repliedUser: false } });
    let embed = new Discord.MessageEmbed()
      .setTitle('Achievement unlocked!')
      .setImage(`https://api.cool-img-api.ml/achievement?text=${sentence}`)
      .setColor('RANDOM')
      .setFooter(' ');
    message.channel.send(embed)
  }
  }