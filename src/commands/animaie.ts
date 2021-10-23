import Scraper from "mal-scraper";
import { Shadow, MessageEmbed, Message } from "../client";
const Color = `RANDOM`;

export default [
  {
  name: "anime",
  category: "info",
  description: "Anime Information!",
  usage: "Anime <Name>",
  execute: async (message: Message, args: String[], client: Shadow) => {
    //Start

    let Text = args.join(" ");

    if (!Text)
      return message.channel.send(`What anime do you want to search for?`);

    if (Text.length > 200) return message.channel.send(`Text Limit - 200`);

    let Msg = await message.channel.send(`Now searching for that anime.`);
//eslint-ignore
    let Replaced = Text.replace(/ /g, " ");

    let Anime;

    let Embed;

    try {
      Anime = await Scraper.getInfoFromName(Replaced);

      if (!Anime.genres[0] || Anime.genres[0] === null)
        Anime.genres[0] = "None";

      Embed = new MessageEmbed()
        .setColor(Color)
        .setURL(Anime.url)
        .setTitle(Anime.title)
        .setDescription(Anime.synopsis)
        .addField(`Type`, Anime.type, true)
        .addField(`Status`, Anime.status, true)
        .addField(`Premiered`, Anime.premiered, true)
        .addField(`Episodes`, Anime.episodes, true)
        .addField(`Duration`, Anime.duration, true)
        .addField(`Popularity`, Anime.popularity, true)
        .addField(`Genres`, Anime.genres.join(", "))
        .setThumbnail(Anime.picture)
        .setFooter(`Score - ${Anime.score}`)
        .setTimestamp();
      Msg.edit({ embeds: [Embed] });
    } catch (error) {
      return Msg.edit(`No anime found from that search.`);
    }

    return Msg.edit({ embeds: [Embed] });

    //End
  },
},
{
name: 'happy',
catagory: 'anime',
async execute(message: Message, args: String[], client: Shadow) {
    
}
}
];
