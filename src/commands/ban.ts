
import { CommandInteraction } from 'discord.js';
import { Message, Shadow } from '../client'
export default [
  {
    name: "ban",
    description: "Ban a person",
    usage: "<prefix>ban [user]",
    async execute(message:Message, args:String[], client:Shadow) {
      const error = function (text:any) {
        if (typeof text !== "string") {
          text = text.toString();
        }
        message.channel.send(text);
      };
      if (!message.member?.permissions.has("BAN_MEMBERS"))
        return message.channel.send("Invalid Permissions");
      let User =
      //@ts-ignore
        message.guild?.members.cache.get(message.mentions.users.first() ? message.mentions.users.first().id : '') ||
     //@ts-ignore
        message.guild?.members.cache.get(args[0] ? args[0] : '');
      let user = User;
      if (!User) return message.channel.send("Invalid User");
      if (user?.id === client.user?.id || user?.id === message.guild?.ownerId)
        return error("Higher perms | user is me or the owner");
      //    if (User.permissions.has("BAN_MEMBERS") && !User.roles.highest.position > message.guild.members.resolve(message.author).roles.highest.position && message.author.id !== message.guild.owner.id) return message.reply(" both are = ")
      //if(User.roles.highest.position > message.guild.members.resolve(client.user).roles.highest.position)
      //  return message.channel.send("My highest role is lower than the mentioned user's role");
      //if(User.roles.highest.position > message.guild.members.resolve(message.author).roles.highest.position && message.author.id !== message.guild.owner.id)
      // return message.channel.send(":x: this user has a higher role then you!");
      let banReason = args.slice(1).join(" ");
      if (!banReason) {
        banReason = "None provided by ";
      }
      User.send("You were banned for a reason of " + banReason).catch((e) => {
        error(e.message);
      });
      message.channel.send(
        "Banned " + User.user.username + " for a reason of " + banReason
      );
      User.ban({
        reason: banReason + ` ${message.author.tag} (${message.author.id})`,
      }).catch((e:any) => client.error ? client.error(e) : null);
      const id = Date.now() * client.errorCount;
      client.db.push("cases_" + user?.id, {
        type: "ban",
        description: banReason,
        author: message.author,
        id: id,
      });
      client.db.set(`case_${id}_${User.id}`, {
        type: "ban",
        description: banReason,
        author: message.author,
        banid: id,
      });
    },
  },
  {
    type: "slash",
    name: "ban",
    description: "ban someone",
    usage: "ban <user> [reason]",
    options: [
      {
        name: "user",
        type: "USER",
        description: "User to ban",
        required: true,
      },
      {
        name: "reason",
        type: "STRING",
        description: "the reason for this ban",
      },
    ],
    async execute(interaction:CommandInteraction, cmd:String, args:any[], client:Shadow) {
      return interaction.reply("Not done");
    },
  },
];
