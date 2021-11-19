import {
  Shadow,
  Message,
  CommandInteraction,
  MessageEmbed,
  TextChannel,
} from "../../client";
export default [
  {
    name: "clear",
    description: "Clear Messages",
    options: [
      {
        name: "amount",
        description: "The amount to clear",
        type: "NUMBER",
        required: true,
      },
      {
        name: "target",
        description: "The target to delete messages from!",
        type: "USER",
        required: false,
      },
    ],
    type: "slash",
    async execute(
      interaction: CommandInteraction,
      cmd: String,
      args: any[],
      client: Shadow
    ) {
      const { channel, options } = interaction;
      /* DEFINEING Amount & Target */
      //@ts-ignore
      if (!interaction.member?.permissions.has("MANAGE_MESSAGES"))
        return interaction.reply({ contnet: "You have no perms" });
      //@ts-expect-error
      const Amount: number = options.getNumber("amount");
      const Target = options.getMember("target");

      const messages = await channel?.messages.fetch();
      const Res = new MessageEmbed().setColor("RANDOM");

      if (Target) {
        let i = 0;
        const filtered: any[] = [];
        //@ts-ignore
        (await messages)?.filter((m) => {
          //@ts-expect-error
          if (m.author.id === Target.user.id && (Amount ? Amount : 0) > i) {
            filtered.push(m);
            i++;
          }
        });
        await (channel as TextChannel)
          .bulkDelete(filtered, true)
          .then((messages) => {
            Res.setDescription(
              `🧹 Cleared \`${messages.size}\` from ${Target}.`
            );
            interaction.reply({
              embeds: [Res],
            });
          });
      } else {
        await (channel as TextChannel)
          .bulkDelete(Amount, true)
          .then((messages) => {
            Res.setDescription(
              `🧹 Cleared \`${messages.size}\` from this channel`
            );
            interaction.reply({
              embeds: [Res],
            });
          });
      }
    },
  },
];
