import { Command, Shadow, Message, MessageEmbed, MessageAttachment,  } from "../../client";
import { fetch,  } from 'discord-backup'
export default {
name: `backup-info`,
execute: async (message: Message, args: string[], client: Shadow) => {
   
    const error = (type:string) => {
        if(type == 'user') return message.reply(`Your missing Perms \`MANAGE_SERVER\``)
        if(type == 'me') return message.reply(`I am missing \`ADMINISTRATOR\` perms!\n i Need these perms to grab the roles, channels, bans, etc `)
    if(type == 'role') return message.reply({ content: `I am not the highest role in this server! Please make me have the highest role to grab the roles`, files: [/* Video */] })
    if(type == 'args') return message.reply({ content: 'You are missing the argument \`BACKUP_ID\`!'})

if(type == '404') return message.reply({ content: 'Cannot find Backup `' + args[0] + '`'})

    return message.reply(`UNKOWEN_ERROR\n\`${require('util')(type)}\``)
    }
if(!message.guild?.me?.permissions.has("ADMINISTRATOR")) return error('me');
if(!message.member?.permissions.has('MANAGE_GUILD')) return error('user');
if(!args[0]) return error('args')
const info = await fetch(args[0])
if(!info) return error('404')
const embed = new MessageEmbed()
.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))

embed.setTitle(`Backup \`${args[0]}\` info `)
embed.addField(`Channels`, (info.data.channels.others.length  + info.data.channels.categories.length).toString())
embed.addField('Roles', info.data.roles.length.toString(), true)
embed.addField('Verification level', info.data.verificationLevel, true);
embed.addField('Emojis', info.data.emojis.length.toString(), true)
embed.setColor('RANDOM');
embed.setDescription(`
size: \`${info.size}\`
Created At: <t:${Math.round( info.data.createdTimestamp / 1000)}>
`)
embed.setThumbnail('attachment://icon.png')
const files = [new MessageAttachment(Buffer.from(info.data.iconBase64 as string, 'base64'), 'icon.png')]
message.reply({ files, embeds: [embed] })
}
} as Command