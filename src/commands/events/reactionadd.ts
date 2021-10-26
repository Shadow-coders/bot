import {
  MessageEmbed,
  Message,
  MessageReaction,
  User,
  Shadow,
} from "../../client";
export default [
  {
    name: "messageReactionAdd",
    once: false,
    type: "event",
    async execute(reaction: MessageReaction, user: User, client: Shadow) {
      if (reaction.message.partial) await reaction.message.fetch();
      if (reaction.partial) await reaction.fetch();
      if (user.bot) return;
      if (!reaction.message.guild) return;
      const { message } = reaction;

      const isRR = await client.db.get("rr_" + message.id);
      if (!isRR) return;
      if (reaction.emoji.id) {
        reaction.emoji.name = reaction.emoji.id;
      }
      if (Array.isArray(isRR)) {
        const rr = isRR.find((r) => r.emoji === reaction.emoji.name);
        if (
          reaction.message.guild.members.cache
            .get(user.id)
            ?.roles.cache.has(rr.role_id)
        ) {
          reaction.message.guild.members.cache
            .get(user.id)
            ?.roles.remove(rr.role_id)
            .then((r: any) =>
              //@ts-ignore
              reaction.message.reactions.cache //@ts-ignore
                .get(
                  reaction.emoji.name ? reaction.emoji.name : reaction.emoji?.id
                )
                ?.remove()
            )
            .catch((err) => {
              //@ts-ignore
              client.error(err);
            });
        }
        //@ts-ignore
        reaction.message.guild.members.cache
          .get(user.id)
          .roles.add(rr.role_id)
          .then((r) =>
            //@ts-ignore
            reaction.message.reactions.cache
              //@ts-ignore
              .get(reaction.emoji.name)
              //@ts-ignore
              .remove(user.id)
          );
      } else {
        if (!reaction.emoji.name === isRR.emoji) return;
        if (
          //@ts-ignore
          reaction.message.guild.members.cache
            .get(user.id)
            .roles.cache.has(isRR.role_id)
        ) {
          //@ts-ignore
          reaction.message.guild.members.cache
            .get(user.id)
            .roles.remove(isRR.role_id)
            .then((r) =>
              //@ts-ignore
              reaction.message.reactions.cache
                //@ts-ignore
                .get(reaction.emoji.name)
                .users.remove(user.id)
            );
        }
        //@ts-ignore
        reaction.message.guild.members.cache
          .get(user.id)
          .roles.add(isRR.role_id)
          .then((r) =>
            //@ts-ignore
            reaction.message.reactions.cache
              //@ts-ignore
              .get(reaction.emoji.name)
              .users?.remove(user.id)
              //@ts-ignore
              .catch(client.error)
              //@ts-ignore
              .then(client.error)
          );
      }
    },
  },
];
