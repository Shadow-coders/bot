module.exports = {
    name: "quiz",
	cooldown: 9 * 60 * 1000,
	permissions: ['MANAGE_GUILD'],
    execute(message,args,client) {
        const quiz = require('../util/quiz.json');
const item = quiz[Math.floor(Math.random() * quiz.length)];
const filter = response => {
	return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
};

message.channel.send(item.question + '\n send awnser below! you have 30s').then(() => {
	message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
		.then(collected => {
			message.channel.send(`${collected.first().author} got the correct answer!`);
		})
		.catch(collected => {
			message.channel.send('Looks like nobody got the answer this time.');
		});
});
    }
}