const Discord = require("discord.js");
const fetch = require("node-fetch");
export default [
  {
    name: "transalate",
    async execute(message, args, client) {
      const bot = client;
      const embed1 = new Discord.MessageEmbed()
        .setDescription("❌ **| Please provide a text to translate**")
        .setFooter("Made with <3 by Vansh")
        .setColor("RED");
      if (!args[0]) return message.channel.send({ embeds: [embed1] });

      const embed2 = new Discord.MessageEmbed()
        .setDescription("**Please Wait....**")
        .setColor("YELLOW")
        .setFooter("Made with <3 by Vansh");

      if (args.length > 1)
        fetch(
          `https://translate-api.ml/translate?text=${encodeURIComponent(
            args.join(" ")
          )}&lang=${encodeURIComponent(args[0])}`
        )
          .then((data) => data.json())
          .then((body) => {
            const embed3 = new Discord.MessageEmbed()
              .setDescription(
                `**Translated Text: ${body.translated.text}** \n\n**Language Code: ${body.translated.lang}** \n\n**Pronunciation: ${body.translated.pronunciation}** \n\n**Similar: ${body.translated.similars}**`,
                true
              )
              .setFooter("Made with <3 by Vansh")
              .setColor("GREEN");

            message.channel.send({ embedsa: [embed2] }).then((msg) => {
              setTimeout(function () {
                msg.edit({ embeds: [embed3] });
              }, 2e3);
            });
          });
    },
  },
];
