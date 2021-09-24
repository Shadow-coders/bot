const Xp = require("../models/Xp");
const Canvas = require("discord-canvas"),
  Discord = require("discord.js");
module.exports = [
  {
    name: "rank",
    async execute(message, args, client) {
      const Canvas = require("discord-canvas"),
        Discord = require("discord.js");
      let user =
        message.mentions.users.first() ||
        message.guild.members.cache.get(args[0])?.user;
      if (!user) user = message.author;
      let data = await Xp.findOne({
        userId: user.id,
        guildId: message.guild.id,
      });
      let pos = await Xp.find({ guildId: message.guild.id });
      const image = new Canvas.RankCard()
        .setAvatar(user.displayAvatarURL({ format: "png" }))
        .setXP("current", data.xp)
        .setXP("needed", data.reqxp)
        .setLevel(data.level)
        .setRank(
          pos
            .map((d, i) => {
              if (d.userId === user.id) return i + 1;
              return undefined;
            })
            .find((d) => typeof d === "number")
        )
        .setUsername(user.tag)
        .setBackground(
          "https://media.istockphoto.com/photos/neon-background-abstract-blue-and-pink-with-light-shapes-line-picture-id1191658515?b=1&k=20&m=1191658515&s=170667a&w=0&h=cS0xPQx1SaV6awUuT62L1MFTNB68Bz7WtAiXkEpfUN4="
        )
        .toAttachment()
        .then((d) => {
          const attachment = new Discord.MessageAttachment(
            d.toBuffer(),
            "rank-card.png"
          );

          message.reply({ files: [attachment] });
        });
    },
  },
  {
    name: "lb-xp",
    description: "The leaderboard of the guilds Xp system",
    async execute(message, args, client) {
      let lb = await Xp.find({ guildId: message.guild.id });
      if (!lb) return message.reply("No xp sytem found!");
      if (lb)
        lb = await lb.map((inf, i) => {
          i = i + 1;
          let USER = client.users.cache.get(inf.userId); // .catch(e => {})
          if (!USER) USER = {};
          let { username, tag } = USER;
          return `text${i}=${encodeURIComponent(username)}+-+level:+${
            inf.level
          }+${inf.xp}/${inf.reqxp}+(xp/reqxp)`;
        });
      client.error("https://api.berk404.ga/leaderboard?" + lb.join("&"));
      let whileindex = 0;
      while (lb.length < 10) {
        whileindex++;
        lb.push(`text${whileindex}=`);
      }
      const data = await client
        .fetch("https://api.berk404.ga/leaderboard?" + lb.join("&"))
        .then((res) => res.buffer());
      if (!data) {
        client.error("Data null?");
        message.reply("No data!! api down");
      }
      message.reply({
        files: [new Discord.MessageAttachment(data, "leaderboard.png")],
        content: "Leaderboard for " + message.guild.name,
      });
    },
  },
];
