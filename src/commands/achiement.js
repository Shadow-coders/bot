const Discord = require("discord.js")

module.exports = {
  name : "achivement",
  description : "Your standard Minecraft achievement cmd ⛏️", // Oh yeah

  async execute(message,client,args) {
   const sentence = args.join("+")
       let sntnce = message.content
    sntnce.shift();
    sntnce = sntnce.join(' ');
    if (!sentence) return message.channel.send('Please specify a query.');
    let embed = new Discord.MessageEmbed()
      .setTitle('Achievement unlocked!')
      .setImage(`https://api.cool-img-api.ml/achievement?text=${sentence}`)
      .setColor('RANDOM')
      .setFooter(' ');
    message.channel.send({ embeds: [embed] })
  }
  }