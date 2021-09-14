//let invites = {};
module.exports = {
  name: "guildMemberAdd",
  once: false,
  type: "event",
  async execute(member, client) {
    // console.log(member)
    if(!client.storage.invites) client.storage.invites = {}
    let invites = client.storage.invites
    const { guild } = member;
    const csh = await client.db.get("welcome_" + guild.id);
    if (member.user.id === client.user.id) return;
    if (!csh) return;
    let { ch, msg } = csh;
  //  client.error(csh)
    if (!invites[member.guild.id] && member.guild.me.permissions.has('MANAGE_SERVER'))  invites[member.guild.id] = await member.guild.invites.fetch();
     const gInvites = await member.guild.invites.fetch().catch(e => new Map());
      let invite = gInvites.find(
        (inv) => invites[member.guild.id].get(inv.code) ? invites[member.guild.id].get(inv.code).uses : 0 < inv.uses
      );
      client.error(invite)
      let invitetype = 'user'
      if(invite) invitetype += '&invite'
      if(member.user.bot) invitetype = 'oauth2'
      if(member.user.bot && !msg) msg = `<@{user.id}> joined using {invite.type}`
      if(!invite) invite = {} 
    let { inviter } = invite;
    if(!msg) msg = 'Welcome <@{user.id}>, thank you for joining {guild.name}'
    let fullmsg = client.util.massreace(msg, [{ word: /{user.name}/, replaced: member.user.name}, {word: /{user.id}/, replaced: member.user.id }, { word: /{user.tag}/, replaced: member.user.tag }, {
      word: /{test}/,
      replaced: 'true'
}, {
  word: /{inviter.name}/,
  replaced: inviter?.username
}, {
  word: /{invite.type}/,
  replaced: invitetype
}, {
word: /{guild.name}/,
replaced: member.guild.name
}, {
  word: /{guild.membercount}/,
  replaced:  member.guild.memberCount
},
{
  word: /{user.createdAt}/,
  replaced: member.user.createdTimestamp
}
])
    member.guild.channels
      .fetch(ch)
      .then(c => {
      //  client.error(c)
        if(c) c.send(fullmsg) })
    // member.user.send('Welcome to ' + guild.name)
  },
};
