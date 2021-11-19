import { Message, Shadow, MessageEmbed } from "../../client";
export default [
  {
    name: "cat",
    catagory: "basic",
    execute: async (message: Message, args: String[], client: Shadow) => {
      //@ts-ignore
      const url = await client
        .fetch("https://api.shitapi.ga/animals/cat")
        .then((res) => res.json())
        .then((d) => d.cat);
      message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Cat image")
            .setColor("RANDOM")
            .setImage(url)
            .setTimestamp()
            .setAuthor(
              message.author.tag,
              message.author.displayAvatarURL({ dynamic: true })
            ),
        ],
      });
    },
  },
  {
    name: "dog",
    catagory: "basic",
    execute: async (message: Message, args: String[], client: Shadow) => {
      //@ts-ignore
      const url = await client
        .fetch("https://api.shitapi.ga/animals/dog")
        .then((res) => res.json())
        .then((d) => d.dog);
      message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("dog image")
            .setColor("RANDOM")
            .setImage(url)
            .setTimestamp()
            .setAuthor(
              message.author.tag,
              message.author.displayAvatarURL({ dynamic: true })
            ),
        ],
      });
    },
  },
];
