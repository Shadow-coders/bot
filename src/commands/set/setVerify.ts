import { Message, Shadow, MessageEmbed, Command } from "../../client";
export default {
  name: "verify",
  catagory: "set",
  async execute(message: Message, args: string[], client: Shadow) {
    if (
      !message.guild?.me?.permissions.has("MANAGE_ROLES") ||
      !message.guild.me.permissions.has("SEND_MESSAGES")
    )
      return message.reply("Missing Permissions\n");
  },
} as Command;
