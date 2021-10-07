import {
  MessageEmbed,
  MessageAttachment,
  CommandInteraction,
  Client,
  Message
} from "discord.js"
import { Shadow } from '../client'
import { SlashCommandBuilder } from "@discordjs/builders"
export default [
  {
    name: "eval",
    description: "bald",
    aliases: ["ev"],

    permissions: ["SEND_MESSAGES"],
    ignore: true,
    async execute(message:Message, args:String[], client:Shadow) {
      function clean(text:any) {
        let response;
        if (typeof text === "string")
          return text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
        else return text;
      }
     // console.log(client.devs)
      if (!client.devs?.some((dev:any) => dev === message.author.id))
        return message.channel.send('Noy su dev');
      try {
        const code = args.join(" ");
        let evaled = await eval(code);

        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
        if (evaled.length > 2000 && 4000 > evaled.length) {
          return message.channel.send({
            embeds: [
              new MessageEmbed()
                .setDescription("```js\n" + clean(evaled) + "\n```")
                .setTitle("Eval results")
                .setTimestamp()
                .setColor("RED"),
            ],
          });
        } else if (evaled.length > 4000) {
          const attachemnt = new MessageAttachment(
            Buffer.from(evaled),
            "result.txt"
          );
          return message.channel.send({
            content: "Evaled lenght is " + evaled.length,
            files: [attachemnt],
          });
        } else message.channel.send(`\`\`\`js\n${clean(evaled)}` + "```");
      } catch (err) {
        client.error ? client.error(err) : null ;
        message.channel.send(`\`ERROR\` \`\`\`bash\n${clean(err)}\n\`\`\``);
      }
    },
  },
  {
    name: "eval",
    type: "slash",
    data: new SlashCommandBuilder()
      .setName("eval")
      .setDescription("an eval code write command")
      .addStringOption((s) =>
        s.setName("input").setDescription("code to eval").setRequired(true)
      ),
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {String} cmd
     * @param {String[]} args
     * @param {Client} client
     * @returns
     */
    async execute(interaction:CommandInteraction, cmd:String, args:any[], client:Shadow) {
      const { member, guild, channel, id } = interaction;
      // console.log(member)
      function send(text:any) {
        interaction.reply(text);
      }
      function clean(text:any) {
        if (typeof text === "string")
          return text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
        else return text;
      }
      try {
        const code:any = interaction.options.get("input");
        if(!code) return interaction.reply({ ephemeral: true, content: 'No code' })
        let evaled = await eval(code);
        // console.log(client.devs)
        if (!client.devs?.some((d:any) => d === interaction.member?.user.id)) return;
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
        if (evaled.length > 2000 && 4000 > evaled.length) {
          return send({
            embeds: [
              new MessageEmbed()
                .setDescription("```js\n" + clean(evaled) + "\n```")
                .setTitle("Eval results")
                .setTimestamp()
                .setColor("GREEN"),
            ],
          });
        } else if (evaled.length > 4000) {
          const attachemnt = new MessageAttachment(
            Buffer.from(evaled),
            "result.txt"
          );
          return send({
            content: "Evaled lenght is " + evaled.length,
            files: [attachemnt],
          });
        } else send("```js\n" + clean(evaled) + "```");
      } catch (err) {
        send({
          content: `\`ERROR\` \`\`\`bash\n${clean(err)}\n\`\`\``,
          ephemeral: true,
        });
      }
    },
  },
];
