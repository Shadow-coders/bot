let map = require("../models/modmail.js");
let {
  MessageEmbed,
  Message,
  Client,
  MessageAttachment,
  Guild,
  MessageActionRow,
  MessageButton,
  Interaction,
} = require("discord.js");
function getname(i) {
  const get_number = (ind) => {
    switch (ind) {
      case 1:
        return "one";
        break;
      case 2:
        return "two";
        break;
      case 3:
        return "three";
        break;
      case 4:
        return "four";
        break;
      case 5:
        return "five";
        break;
      case 6:
        return "six";
        break;
      case 7:
        return "seven";
        break;
      case 8:
        return "eight";
        break;
      case 9:
        return "nine";
        break;
      case 0:
        return "zero";
    }
  };
  let res = [];

  i.toString()
    .split("")
    .forEach((index) => {
      res.push(get_number(parseInt(index)));
    });
  return res.join("::");
}

/**
 *
 * @param {Message} message
 * @param {Client} client
 * @param {String[]} args
 * @returns {Guild|Object}
 */
async function fetchGuild(message, client, args) {
 return new Promise((res,rej) => {
   client.error('fetchguild:modmail')
  let indexComp = 0;
  let embedIndex = 0;
  // let guildDataComp = client.guilds.cache
  //   .filter(async (g) => {
  //     return (
  //       (await client.db.get("modmail_" + g.id)) &&
  //       g.members.cache.get(message.author.id)
  //     );
  //   })
  //   .map((g, i) => {
  //     //console.log(g,i)
  //     //client.error(i)
  //     indexComp++;
  //     return new MessageButton()
  //       .setCustomId(g.id)
  //       .setLabel(`${indexComp}`)
  //       .setStyle("PRIMARY");
  //   });
  try {
  const row = new MessageActionRow();
  client.guilds.cache.forEach(async (g, i) => {
    //console.log(g,i)
    //client.error(i)

    const part1 = g.members.cache.get(message.author.id);
    const part2 = await client.db.get("modmail_" + g.id);
    if (!(part1 && part2)) return;
    indexComp++;
    row.addComponents(
      new MessageButton()
        .setCustomId(g.id)
        .setLabel(`${indexComp}`)
        .setStyle(g.available ? "PRIMARY" : "DANGER")
    );
  });
  // console.log(data_row_1.length)
  // client.error(row.components).catch(e => console.error(row.components))
  let embedRes = [];
  client.guilds.cache.forEach(async (g, i) => {
    const part1 = g.members.cache.get(message.author.id);
    const part2 = await client.db.get("modmail_" + g.id);
    if (!(part1 && part2)) return;
    embedIndex++;
    embedRes.push(
      ` (${embedIndex}) - [${g.name}](https://discord.com/channels/${g.id})`
    );
  });
  await require('util').promisify(setTimeout)(100)
  client.error(embedRes)
  let embed = new MessageEmbed()
    .setAuthor(client.user.tag, client.user.displayAvatarURL())
    .setTitle("Choose a guild")
    .setDescription(embedRes.join("\n"));
  indexComp = 0;
  const row_2 = new MessageActionRow();
  const row_2_data = [];
  //console.log(g,i)
  //client.error(i)

  // const part1 = g.members.cache.get(message.author.id)
  // const part2 =  await client.db.get("modmail_" + g.id)
  // if(!part1 && part2) return null;
  for (const g of client.guilds.cache.toJSON()) {
    const part1 = g.members.cache.get(message.author.id);
    const part2 = await client.db.get("modmail_" + g.id);
    if (!(part1 && part2)) continue;
    indexComp++;
    row_2.addComponents(
      new MessageButton()
        .setCustomId(g.id)
        .setLabel(`${indexComp}`)
        .setStyle(g.available ? "PRIMARY" : "DANGER")
    );
  }
  // client.error(row_2_data)
  //  console.log(row_2_data.length, row_2_data)
  //row_2.setComponents(row_2_data);

  const row2 = new MessageActionRow().addComponents(
    new MessageButton()
      .setLabel("Next")
      .setStyle(row.length < 10 ? "SECONDARY" :"PRIMARY")
      .setCustomId("next_modmail")
      .setDisabled(row.length < 10),
    new MessageButton()
      .setLabel("Back")
      .setStyle("SECONDARY")
      .setDisabled(true)
      .setCustomId("back_modmail")
  );
  client.error(
row.components.slice(0,5).length,
row_2.components.slice(5,10) .length)
  client.error(`row2 ${row2.components.length} row_2: ${row_2.components.length} row1: ${row.components.length} \nembeds ${embedRes.length}`)
  message.channel.send("re");
  let components = []
  components.push(row)
  if(row_2.components.length > 5) components.push(row_2)
components.push(row2)
  message.channel
    .send({
      components,
      embeds: [embed],
      content: `Choose a Guild`,
    })
    .catch(client.error)
    .then(async (m) => {
      const collecter = await m.createMessageComponentCollector({
        filter: (i) => i,
        time: 60 * 1000 * 5,
      });
      collecter.on("collect", (i) => {
        const cmd = i.customId;
        if (cmd === "back_modmail") {
        }
        if (cmd === "next_modmail") {
        }
  //      i.deferReply();
        client.error(i.message.components, '[ORIGNAL/COMPONETS]')
        const comp = []
        i.message.components.forEach((c) => {
         const co = new MessageActionRow()
       //   client.error(c)
          c.components.forEach((b) => {
            b.disabled = true;
            if (b.customId === cmd) b.style = "SECONDARY";
            client.error(b)
            co.addComponents(new MessageButton().setCustomId(b.customId).setStyle(b.style).setDisabled(b.disabled).setLabel(b.label))
          })
          comp.push(co)
        });
        client.error(comp, '[COMPONETS]')
    //    i.message.reply('WORK MY GUY')
        i.message.edit({
          components: comp,
          embeds: [
            {
              title: "Loading guild...",
              description: "...",
              color: i.message.embeds[0].color,
            },
          ],
        });
        res(cmd);
      });
      collecter.on('end', collected => {
        if(collected.size === 0) rej(null)
      })
      
    });
  } catch (E) {
    client.error(E)
  }
 })
}
/**
 *
 * @param {Message} message
 * @param {Client} client
 * @returns
 */
