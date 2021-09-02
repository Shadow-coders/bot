let S = require('@discordjs/builders').SlashCommandBuilder;
let s = [{
  name: "afk",
  permissions: [],
  type: "command",
  description: "Set your Status to AFK.",
  async execute(message, args, client) {
    if(await client.db.get("afk_" + message.author.id) !== null) return;
    let reason = args.join(" ") || null;
    let oldName = message.member.nickname || message.author.username;
    
    await client.db.set(`afk_${message.author.id}`, {
      reason,
      name: oldName
    })

    message.member.setNickname("[AFK] " + oldName);
    return message.reply(`${message.author.username}, your Status was Set to "AFK". ${(reason === null) ? "" : "\nYour Reasoning is: " + reason}`);
  }
}]
s.push({
name: 'afk-slash',
type: 'slash',
data: new S().setName('afk').setDescription('Go afk or something').addStringOption(s => s.setName('reason').setDescription('Why you wana go afk')),
execute(interaction,cmd,args,client) {
const { message, member } = interaction;
interaction.author = interaction.member.user
s[0].execute(interaction, 
[interaction.options.get('reason')], client);

// interaction.reply("test");
});

module.exports = s;
