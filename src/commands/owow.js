function Mass(text) {
    text = text.split('r')
    text = text.join('w')
    text = text.split('l')
    text = text.join('w')
    return text
}
module.exports = {
    name: 'owoify',
    descriptiton: "make a text like owo",
    usage: "owowify <text>",
    execute(message,args,client) {
    const text = Mass(args.join(' '))
    message.channel.send(text + ' owo?')
    }
}