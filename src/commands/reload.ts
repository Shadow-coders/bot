import { Shadow, Message } from '../client'
import { Command } from '../util/commands'
export default {
  name: "reload",
  execute(message:Message, args:String[], client:Shadow) {
    if (!client.devs?.some((dev) => dev === message.author.id)) return;
//
message.reply('Pending')
}
};
