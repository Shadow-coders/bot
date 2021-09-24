const Discord = require("discord.js");
const cooldown = require("../models/cooldown");
const profileModel = require("../models/casino");
const Xp = require("../models/Xp");
let { Client, Message, MessageEmbed } = require("discord.js");
let fetched = new Set();
let messages = {};
module.exports = [
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
    async execute(message, client) {
      if (!message.guild) return;
      if (message.channel.partial) message.channel.fetch();
      message.guild.members.cache
        .filter((m) => m.user.bot === false && m.user.id !== client.user.id)
        .forEach(async (member) => {
          let { user } = member;
          const words = (await client.db.get("hil_" + user.id)) || [];
          if (!words.some((w) => message.content.includes(w))) return;
          const embed = new Discord.MessageEmbed()
            .setDescription(
              message.channel.messages.cache
                .map(
                  (m) =>
                    `\`${m.createdAt.toString().slice(0, 15)}\` **${
                      m.author.username
                    }**: ${m.content} \n`
                )
                .slice(
                  message.channel.messages.cache.size - 5,
                  message.channel.messages.cache.size
                )
                .join("\n"),
              { long: true }
            )
            .setColor("GREEN")
            .addField("Message link", `[Jump to message](${message.url})`, true)
            .setAuthor(user.tag, user.displayAvatarURL())
            .setTimestamp()
            .setURL(message.url);
          user.send({
            embeds: [embed],
            content: `in ${message.guild.name} ${
              message.channel
            } you were highlighted by the word \'${words.find((w) =>
              message.content.includes(w)
            )}\' `,
          });
        });
      const cacheMsgs = client.cache;
      let MyStickyChannelID = await client.db.get(
        "stickychannels_" + message.guild.id
      );
      async function remove(id) {
        const msg = message.channel.messages.cache.get(id);
        cacheMsgs.shift();
        if (msg) await msg.delete().catch((_e) => {});
        if (!MyStickyChannelID) MyStickyChannelID = [];
      }
      async function sticky() {
        if (message.author.bot) return;
        if (MyStickyChannelID.some((ch) => message.channel.id === ch)) {
          let StickyMessage = await client.db.get(
            "stickymessage_" + message.channel.id
          );
          // if length is more or 2 but not 0 then queue delete all and return without a message
          if (cacheMsgs.length >= 4 && cacheMsgs.length !== 0)
            return cacheMsgs.forEach(async (id) => remove(id));
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
        client.config.prefix;
      /*
if(!fetched.has(message.guild.id)) {
  message.guild.members.fetch()
  fetched.add(message.guild.id, true)
} */
      if (!prefix) {
        prefix = client.config.prefix;
      }

      if (!message.content.startsWith(prefix) || message.author.bot) return;
      let profile;
      await profileModel
        .findOne({ userID: message.author.id })
        .then(async (d) => {
          if (!d) {
            profile = await profileModel.create({
              userID: message.member.id,
              serverID: message.member.guild.id,
              coins: 1000,
              bank: 0,
            });
            profile.save();
          } else profile = d;
        });
      message.author.casino = profile;
      message.casino = { model: profileModel };

      const args = message.content.slice(prefix.length).trim().split(/ +/);
      let cmd = args.shift().toLowerCase();
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
      error = new Discord.MessageEmbed()
        .setTitle("um.")
        .setDescription("The command " + cmd + " does not exist")
        .setColor("#ff0000" || client.config.color)
        .setTimestamp();
      error.dms = new Discord.MessageEmbed()
        .setTitle("um.")
        .setDescription("dms = no commands sir")
        .setColor("#ff0000" || client.config.color)
        .setTimestamp();
      if (
        !client.commands.find((c) => c?.name === cmd)
          ? !client.commands.has(client.aliases.get(cmd))
          : null
      ) {
        if (cmd === "") return;
        console.log(client.commands.has(client.aliases.get(cmd)));
        message.channel.send({ embeds: [error] }).catch((e) => {
          message.channel.send(
            "Hey! the command " + cmd + " is not a command!"
          );
        });
        return;
      }

      if (message.channel.type === "DM") return message.reply(error.dms);
      cmd =
        client.commands.find((c) => c.name === cmd) ||
        client.commands.find((c) => c.aliases.some((ali) => ali === cmd).name);

      if (cmd.permissions && Array.isArray(cmd.permissions)) {
        let invalidPerms = [];
        for (const perm of cmd.permissions) {
          if (!validPermissions.includes(perm)) {
            return client.error(
              `Invalid Permissions ${perm} for command ${cmd.name}`
            );
          }
          if (!message.member.permissions.has(perm)) {
            invalidPerms.push(perm);
          }
        }
        if (invalidPerms > 0) {
          return message.channel.send(
            `Missing Permissions: \`${invalidPerms.join("``")}\``
          );
        }
      }
      function commandExecute() {
        try {
          cmd.execute(message, args, client);
        } catch (error) {
          // console.error(error);
          client.error(error);
          message.channel.send(
            "ERROR! report this to the dev with an id of `" +
              Date.now() * client.errorCount +
              "`"
          );
        }
      }
      let command = cmd;
      if (command.cooldown) {
        const current_time = Date.now();
        const cooldown_amount = command.cooldown * 1000;

        cooldown.findOne(
          { userId: message.author.id, cmd: command.name },
          async (err, data) => {
            if (data) {
              const expiration_time = data.time + cooldown_amount;

              if (current_time < expiration_time) {
                const time_left = (expiration_time - current_time) / 1000;

                if (time_left.toFixed(1) >= 3600) {
                  let hour = time_left.toFixed(1) / 3600;
                  return message.reply(
                    `Please wait ${parseInt(hour)} more hours before using \`${
                      command.name
                    }\`!`
                  );
                }
                if (time_left.toFixed(1) >= 60) {
                  let minute = time_left.toFixed(1) / 60;
                  return message.reply(
                    `Please wait ${parseInt(
                      minute
                    )} more minutes before using \`${command.name}\`!`
                  );
                }
                let seconds = time_left.toFixed(1);
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
    async execute(message, client) {
      if (message.author.bot) return;
      if (message.channel.type === "DM") return;
      if (message.channel.partial) await message.channel.fetch();
      if (!(await client.db.get("automod_" + message.guild.id))) return;
      !messages[message.author.id]
        ? (messages[message.author.id] = 1)
        : messages[message.author.id]++;
      setTimeout(
        () => (messages[message.author.id] = messages[message.author.id] - 1),
        1500
      );
      let automod = await client.db.get("automod_" + message.guild.id);
      function ban(member) {
        client.channels.cache.get(automod.channel).send({
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
                  message.guild.name +
                  " for automod violations"
              ),
          ],
        });
        member.ban({ reason: "AUTOMOD Violation: bad Language" });
      }
      async function mute(member, message) {
        let role = await client.db.get("muterole_" + message.guild.id);
        member.roles.add(await client.db.get("muterole_" + message.guild.id));
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
        function isOver() {
          if (word.text === "ass") {
            word.text =
              !message.content === word.text ? `${word.text} ` : word.text;
          }
          return true;
        }
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
    async execute(message, client) {
      if (message.author.bot || !message.guild) return;
      let gdata = await client.db.get("xpsystem_" + message.guild.id);
      if (!gdata) return;
      let addXP = Math.floor(Math.random() * 10); //when i type addXP it will randomly choose a number between 1-10   [  Math.floor(Math.random() * 10)  ]
      let data = await Xp.findOne({
        guildId: message.guild.id,
        userId: message.author.id,
      });
      let add = {};
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
];
