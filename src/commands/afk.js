module.exports = {
  name: "afk",
  permissions: [],
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
    return message.reply(`your Status was Set to "AFK". ${(reason === null) ? "" : "\nYour Reasoning is: " + reason}`);
  }
};
