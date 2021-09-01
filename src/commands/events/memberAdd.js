
let invites = {};
module.exports = {
    name: 'guildMemberAdd',
    once: false,
type: 'event'
    async execute(member, client) {
// console.log(member)
const { guild } = member;
const ch = client.db.get('welcome_' + guild.id)
if(member.user.id === client.user.id) return;
if(!ch) return;
if(!invites[member.guild.id]) invites[member.guild.id] = await member.guild.invites.fetch()
if(member.user.bot) return client.channels.cache.get(ch).send(`**${member.user.tag}**, has joined using Oauth2`)
const gInvites = await member.guild.invites.fetch()
const invite = gInvites.find((inv) => invites.get(inv.code).uses < inv.uses);
        let { inviter } = invite
client.channels.cache.get(ch).send(`**${member.user.tag}** has been invited by ${inviter}!`);
// member.user.send('Welcome to ' + guild.name)
    }
}