async function start(message, client, args) {
  client.error('Start:modmail')
  let g = await fetchGuild(message, client, args);
  if (!typeof g === "object") return message.reply("no g, got " + g);
  let chp = await client.db.get(`modmail_${g}`);
  if (!chp) return;
  let guild = client.guilds.cache.get(g);
  let perms = [
    { id: guild.id, deny: ["VIEW_CHANNEL"] },
    { id: client.user.id, allow: ["SEND_MESSAGES", "EMBED_LINKS"] },
  ];
  let roles = chp.roles;
  if (Array.isArray(roles) && roles.some((r) => typeof r === "STRING")) {
    for (const role of roles) {
      perms.push({ id: role, allow: ["VIEW_CHANNEL", "SEND_MESSAGES"] });
    }
  }
  let ch = await guild.channels.create(message.author.tag, {
    reason: `[MODMAIL] new session with ${message.author.tag}`,
    permissionOverwrites: perms,
  });
  ch.setParent(chp.id).catch((e) => {
    client.error(e);
    message.reply(
      "error making channel modmail! deleteing... send this error to the devs \n " +
        Buffer.from(e.message, "utf8").toString("base64")
    );
    ch.delete();
  });
  if (!(await map.exists({ user: message.author.id }))) {
    new map({
      g: g,
      user: message.author.id,
      ch: ch.id,
    }).save();
  } else {
    map.findOne({ user: message.author.id }).then((d) => d.remove());
    new map({
      g,
      user: message.author.id,
      ch: ch.id,
    }).save();
  }
  message.channel.send("Starting session");
  ch.send("SESSION WITH " + message.author.username);
  client.on("messageCreate", (m) => {
    if (m.author.bot) return;
    if (m.channel.id === ch.id) {
      message.channel.send({
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
  });
}
/**
 *
 * @param {Message} message
 * @param {Client} client
 * @returns
 */
module.exports = async (message, client) => {
  if (message.author.bot) return;
  client.error('index:modmail')
  let args = message.content.slice("").trim().split(/ +/);
  let cmd = args.shift();
  if (cmd === "close") {
    message.reply("Ending");
    client.channels.cache
      .get(await map.findOne({ user: message.author.id }).ch)
      .send("closing.. in 3 secs")
      .then((ms) => {
        setTimeout(() => ms.channel.delete(), 3000);
      });
    map.findOne({ user: message.author.id }).then((mm) => mm.remove());
  } else {
    let user = await map.findOne({ user: message.author.id });
    if (!user) return start(message, client, args);
    let attachments = [];
    if (message.attachments) {
      message.attachments.forEach((att) => {
        attachments.push(new MessageAttachment(att.attachment, att.name));
      });
    }
    // console.log(user.ch)
    let ch = await client.channels.cache.fetch(user.ch);
    if (!ch)
      return message
        .reply("the channel has been deleted or not found! deleting session..")
        .then((m) => {
          map.FindOneAndRemove({ user: message.author.id });
        });
    ch.send({
      embeds: [
        new MessageEmbed()
          .setAuthor(
            message.author.tag,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setDescription(
            message.content +
              `\n ${attachments
                .map((att) => `[attachment/${att.name}]`)
                .join("\n")}`
          )
          .setTimestamp()
          .setFooter(message.id)
          .setColor("GREEN"),
      ],
      files: attachments,
    }).catch(client.error);
  }
};
