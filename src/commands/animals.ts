import { Message, Shadow, MessageEmbed } from '../client'
export default [
    {
        name: 'cat',
        execute: async (message: Message, args: String[], client: Shadow) => {
            //@ts-ignore
const url = client.fetch('https://api.shitapi.ga/animals/cat').then(res => res.json()).then((d) => d.cat)
message.reply({
    embeds: [
        new MessageEmbed()
        .setTitle('Cat image')
        .setColor('RANDOM')
        .setImage(url)
        .setTimestamp()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
    ]
});        

}
    }
]