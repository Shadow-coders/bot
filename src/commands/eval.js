const { MessageEmbed, MessageAttachment } = require('discord.js')
module.exports = [{
    name: 'eval',
    description: 'bald',
    aliases: ['ev'],
    
permissions: ['SEND_MESSAGES'],
ignore: true,
    async execute(message, args, client) {
        function clean(text) {
          let response;
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}
if(!client.devs.some(dev => dev === message.author.id)) return message.channel.send(JSON.stringify(client.devs[0]));
    try {
      const code = args.join(" ");
      let evaled = await eval (code);
 
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
 if(evaled.length > 2000 && 4000 > evaled.length) {
return message.channel.send({ embeds: [new MessageEmbed().setDescription("```js\n" + clean(evaled) + "\n```").setTitle('Eval results').setTimestamp().setColor('RED')]})
} else if(evaled.length > 4000) {
const attachemnt = new MessageAttachment(evaled, 'result.js')
return message.channel.send({ content: "Evaled lenght is " + evaled.length, files: [attachemnt]})
} else
      message.channel.send(`\`\`\`js \n${clean(evaled)}` + "```");
    } catch (err) {
        client.error(err)
      message.channel.send(`\`ERROR\` \`\`\`bash\n${clean(err)}\n\`\`\``);
    }

}
}, {
  name: 'eval',
  type: 'slash',
  options: [{
    name: 'code',
    type: 'STRING',
    description: 'Eval command',
    required: true,
  }],
  async execute(interaction,cmd,args,client) {
  const { message, member } = interaction
  // console.log(member)
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
        const code = args[0]
        let evaled = await eval(code);
       // console.log(client.devs)
   if(!client.devs.some(d => d === interaction.member.user.id)) return;
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
   
        send('```js\n' + clean(evaled) + '```');
      } catch (err) {
        send(`\`ERROR\` \`\`\`bash\n${clean(err)}\n\`\`\``);
      }
  }
  }]