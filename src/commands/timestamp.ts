import { Shadow,  Message} from '../client'
export default {
    name: 'timestamp',
    async execute(message: Message, args: string[], client:Shadow) {
const timestamp = Math.round(Date.now() / 1000);
const time = args.join(' ').replace(/{time}/, timestamp.toString())
const res = require('mathjs').evaluate(time)
message.reply(`<t:${time}>\n${time}`)
    }
}