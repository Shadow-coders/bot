import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders'
export const subcommand = (name: string, description: string, ...options: any):SlashCommandSubcommandBuilder => {
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
  .addSubcommand(subcommand('dc', 'Disconnect from a oice channel')) ,
  new SlashCommandBuilder()
  .setName('animals').setDescription('Animals Images')
  .addSubcommand(subcommand('dog', 'Dog images'))
  .addSubcommand(subcommand('cat', 'cat Images')),
  new SlashCommandBuilder().setName('moderation').setDescription('Mod sh')
  .addSubcommand(subcommand('kick', 'kick User').addUserOption(u => {
    return u.setName('target').setDescription(`The person you want to kick`).setRequired(true);
  }).addStringOption(s => {
    return s.setName('reason').setDescription('The reason you want to kick them');
  })),
]

export default commands;