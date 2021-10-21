import { Shadow, Message } from "../client";
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders'
const subcommand = (name: string, description: string, ...options: any):SlashCommandSubcommandBuilder => {
let res = new SlashCommandSubcommandBuilder().setName(name).setDescription(description)
return res;
}
const commands = [
  new SlashCommandBuilder()
  .setName('music').setDescription('The command group for the music commands!')
  .addSubcommand(() => subcommand('lyrics', 'The lyrics of a song')
  .addStringOption((s: any) => s.setName('song').setDescription('The lyrics of a song you want to get').setRequired(true))
  )
  .addSubcommand(subcommand('join', 'Join the voice channel'))
  .addSubcommand(subcommand('dc', 'Disconnect from a voice channel')) 
]
export default [
  {
    name: "deploy",
    /**
     *
     * @param {Message} message
     * @param {String[]} args
     * @param {Client} client
     * @returns
     */
    async execute(message: Message, args: String[], client:any) {
      if (!client.devs?.some((d: any) => d === message.author.id)) return;
      let date = Date.now();
      if (!args[0])
        return message.reply(
          "format: " + message.content + " <name> [flags: --global, --all]"
        );
      const command = args[0];
      const isGlobal = args[1] ? args[1] === "--global" : false;
      const All = args[2] ? args[2] === "--all" : false
      if (!client.commands.find((c: any) => c?.name == command))
        return message.reply("Command " + command + " does not exist\n did you mean " + commands[0].name);
      console.log(commands.some((c: any) => c?.name === command))
        let cmd = commands.find((c: any) => c?.name == command);

      //client.error(cmd)
      let cmddata = cmd?.toJSON()
      client.error(cmddata)
      if (!isGlobal)
        message.guild?.commands
        //@ts-ignore
          .create(cmddata)
          .catch((err: Error) =>client.error(err))
          .then(() =>
            message.reply(
              `Deployed '${command}' took ${Date.now() - date}ms to this guild`
            )
          );
      if (isGlobal)
      //@ts-ignore
        client.application?.commands
        //@ts-ignore
          ?.create(cmddata)
          .then(() =>
            message.reply(
              `Deployed '${command}' took ${Date.now() - date}ms to global`
            )
          );
    },
  },
  {
    name: "undeploy",
    /**
     *
     * @param {Message} message
     * @param {String[]} args
     * @param {Client} client
     * @returns
     */
    //@ts-expect-error
    async execute(message, args, client) {
      if (!client.devs.some((d: any) => d === message.author.id)) return;
      let date = Date.now();
      await message.guild.commands.fetch();
      await client.application.commands.fetch();
      if (!args[0])
        return message.reply(
          "format: " + message.content + " <name> <GuildorGlobal>"
        );
      const command = args[0];
      const isGlobal = args[1] ? args[1] === "global" : false;
      let cmddata = isGlobal
        ? client.application.commands.cache.find((c: any) => c.name === command)
        : message.guild.commands.cache.find((c: any) => c.name === command);
      if (!cmddata) return message.reply(" command does not exist ");
      cmddata = cmddata.id;
      client.error(cmddata);
      if (!isGlobal)
        message.guild.commands
          .delete(cmddata)
          .then(() =>
            message.reply(
              `Undeployed '${command}' took ${
                Date.now() - date
              }ms to this guild`
            )
          );
      if (isGlobal)
        client.application.commands
          .delete(cmddata)
          .then(() =>
            message.reply(
              `Uneployed '${command}' took ${Date.now() - date}ms to global`
            )
          );
    },
  },
];
