import { Shadow, Message, CommandInteraction, GuildMember, MessageEmbed } from '../client'
export default [
  {
    name: "ban",
    description: "Ban a person",
    usage: "<prefix>ban [user]",
    async execute(message: Message, args: String[], client: Shadow) {
      const error = function (text: any) {
        if (typeof text !== "string") {
          text = text.toString();
        }
        message.channel.send(text);
      };
      if (!message.member?.permissions.has("BAN_MEMBERS"))
        return message.channel.send("Invalid Permissions");
      let User =
        //@ts-ignore
        message.guild?.members.cache.get(
          message.mentions.users.first()
          //@ts-ignore
            ? message.mentions.users.first().id
            : ""
        ) ||
        //@ts-ignore
        message.guild?.members.cache.get(args[0] ? args[0] : "");
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
      }).catch((e: any) => (client.error ? client.error(e) : null));
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
    name: 'ban',
    type: 'slash',
    async execute(interaction:CommandInteraction, cmd: string, args:any[], client: Shadow): Promise<any>{
        //@ts-ignore
        if(!(interaction.member?.permissions.has("BAN_MEMBERS"))) return interaction.reply({ ephemeral: true, content: `You do not have the perms you need`});
        const target = (interaction.options.getMember("target") as GuildMember)
        const reason = interaction.options.getString("reason") || "No Reason Provided";
        const timeStamp = Math.floor(Date.now() / 1000)
        let fullReason; 
        //@ts-ignore
        if(target?.roles.highest.position  >= interaction.member.roles.highest.position) return interaction.reply({ ephemeral: true, content: `This user has higher or the same highest role as you\n> meaning you cannot ban them`});
        if(target.id === (interaction.member as GuildMember)?.id) return interaction.reply({ ephemeral: true, content: `You cannot ban yourself!`});
        if(target.id === interaction.guild?.ownerId) return interaction.reply({ ephemeral: true, content: `You cannot ban the owner!`});
        if(!(target.kickable)) return interaction.reply({ ephemeral: true, content: `For some reason i cannot Kick this user`})
    await interaction.deferReply();
    await target.send({
     embeds: [new MessageEmbed()
        .setTitle("Banned!")
        .setDescription(`> When: <t:${timeStamp}:R> \n> Why: ${reason}\n Server: **${interaction.guild?.name}**`)
        .setColor("RED")
        .setTimestamp()
        .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
    ] 
    }).catch(e => new Promise((resolve, reject) => { resolve({}) }))
    fullReason = `${reason}\nexecuted by ${interaction.user.tag} (${interaction.user.id})`
    await target.ban({ reason: fullReason, days: 1 });
    await interaction.editReply(`**Banned ${target.user.toString()}**`)
    
    }
    }
];
