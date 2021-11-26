import { Message, CommandInteraction, Shadow, Guild, MessageAttachment } from "../../client" 
import { create, list } from 'discord-backup'
import { Command } from '../../util/commands'
import { readFileSync } from 'fs'
let Video = new MessageAttachment(readFileSync(process.cwd() + '/src/util/Role.mp4'), 'role.mp4')
const ops = {
name: 'backup-create',
description: 'description',
aliases: []
}
export default [{
name: ops.name, 
descripton: ops.description,
aliases: ops.aliases,
type: 'command', 
async execute(message:Message,args:String[],client:Shadow) {
        let ID = 'B'
    if(message.guild?.id.startsWith('7')) ID += 'Z'
    if(message.guild?.id.startsWith('8')) ID += 'Y'
    if(message.guild?.id.startsWith('9')) ID += 'X'
    if(message.guild?.id.startsWith('6')) ID += 'W'
    if(message.guild?.id.startsWith('5')) ID += 'M'
    if(message.guild?.id.includes('5')) ID += 'E'
    ID += (Math.random() * 1000).toString().slice(0,3).replace('.', '0')
const error = (type:string) => {
    if(type == 'user') return message.reply(`Your missing Perms \`MANAGE_SERVER\``)
    if(type == 'me') return message.reply(`I am missing \`ADMINISTRATOR\` perms!\n i Need these perms to grab the roles, channels, bans, etc `)
if(type == 'role') return message.reply({ content: `I am not the highest role in this server! Please make me have the highest role to grab the roles`, files: [/* Video */] })
return message.reply(`UNKOWEN_ERROR\n\`${require('util')(type)}\``)
} 
if((await list()).filter((f) => f.endsWith(message.guild?.id || '')).length > 10) return error('max_backups')

if(!message.member?.permissions.has('MANAGE_GUILD')) return error('user');
if(!message.guild?.me?.permissions.has("ADMINISTRATOR")) return error('me');
if((message.guild.me.roles.highest.position !== message.guild.roles.highest.position)) return error('role');

const m = await message.reply("Creating backup `" + ID + '`!')
   await create((message.guild as Guild), {
        saveImages: 'base64',
backupID: `${ID}_${message.guild?.id}`,
jsonSave: true,
maxMessagesPerChannel: 100,
jsonBeautify: true,
doNotBackup: []
    }).then((backup:any) => {
        m.edit(`Created backup \`${backup.id.split('_')[0]}\``)
    }, (err:any) => {
        client.error ? client.error(err) :null
        m.edit(err.message || "ERROR!! " + err)
    })

}
},
{
name: ops.name, 
description: ops.description,
aliases: ops.aliases,
type: 'slash', 
async execute(interaction:CommandInteraction,cmd:string,args:any[],client:Shadow) {
    
}
}
] as Array<Command>