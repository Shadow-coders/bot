const { MessageEmbed, MessageAttachment } = require("discord.js");
let f = require("node-fetch");
let key = require("../server").shitapikey;
module.exports = [
  {
    name: "anigif",
    async execute(message, args, client) {
      let options = [
        "hug",
        "run",
        "nervous",
        "kiss",
        "happy",
        "slap",
        "hi",
        "punch",
      ];
      let option = args[0];
      let res = await require("node-fetch")(
        `https://shit-api.ml/random/anime/${option}?key=${key}`
      ).then((res) => res.json());
      let filler = options.filter((f) => f.startsWith(option.slice(0, 1)));
      if (!options.includes(option))
        return message.channel.send(
          " Invalid option" + filler ? `, ${filler[0]}.` : "."
        );
      let embed = new MessageEmbed()
        .setTitle("Animiea " + option)
        .setImage(res.image)
        .setColor("RANDOM");
      message.reply({ embeds: [embed] });
    },
  },
  {
    name: "chatbot",
    async execute(message, args, client) {
      let res = await f(
        `https://shit-api.ml/misc/chatbot?key=${key}&text=${args.join(
          "%20"
        )}&gender=male&name=${message.author.username}`
      ).then((r) => r.json());
      message.reply(res.message);
    },
  },
  {
    name: "biden",
    async execute(message, args, client) {
      // let res = await f(`https://shit-api.ml/imagegen/biden?key=${key}`)
      let embed = new MessageAttachment(
        `https://shit-api.ml/imagegen/biden?key=${key}&text=${args.join(
          "%20"
        )}`,
        "biden.png"
      );
      client.error(
        `https://shit-api.ml/imagegen/biden?key=${key}&text=${args.join("%20")}`
      );
      message.reply({ files: [embed] });
    },
  },
];
