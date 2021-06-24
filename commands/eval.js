module.exports = {
    name: 'eval',
    description: 'bald',
    aliases: ['ev'],
permissions: ['SEND_MESSAGES'],
ignore: true,
    execute(message, args, client) {
        function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}
if(!client.devs.some(dev => dev === message.author.id)) return message.channel.send(JSON.stringify(client.devs[0]));
    try {
      const code = args.join(" ");
      let evaled = eval (code);
 
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
 
      message.channel.send(clean(evaled), {code:"js"});
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`bash\n${clean(err)}\n\`\`\``);
    }

}
}