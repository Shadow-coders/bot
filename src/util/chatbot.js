const GetNum = (num) => {
return Math.floor(Math.random() * num)
}

module.exports = async (ops) => {
    const { text, user, bot } = ops
    let response;
    if(!text) return 'ERROR';
    if(!user) return;
    if(!bot) return;
    if(text === 'hi') {
    response = ['hello!', 'hello ' + user, 'hello i am ' + bot, 'hello how are you doing!'][Math.floor(Math.random() * 4)]
    } else if(text === 'whoami') {
        const res = ['Have we met? i am ' + bot, 'Hello lemme intreduce myself i\'am ' + bot + ' \n and you are?', 'Hello i know you as ' + user + ' i am ' + bot, 'hello i am ' + bot, `${bot} is me`]
        response = res[GetNum(res.length)]
    } else if(text === 'whoami') {
        const res = ['you are ' + user, 'i am' + bot + ` you are ${bot}`, `you are ${user} right`, user, `(mr or mrs or mss) ${user}`, `${user}, right? hope we can be friends!`]
    response = res[GetNum(res.length)]
    } else {
        const fetch = require('node-fetch')
        const res = await fetch(`https://api.affiliateplus.xyz/api/chatbot?message=${encodeURIComponent(text)}&botname=${encodeURIComponent(bot)}`)
    res.json().then(r => {
        response = r.message
    })
    }
    return response;
}