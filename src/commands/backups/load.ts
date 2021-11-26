import { Shadow, Message, MessageEmbed, Command, MessageAttachment} from '../../client';
import { load, fetch } from 'discord-backup';
import { readFileSync } from 'fs'
let Video = new MessageAttachment(readFileSync(process.cwd() + '/src/util/Role.mp4'), 'role.mp4')
export default { 
name: 'backup-load',
execute: async (message:Message,args:string[], client: Shadow) => {
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

message.react('✅')
load(args[0], message.guild).then(() => {
    message.author.send(`Done Backing up ${message.guild?.name}!`)
}, (err:any) => {
message.author.send('ERROR\n' + err.message)
client.error ? client.error(err) : null
})
}
} as  Command