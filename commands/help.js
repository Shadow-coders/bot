const { MessageButton } = require('discord-buttons');
const { MessageEmbed } = require('discord.js')
const commands = async function(client, message, min, max) { 
if(!min) min = 0
if(!max) max = 10
if(typeof max !== 'number' || typeof min !== 'number') return 'NaN';
let prefix = client.db.get('prefix_' + message.guild.id) || '!!'

try {
const res = client.commands.map(cmd => `\`${prefix + cmd.name}\` ${cmd.description || "None"} \n Usage: ${prefix}${cmd.usage || 'None'}` ).slice(min, max).join('\n') 
return res;
} catch (err) { return 'None' }

module.exports = {
    name: 'help',
    async execute(message, args, client)  {
const page1c = await commands(client, message, 0, 10)
const page2c = await commands(client, message, 10, 20)       
 const BasePaginator = require('discord-paginator.js')
const page1 = new MessageEmbed()
	.setTitle('Page 1')
.setDescription(page1c)
.setColor('#ff0000')
.setTimestamp();

const page2 = new MessageEmbed()
	.setTitle('Some title')
	.setDescription(page2c);
const pages = [page1, page2] //return foo at the first page, and bar at the second page

// const Paginator = new BasePaginator({
   // pages: pages, //the pages
   // timeout: 120000,//the timeout for the reaction collector ended (in ms)
    // page: 'Page {current}/{total}', //Show the page counter to the message
    // filter: (reaction, user) => user.id == message.author.id //to filter the reaction collector
// })

// Paginator.spawn(message.channel) //to spawn the paginator to specific text channel
let page = 1
const emojis = ['▶️', '◀️', '🔄']
const msg = await message.channel.send(page1)   
msg.react(emojis[1])
msg.react(emojis[0])
msg.react(emojis[2])
 client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
 if(user.id !== message.author.id) return;
            if (reaction.message.channel.id == message.channel.id) {
                if (reaction.emoji.name === emojis[0]) {
switch(page) {
  case 1:
page = 2
 msg.edit(pages[1])  
 break;
  case 2:
page = 1
msg.edit(pages[0])    
break;
    default: 
break;
}
                }
   if (reaction.emoji.name === emojis[1]) {
                  switch(page) {
  case 2:
page = 1
 msg.edit(pages[0])  
 break;
  case 1:
page = 2
msg.edit(pages[1])    
break;
    default: 
break;
}           
}
            } else return;
        });
}
}
