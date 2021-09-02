
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')
const commands = async function(client, message, min, max) { 
if(!min) {
min = 0
}
if(!max) {
max = 10
}
if(typeof max !== 'number' || typeof min !== 'number') return 'NaN';
let prefix = await client.db.get('prefix_' + message.guild.id) || '!!'

try {
const res = client.commands.map(cmd => `\`${prefix + cmd.name}\` ${cmd.description || "None"} \n Usage: ${prefix + cmd.usage || 'None'}` ).slice(min, max).join('\n') 
return res;
} catch (err) {
client.error(err, '[HELP_COMMAND_MENU]')
return 'None';

}
}
module.exports = [{
    name: 'help',
    async execute(message, args, client)  {
const page1c = await commands(client, message, 0, 10)
const page2c = await commands(client, message, 10, 20)       
const page1 = new MessageEmbed()
	.setTitle('Page 1')
.setDescription(page1c)
.setColor('#ff0000')
.setTimestamp();

const page2 = new MessageEmbed()
	.setTitle('Some title')
	.setDescription(page2c);
// [page1, page2, new MessageEmbed().setTitle("page 3").setDescription(await commands(client, message, 20, 30))]
let pages = [] //return foo at the first page, and bar at the second page
let last = 0
for(var i = 0; 101 > i;i++) {
if(!i.toString().endsWith('0')) continue;
if(i === 0) continue;
let info = await commands(client, message, last, i)
let embed = new MessageEmbed()
.setTitle("Page " + (i+1).toString())
.setDescription(info)
.setColor("RANDOM")
.setTimestamp()
.setFooter(`Page ${i.toString().slice(0,1)}/${(client.commands.size / 10).toString().slice(0, 1)}`)
.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
pages.push(embed)
last = i
}
// const Paginator = new BasePaginator({
   // pages: pages, //the pages
   // timeout: 120000,//the timeout for the reaction collector ended (in ms)
    // page: 'Page {current}/{total}', //Show the page counter to the message
    // filter: (reaction, user) => user.id == message.author.id //to filter the reaction collector
// })

// Paginator.spawn(message.channel) //to spawn the paginator to specific text channel
/*
new MessageSelectMenu()
					.setCustomId('help_select')
					.setPlaceholder('No page selected')
					.addOptions([
						{
							label: 'Reset',
							description: 'Back to main page',
							value: 'reset',
						},
						{
							label: 'page 1',
							description: 'The first list of commands',
							value: '0',
						},
{
label: "Page 2",
description: "Commands 10 to 20",
value: '1'
},
						{
							label: 'page 3',
							description: 'Commands 20 to 30',
							value: '2',
						},
					
]),
			)]}
*/
let page = 0
const msg = await message.channel.send({ content: "Select a  page", components: [new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('help_select')
					.setPlaceholder('No page selected')
					.addOptions([
						{
							label: 'Reset',
							description: 'Back to main page',
							value: 'reset',
						}
])
.addOptions(pages.map((p, i) => {
return { label: p.title.slice(0,6), description: p.footer.text, value: i.toString() }
})),
			)]})   
const filter = i => i.user.id === message.author.id && i.customId === 'help_select';

const collector = message.channel.createMessageComponentCollector({ filter, time: 1000 * 60 * 60 });

collector.on('collect', async i => {
if(i.values[0] === 'reset') return i.update({ content: "Select a  page", embeds: [] })   
if(i.values[0] === 'delete') { 
i.message.delete()
collector.end()
return;
}
 i.update({ content: "Page " + i.values[0]+1, embeds: [pages[i.values[0]]]})
});
collector.on("end", col => {
msg.edit({ content: `Help menu closed, used ${col.size} times`, embeds: [], componets: [] })
})

 }
}]
