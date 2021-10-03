import { MessageEmbed, Message, MessageReaction, User, Shadow} from '../../client'
export default {
  name: "messageReactionAdd",
  type: "event",
  once: false,
  async execute(reaction:MessageReaction, user:User, client:Shadow) {
    const emojis = (await client.db.get(
      "staremojis_" + reaction.message.guild?.id
    ))
      ? await client.db.get("staremojis_" + reaction.message.guild?.id)
      : ["⭐", "🌟"];
    const channel =
      (await client.db.get("starchannel_" + reaction.message.guild?.id)) || null;
    const size =
      (await client.db.get("starlimit_" + reaction.message.guild?.id)) || 0;
    const handleStarboard = async () => {
      const starboard:any = reaction.message.guild?.channels.cache.find(
        (ch) => ch.id === channel
      );
      const msgs = await starboard?.messages.fetch({ limit: 100 });
      const existingMsg = msgs.find((msg:any) =>
        msg.embeds.length === 1
          ? msg.embeds[0].footer.text.startsWith(reaction.message.id)
            ? true
            : false
          : false
      );
      if (existingMsg)
        existingMsg.edit(
          `${reaction.count} - ${
            reaction.emoji.id
              ? `<${reaction.emoji.animated ? "a" : ""}:${
                  reaction.emoji.name
                }:${reaction.emoji.id}>`
              : reaction.emoji.name
          }`
        );
      else {
        const embed = new MessageEmbed()
          .setAuthor(
            reaction.message.author ? reaction.message.author.tag : 'Anon',
            reaction.message.author?.displayAvatarURL()
          )
          .addField("Url", `[LINK](${reaction.message.url})`)
          .setDescription(reaction.message?.content || "")
          .setColor("YELLOW")
          .setFooter(
            reaction.message.id +
              " - " +
              new Date(reaction.message.createdTimestamp)
          );

        if (starboard)
          starboard
            .send({
              content: `${reaction.count} - ${
                reaction.emoji.id
                  ? `<${reaction.emoji.animated ? "a" : ""}:${
                      reaction.emoji.name
                    }:${reaction.emoji.id}>`
                  : reaction.emoji.name
              }`,
              embeds: [embed],
            })
            .then((m:any) =>
              m.react(
                `${reaction.emoji.id? reaction.emoji.id : reaction.emoji.name}`
              )
            );
      }
    };
    if (
      reaction.emoji.id
        ? emojis.some((e:any) => e === reaction.emoji.id)
        : emojis.some((e:any) => e === reaction.emoji.name)
    ) {
      if (reaction.message.channel.id === channel) return;
      if (reaction.count < size) return;
      if (reaction.message.partial) {
        await reaction.fetch();
        await reaction.message.fetch();
        handleStarboard();
      } else handleStarboard();
    }
  },
};
