import { MessageEmbed, Message } from "discord.js"
export default [
  {
    name: "coinflip",
    aliases: ["cf"],
    description: "flips a coin!",
    execute: async (message:Message, args:String[], client:any) => {
      let m = await message.channel.send({
        embeds: [new MessageEmbed().setTimestamp().setTitle("Fliping coin...")],
      });
      let number = Math.floor(Math.random() * 2);
      if (number == 1) {
        let hembed = new MessageEmbed()
          .setTitle("Coinflip!")
          .setDescription(`You flipped Heads!`)
          .setThumbnail(
            "https://media.discordapp.net/attachments/873990902648033313/874045545428181022/3865572.png?width=497&height=497"
          );

        m.edit({ embeds: [hembed] });
      } else {
        let tembed = new MessageEmbed()
          .setTitle("Coinflip!")
          .setDescription(`You flipped Tails!`)
          .setThumbnail(
            "https://media.discordapp.net/attachments/873990902648033313/874045763527782450/3865514.png?width=497&height=497"
          );

        m.edit({ embeds: [tembed] });
      }
    },
  },
];
