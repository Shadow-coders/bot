module.exports = {
name: 'eval',
execute(interaction,cmd,args,client) {
const { message, member } = interaction
console.log(member)
function send(text) {
interaction.send(text)
}
function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}
    try {
      const code = args.find(arg => arg.name.toLowerCase() == "code").value;
      let evaled = eval (code);
      console.log(client.devs)
 if(!client.devs.some(d => d === interaction.member.user.id)) return;
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
 
      send('```js\n' + clean(evaled) + '```');
    } catch (err) {
      send(`\`ERROR\` \`\`\`bash\n${clean(err)}\n\`\`\``);
    }
}
}