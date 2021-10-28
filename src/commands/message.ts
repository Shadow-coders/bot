import Discord, {
  Client,
  Message,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import cooldown from "../models/cooldown";
import profileModel from "../models/casino";
import Xp from "../models/Xp";
import modmail from "../models/modmail";
import { Shadow, User } from "../client";
import { Command } from "../util/commands";
let fetched = new Set();
let messages: any = {};
async function hil(message: any, client: any) {
  //      if(message.channel.messages.cache.toJSON().slice(message.channel.messages.cache.toJSON().length - 10,message.channel.messages.cache.toJSON().length).some(m => m.author.id === message.author.id)) return client.error('Weridness cus ' + message.author.id + ' evaluted to ' + message.channel.messages.cache.some(m => m.author.id === message.author.id));
  message.guild?.members.cache.forEach(async (member: any) => {
    let { user } = member;

    const words = (await client.db.get("hil_" + user.id)) || [];
    // client.error(words)
    if (!words.some((w: any) => message.content.includes(w))) return;
    const embed = new Discord.MessageEmbed()
      .setDescription(
        message.channel.messages.cache
          .map(
            (m: any) =>
              `\`${m.createdAt.toString().slice(0, 15)}\` **${
                m.author.username
              }**: ${m.content} \n`
          )
          .slice(
            message.channel.messages.cache.size - 5,
            message.channel.messages.cache.size
          )
          .join("\n")
      )
      .setColor("GREEN")
      .addField("Message link", `[Jump to message](${message.url})`, true)
      .setAuthor(user.tag, user.displayAvatarURL())
      .setTimestamp()
      .setURL(message.url);
    user.send({
      embeds: [embed],
      content: `in ${message.guild?.name} ${
        message.channel
      } you were highlighted by the word \'${words.find((w: any) =>
        message.content.includes(w)
      )}\' `,
    });
  });
}

export default [
  {
    name: "messageCreate",
    once: false,
    type: "event",
    /**
     *
     * @param {Message} message
     * @param {Client} client
     * @returns
     */
    async execute(message: Message, client: Shadow) {
      async function dmsOpen(user: User) {
        const c = await user.send("").catch((e: any) => e.code);
        return c === 50007 ? false : true;
      }
      if (!message.guild) return;
      if (message.channel.partial) message.channel.fetch();

      if (!client.storage.fetched.channels[message.channel.id]) {
        client.storage.fetched.channels[message.channel.id] =
          message.channel.messages.fetch().then((m) => m.size);
      }
      const cacheMsgs = client.cache;
      let MyStickyChannelID = await client.db.get(
        "stickychannels_" + message.guild.id
      );
      async function remove(id: any) {
        const msg = message.channel.messages.cache.get(id);
        cacheMsgs.shift();
        if (msg) await msg.delete().catch((_e: any) => {});
        if (!MyStickyChannelID) MyStickyChannelID = [];
      }
      async function sticky() {
        if (message.author.bot) return;
        if (MyStickyChannelID.some((ch: any) => message.channel.id === ch)) {
          let StickyMessage = await client.db.get(
            "stickymessage_" + message.channel.id
          );
          // if length is more or 2 but not 0 then queue delete all and return without a message
          if (cacheMsgs.length >= 4 && cacheMsgs.length !== 0)
            return cacheMsgs.forEach(async (id: any) => remove(id));
          // if cache is more then 0 then queue delete all AND send a message
          // if (cacheMsgs.length > 0) {
          //   cacheMsgs.forEach(async id => await remove(id));
          // }
          // Send message and add to cache
          // console.log(cacheMsgs)
          const m = await message.channel.send(
            StickyMessage.replace("{user}", message.author.toString())
          );

          return cacheMsgs.push(m.id);
        }
      }
      if (MyStickyChannelID) {
        sticky();
      }
      // check channel is the sticky channel
      // console.log(message.content)
      let prefix =
        (await client.db.get("prefix_" + message.guild.id)) ||
        client.config?.prefix;
      /*
if(!fetched.has(message.guild.id)) {
  message.guild.members.fetch()
  fetched.add(message.guild.id, true)
} */
      if (!prefix) {
        prefix = client.config?.prefix;
      }

      if (!message.content.startsWith(prefix) || message.author.bot) return;
      let profile;
      await profileModel
        .findOne({ userID: message.author.id })
        .lean({ defaults: true })
        .then(async (d: any) => {
          if (!d) {
            profile = await profileModel.create({
              userID: message.author.id,
              serverID: message.guild?.id,
              coins: 1000,
              bank: 0,
            });
            profile.save();
          } else profile = d;
        });
      //@ts-ignore
      message.author.casino = profile;
      //@ts-ignore
      message.casino = { model: profileModel };

      const args = message.content.slice(prefix.length).trim().split(/ +/);
      let cmd: String | undefined = args?.shift()?.toLowerCase();
      const validPermissions = [
        "CREATE_INSTANT_INVITE",
        "KICK_MEMBERS",
        "BAN_MEMBERS",
        "ADMINISTRATOR",
        "MANAGE_CHANNELS",
        "MANAGE_GUILD",
        "ADD_REACTIONS",
        "VIEW_AUDIT_LOG",
        "PRIORITY_SPEAKER",
        "STREAM",
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "SEND_TTS_MESSAGES",
        "MANAGE_MESSAGES",
        "EMBED_LINKS",
        "ATTACH_FILES",
        "READ_MESSAGE_HISTORY",
        "MENTION_EVERYONE",
        "USE_EXTERNAL_EMOJIS",
        "VIEW_GUILD_INSIGHTS",
        "CONNECT",
        "SPEAK",
        "MUTE_MEMBERS",
        "DEAFEN_MEMBERS",
        "MOVE_MEMBERS",
        "USE_VAD",
        "CHANGE_NICKNAME",
        "MANAGE_NICKNAMES",
        "MANAGE_ROLES",
        "MANAGE_WEBHOOKS",
        "MANAGE_EMOJIS",
      ];

      let error;
      let errordms;
      error = new Discord.MessageEmbed()
        .setTitle("um.")
        .setDescription("The command " + cmd + " does not exist")
        .setColor("#ff0000")
        .setTimestamp();
      errordms = new Discord.MessageEmbed()
        .setTitle("um.")
        .setDescription("dms = no commands sir")
        .setColor("#ff0000")
        .setTimestamp();
      if (
        !client.commands.find((c: any) => c?.name === cmd)
          ? !client.commands.find((c: any) => c?.aliases?.includes(cmd))
          : null
      ) {
        if (cmd === "") return;
        console.log(client.commands.has(client.aliases.get(cmd)));
        message.channel
          .send({ embeds: [error] })
          .catch((e) => {
            return message.channel.send(
              "Hey! the command " + cmd + " is not a command!"
            );
          })
          .then((m) => {
            setTimeout(() => m.delete(), 3e5);
          });
        return;
      }

      if (message.channel.type === "DM")
        return message.reply({ embeds: [errordms] });
      const command: Command =
        client.commands.find((c: any) => c.name === cmd) ||
        client.commands.find(
          (c: any) => c?.aliases.some((ali: any) => ali === cmd).name
        );
      // cmd =
      //   client.commands.find((c:any) => c.name === cmd) ||
      //   client.commands.find((c:any) => c?.aliases.some((ali:any) => ali === cmd).name);
      if (command.permissions && Array.isArray(command.permissions)) {
        let invalidPerms: String[] = [];
        for (const perm of command.permissions) {
          if (!validPermissions.includes(`${perm}`)) {
            return client.error
              ? client.error(
                  `Invalid Permissions ${perm} for command ${command.name}`
                )
              : null;
          }
          if (!message.member?.permissions.has(`${perm}`)) {
            invalidPerms.push(perm);
          }
        }
        if (invalidPerms.length > 0) {
          return message.channel.send(
            `Missing Permissions: \`${invalidPerms.join("``")}\``
          );
        }
      }
      function commandExecute() {
        try {
          command.execute(message, args, client);
        } catch (error) {
          // console.error(error);
          client.error ? client.error(error) : null;
          message.channel.send(
            "ERROR! report this to the dev with an id of `" +
              `
              ${Date.now() * client.errorCount}` +
              "`"
          );
        }
      }
      if (command.cooldown) {
        const current_time = Date.now();
        const cooldown_amount = command.cooldown * 1000;

        cooldown.findOne(
          { userId: message.author.id, cmd: command.name },
          async (err?: any, data?: any) => {
            if (data) {
              const expiration_time = data.time + cooldown_amount;

              if (current_time < expiration_time) {
                const time_left: any = (expiration_time - current_time) / 1000;

                if (time_left.toFixed(1) >= 3600) {
                  let hour: any = time_left.toFixed(1) / 3600;
                  return message.reply(
                    `Please wait ${parseInt(hour)} more hours before using \`${
                      command.name
                    }\`!`
                  );
                }
                if (time_left.toFixed(1) >= 60) {
                  let minute: any = time_left.toFixed(1) / 60;
                  return message.reply(
                    `Please wait ${parseInt(
                      minute
                    )} more minutes before using \`${command.name}\`!`
                  );
                }
                let seconds: any = time_left.toFixed(1);
                return message.reply(
                  `Please wait ${parseInt(
                    seconds
                  )} more seconds before using \`${command.name}\`!`
                );
              } else {
                await cooldown.findOneAndUpdate(
                  { userId: message.author.id, cmd: command.name },
                  { time: current_time }
                );
                commandExecute();
              }
            } else {
              commandExecute();
              new cooldown({
                userId: message.author.id,
                cmd: command.name,
                time: current_time,
                cooldown: command.cooldown,
              }).save();
            }
          }
        );
      } else commandExecute();
    },
  },
  {
    name: "messageCreate",
    once: false,
    type: "event",
    async execute(message: Message, client: Shadow) {
      if (message.author.bot) return;
      if (message.channel.type === "DM") return;
      if (!(await client.db.get("automod_" + message.guild?.id))) return;
      !messages[message.author.id]
        ? (messages[message.author.id] = 1)
        : messages[message.author.id]++;
      setTimeout(
        () => (messages[message.author.id] = messages[message.author.id] - 1),
        1500
      );
      let automod = await client.db.get("automod_" + message.guild?.id);
      function ban(member: any) {
        (client.channels.cache?.get(automod.channel) as TextChannel)?.send({
          embeds: [
            new Discord.MessageEmbed()
              .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .setDescription(
                `**Banned:** ${message.author} \n **Reason:**\n Automod Violations 1`
              )
              .setColor("RED")
              .setTimestamp()
              .setFooter(`ID: ${message.author.id}`),
          ],
        });
        message.author.send({
          embeds: [
            new Discord.MessageEmbed()
              .setTitle("BAnned")
              .setDescription(
                "You were banned in " +
                  message.guild?.name +
                  " for automod violations"
              ),
          ],
        });
        member.ban({ reason: "AUTOMOD Violation: bad Language" });
      }
      async function mute(member: any, message: Message) {
        let role = await client.db.get("muterole_" + message.guild?.id);
        member.roles.add(await client.db.get("muterole_" + message.guild?.id));
        message.channel
          .send(`${message.author}, you cant send bad words!`)
          .then((m) => {
            setTimeout(() => {
              m.delete();
            }, 3 * 1000);
            setTimeout(() => member.roles.remove(role), 60 * 2 * 1000 * 60);
          });
      }
      if (!automod.words) automod.words = [];
      for (const word of automod.words) {
        const isOver = () => {
          if (word.text === "ass") {
            word.text =
              !message.content === word.text ? `${word.text} ` : word.text;
          }
          return true;
        };
        if (isOver() && message.content.includes(word.text)) {
          switch (word.pen) {
            case "ban":
              ban(message.member);
            case "delete":
              message.delete();
              break;
            case "delete&warn":
              message.delete().then(() => {
                message.channel
                  .send("No bad words " + `<@${message.author.id}>`)
                  .then((m) =>
                    setTimeout(() => {
                      m.delete();
                    }, 25 * 100)
                  );
              });
              break;
            case "mute":
              mute(message.member, message);
              break;
            default:
              message
                .delete()
                .then(() =>
                  message.channel.send(
                    `${message.author}, no saying bad words!`
                  )
                );
              break;
          }
        }
      }
      if (automod.spam) {
        if (
          message.content.length > (automod.spam.length || 200) ||
          messages[message.author.id] > 10
        ) {
          message.delete();
          message.channel.send("sPAM");
        }
      }
    },
  },
  {
    name: "messageCreate",
    once: false,
    type: "event",
    async execute(message: Message, client: Shadow) {
      if (message.author.bot || !message.guild) return;
      let gdata = await client.db.get("xpsystem_" + message.guild?.id);
      if (!gdata) return;
      let addXP = Math.floor(Math.random() * 10); //when i type addXP it will randomly choose a number between 1-10   [  Math.floor(Math.random() * 10)  ]
      let data = await Xp.findOne({
        guildId: message.guild.id,
        userId: message.author.id,
      })
      let add: any = {};
      // console.log(addXP, data?.xp+addXP)
      if (!data)
        return new Xp({
          userId: message.author.id,
          guildId: message.guild.id,
        }).save();
      add.xp = (data.xp + addXP) * (data.bonus || 1);
      add.level = data.level;
      add.reqxp = data.reqxp;
      if (data.xp > data.reqxp) {
        add.xp -= add.reqxp;
        add.reqxp *= 2;
        add.reqxp = Math.floor(add.reqxp);
        add.level += 1; // e
        const embed = new MessageEmbed()
          .setTitle("Level")
          .setDescription("You are now level " + add.level + "!")
          .setColor("RANDOM")
          .setTimestamp();
        message.reply({ embeds: [embed] });
      }
      await Xp.findOneAndUpdate(
        { guildId: message.guild.id, userId: message.author.id },
        add
      );
    },
  },
  {
    name: "messageCreate",
    type: "event",
    async execute(m: any, client: Shadow) {
      const userData = await modmail
        .findOne({ ch: m.channel.id })
        .lean({ defaults: true });
      if (!userData) return;
      if (m.author.bot) return;
      // client.error(userData)
      let channel = client.users.cache.get(userData.user);
      //client.error(channel)
      if (m.channel.id) {
        channel?.send({
          embeds: [
            new MessageEmbed()
              .setDescription(m.content)
              .setAuthor(
                m.author.tag,
                m.author.displayAvatarURL({ dynamic: true })
              )
              .setColor("GREEN")
              .setFooter(m.id)
              .setTimestamp(),
          ],
        });
      }
    },
  },
  {
    name: "messageCreate",
    type: "event",
    execute: hil,
  },
];
