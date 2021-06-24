

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(member, client) {
console.log(member)
const { guild } = member;
const ch = client.db.get('welcome_' + guild.id)
if(!ch) return;
client.channels.cache.get(ch).send(`**${member.user.tag}** has joined!`)
client.users.cache.get(member.user.id).send('Welcome to ' + guild.name)
    }
}