import { Message, CommandInteraction, Shadow, Guild } from "../../client" 
import { create, fetch } from 'discord-backup'
import { Command } from '../../util/commands'
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

    if(!message.member?.permissions.has('MANAGE_GUILD')) return 


   await create((message.guild as Guild), {
        saveImages: 'base64',
backupID: `${ID}_${message.guild?.id}`,
jsonSave: true,
maxMessagesPerChannel: 100,
jsonBeautify: true,
doNotBackup: []
    }).then((backup:any) => {
        message.reply(`Created backup \`${backup.id.split('_')[0]}\``)
    }, (err:any) => {
        client.error ? client.error(err) :null
        message.reply(err.message || "ERROR!! " + err)
    })
}
},
{
name: ops.name, 
descripton: ops.description,
aliases: ops.aliases,
type: 'slash', 
async execute(interaction:CommandInteraction,cmd:string,args:any[],client:Shadow) {
    
}
}
]