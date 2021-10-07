// CLIENT INTERFACE
import Discord, { Client } from 'discord.js'
//@ts-ignore i dont have it on some files while editing
import { Config } from './server'
import Fetch from 'node-fetch'
export interface Shadow extends Client {
db?: any
error?: Function
cache?: any,
storage?: any
config?: Config
commands?: any
slash_commands?: any
aliases?: any
errorCount?: any
debug?: any
util?: any
Util?: Discord.Util
events?: any
awaited_commands?: any
dab?: any
commandsM?:any
queue?:any
vars?:any
package?: Object
files?: String[]
logger?: any
fetch?: Function
shutdown?: Function
devs?: Array<String>,
catagory?: any[]
}
export interface User extends Discord.User {
casino: any
}
export * from 'discord.js'