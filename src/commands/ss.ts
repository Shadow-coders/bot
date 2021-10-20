import { Shadow, Message, MessageEmbed, CommandInteraction} from '../client'
export default [{
name: 'ss',
execute: async (message: Message, args: String[], client: Shadow) => {
let url = args[0];
if(!url) return message.reply("You need to provide a url!\nlike `https://shadow-bot.dev`");
if(!url.startsWith('http')) return message.reply("You need to provide a a vlid URL")
url = encodeURI((url as string));
const time = Date.now()
const msg = await message.reply("Fetching data from `" + url + "`")
const link = await client.fetch().then((res:any) => res.json()).then((data:any) => data.url)
msg.edit({ 
    embeds: [
        new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setImage(link)
        .setTitle('Requested Screenshot!')
        .setDescription(`[link](${link})`)
        .setTimestamp()
    ],
    content: `Took ${Date.now() - time}ms to download photo`
})
}
}]