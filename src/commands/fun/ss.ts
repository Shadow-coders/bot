import {
  Shadow,
  Message,
  MessageEmbed,
  CommandInteraction,
} from "../../client";
export default [
  {
    name: "ss",
    execute: async (message: Message, args: String[], client: Shadow) => {
      let url = args[0];
      if (!url)
        return message.reply(
          "You need to provide a url!\nlike `https://shadow-bot.dev`"
        );
      if (!url.startsWith("http"))
        return message.reply("You need to provide a a valid URL");
      url = encodeURI(url as string);
      const time = Date.now();
      const msg = await message.reply("Fetching data from `" + url + "`");
      //@ts-ignore
      const link = await client
        .fetch(
          `https://api.apiflash.com/v1/urltoimage?access_key=${client.config?.ss_key}&format=png&no_ads=true&no_cookie_banners=true&no_tracking=true&response_type=json&url=${url}`
        )
        .then((res: any) => res.json())
        .then((data: any) => data.url);
      //@ts-ignore
      //client.error(link + '\n' + url)
      msg.edit({
        embeds: [
          new MessageEmbed()
            .setAuthor(
              message.author.tag,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setImage(link)
            .setTitle("Requested Screenshot!")
            .setDescription(`[link](${url})`)
            .setURL(url as string)
            .setTimestamp(),
        ],
        content: `Took ${Date.now() - time}ms to download photo`,
      });
    },
  },
];
