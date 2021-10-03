/*const { MessageEmbed } = require('discord.js')
export default [{
name: "emojiCreate",
async execute(emoji, client) {
const ch = client.channels.cache.get(await client.db.get('emojilogs_' + emoji.guild.id))
if(!ch) return;
const embed = new MessageEmbed()
.setTitle('new emoji')
.setDescription(`${emoji.name} was created here in this guild`)
.addField('Animated', `${emoji.animated}`, true)
.setColor('YELLOW')
.addField('ID', emoji.id, true)
.setTimestamp()
.setThumbnail(`https://cdn.discordapp.com/emojis/${emoji.id}${emoji.animated ? '.gif' : '.png'}`)

ch.send({ embeds: [embed] })
},
type: 'event'
}, {
name: "emojiDelete",
async execute(emoji, client) {
const ch = client.channels.cache.get(await client.db.get('emojilogs_' + emoji.guild.id))
if(!ch) return;
const embed = new MessageEmbed()
.setTitle('emoji deleted')
.setDescription(`${emoji.name} was **Deleted** here in this guild`)
.addField('Animated', `${emoji.animated}`, true)
.setColor('RED')
.addField('ID', emoji.id, true)
.setTimestamp()
// .setThumbnail(`https://cdn.discordapp.com/emojis/${emoji.id}${emoji.animated ? '.gif' : '.png'}`)

ch.send({ embeds: [embed] })
},
type: 'event'
}, {
name: 'emojiUpdate',
execute(oemoji, nemoji, client) {
console.log(oemoji)
    
    const ch = client.channels.cache.get(await client.db.get('emojilogs_' + nemoji.guild.id))
if(!ch) return;
    if(nemoji.deleted) return;
const embed =  new MessageEmbed()
.setTitle('Emoji update')

if(nemoji.animated && !oemoji.animated) {
embed.addField('Animated', `yes`, true)
} 
if(!nemoji.animated && oemoji.animated) embed.addField('Animated', `no`, true)
if(nemoji.name !== oemoji.name) embed.addField('Name', '**Old Name**: ' + oemoji.name + `\n **New Name**: ${nemoji.name}`)
ch.send({ embeds: [embed] })
},
    type: "event"
}]
*/
const { MessageEmbed } = require("discord.js");
export default [
  {
    name: "emojiCreate",
    async execute(emoji, client) {
      console.dir(1);
      const ch = client.channels.cache.get(
        await client.db.get("emojilogs_" + emoji.guild.id)
      );
      if (!ch) return;
      const embed = new MessageEmbed()
        .setTitle("new emoji")
        .setDescription(`${emoji.name} was created here in this guild`)
        .addField("Animated", `${emoji.animated}`, true)
        .setColor("YELLOW")
        .addField("ID", emoji.id, true)
        .setTimestamp()
        .setThumbnail(
          `https://cdn.discordapp.com/emojis/${emoji.id}${
            emoji.animated ? ".gif" : ".png"
          }`
        );

      ch.send({ embeds: [embed] });
    },
    type: "event",
  },
  {
    name: "emojiDelete",
    async execute(emoji, client) {
      console.log("emojiDelete");
      const ch = client.channels.cache.get(
        await client.db.get("emojilogs_" + emoji.guild.id)
      );
      if (!ch) return;
      const embed = new MessageEmbed()
        .setTitle("emoji deleted")
        .setDescription(`${emoji.name} was **Deleted** here in this guild`)
        .addField("Animated", `${emoji.animated}`, true)
        .setColor("RED")
        .addField("ID", emoji.id, true)
        .setTimestamp();

      ch.send({ embeds: [embed] });
    },
    type: "event",
  },
  {
    name: "emojiUpdate",
    async execute(oemoji, nemoji, client) {
      console.log("emojiUpdate");
      const ch = client.channels.cache.get(
        await client.db.get("emojilogs_" + nemoji.guild.id)
      );
      if (!ch) return;
      const embed = new MessageEmbed().setTitle("Emoji update");

      if (nemoji.animated && !oemoji.animated) {
        embed.addField("Animated", `yes`, true);
      }
      if (!nemoji.animated && oemoji.animated)
        embed.addField("Animated", `no`, true);
      if (nemoji.name !== oemoji.name)
        embed.addField(
          "Name",
          "**Old Name**: " + oemoji.name + `\n **New Name**: ${nemoji.name}`
        );
      ch.send({ embeds: [embed] });
    },
    type: "event",
  },
];
