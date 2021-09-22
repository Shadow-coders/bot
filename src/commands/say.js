module.exports = {
    name: 'say',
async execute(message,args,client) {
    const text = client.util.onlywords(args.join(' '));
    message.reply(`${text}\n\n -- **${message.author.tag}**`);
}
}