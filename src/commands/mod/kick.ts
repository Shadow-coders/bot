import {
  Shadow,
  Message,
  CommandInteraction,
  GuildMember,
  MessageEmbed,
} from "../../client";
export default [
  {
    name: "kick",
    type: "slash",
    async execute(
      interaction: CommandInteraction,
      cmd: string,
      args: any[],
      client: Shadow
    ): Promise<any> {
      //@ts-ignore
      if (!interaction.member?.permissions.has("KICK_MEMBERS"))
        return interaction.reply({
          ephemeral: true,
          content: `You do not have the perms you need`,
        });
      const target = interaction.options.getMember("target") as GuildMember;
      const reason =
        interaction.options.getString("reason") || "No Reason Provided";
      const timeStamp = Math.floor(Date.now() / 1000);
      let fullReason;
      //@ts-ignore
      if (
        target?.roles.highest.position >=
        interaction.member.roles.highest.position
      )
        return interaction.reply({
          ephemeral: true,
          content: `This user has higher or the same highest role as you\n> meaning you cannot ban them`,
        });
      if (target.id === (interaction.member as GuildMember)?.id)
        return interaction.reply({
          ephemeral: true,
          content: `You cannot kick yourself!`,
        });
      if (target.id === interaction.guild?.id)
        return interaction.reply({
          ephemeral: true,
          content: `You cannot kick yourself!`,
        });
      if (!target.kickable)
        return interaction.reply({
          ephemeral: true,
          content: `For some reason i cannot Kick this user`,
        });
      await interaction.deferReply();
      await target
        .send({
          embeds: [
            new MessageEmbed()
              .setTitle("Kicked!")
              .setDescription(
                `> When: <t:${timeStamp}:R> \n> Why: ${reason}\n Server: **${interaction.guild?.name}**`
              )
              .setColor("RED")
              .setTimestamp()
              .setAuthor(
                interaction.user.tag,
                interaction.user.displayAvatarURL({ dynamic: true })
              ),
          ],
        })
        .catch(
          (e) =>
            new Promise((resolve, reject) => {
              resolve({});
            })
        );
      fullReason = `${reason}\nexecuted by ${interaction.user.tag} (${interaction.user.id})`;
      await target.kick(fullReason);
      await interaction.editReply(`**Kicked ${target.user.toString()}**`);
    },
  },
];
