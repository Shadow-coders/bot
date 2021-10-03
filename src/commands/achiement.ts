import { MessageEmbed, Message, MessageReaction, User, Shadow} from '../client'
export default {
  name: "achivement",
  description: "Your standard Minecraft achievement cmd ⛏️", // Oh yeah

  async execute(message:Message, args:String[], client:Shadow) {
    const sentence = args.join("+");
    if (!sentence) return message.channel.send("Please specify a query.");
    let embed = new MessageEmbed()
      .setTitle("Achievement unlocked!")
      .setImage(`https://api.cool-img-api.ml/achievement?text=${sentence}`)
      .setColor("RANDOM")
      .setFooter(" ");
    message.channel.send({ embeds: [embed] });
  },
};
