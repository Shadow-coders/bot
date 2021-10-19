import { TextChannel } from "discord.js";
import { Message, Shadow, MessageEmbed } from "../client";
export default [
  {
    name: "exec",
    description: "exec a console command",
    execute(message: Message, args: String[], client: Shadow) {
      if (!client.devs?.some((d) => d === message.author.id))
        return message.reply("No");
      let text = args.join(" ");
      if (!text) return message.channel.send("BAD ARGS");
      const DateN = Date.now();
      try {
        const res = require("child_process").execSync(text);
        const embeds = [
          {
            color: 0x0000,
            title: "Exec res",
            description:
              "Input:\n```bash\n" +
              text +
              "```\n\n```bash\n" +
              res +
              "\n```\n" +
              `Took ${Date.now() - DateN}ms (${require("ms")(
                Date.now() - DateN
              )})`,
          },
        ];
        message.reply({ embeds });
      } catch (e) {
        client.error ? client.error(e) : null;
        let err = require("util").inspect(e);
        if (err.length > 400) {
          err = err.slice(0, 390);
          err += "...";
        }
        message.reply({ content: "`ERROR`\n```bash\n" + err + "\n```" });
      }
    },
  },
  {
    name: "error",
    async execute(message: Message, args: String[], client: Shadow) {
      if (!client.devs?.some((d) => d === message.author.id)) return;
      const FindError = args[0];
      if (!FindError) return message.channel.send("No messageid supplied");
      if (!(await client.db.get("error_" + FindError)))
        return message.channel.send("Not an error id");
      let msg: any = await (
        client.channels.cache.get("829753754713718816") as TextChannel
      )?.messages.fetch({ limit: 100 });
      if (!msg.some((m: any) => m.id === FindError))
        return message.channel.send(
          "hmm i cant seem to fetch the message, look at it here in this link: https://ptb.discord.com/channels/778350378445832233/829753754713718816/" +
            FindError
        );
      try {
        msg = msg.get(FindError);

        const embed = new MessageEmbed()
          .setTitle(msg.title)
          .setDescription(msg.description)
          .setColor("RED")
          .setFooter(
            "error number " +
              (await client.db.get("error_" + FindError)).errorCount.cache
          );
        message.channel.send({ embeds: [embed] });
      } catch (e: any) {
        client.error ? client.error(e) : null;
        message.channel.send(e.message);
      }
    },
  },
];
