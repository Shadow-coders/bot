let invites = {};
module.exports = {
  name: "guildMemberAdd",
  once: false,
  type: "event",
  async execute(member, client) {
    // console.log(member)
    const { guild } = member;
    const csh = client.db.get("welcome_" + guild.id);
    if (member.user.id === client.user.id) return;
    if (!csh) return;
    const {ch,msg} = csh;
    if (!invites[member.guild.id] && member.guild.me.permissions.has('MANAGE_SERVER'))
      invites[member.guild.id] = await member.guild.invites.fetch();
      const gInvites = await member.guild.invites.fetch();
      const invite = gInvites.find(
        (inv) => invites.get(inv.code).uses < inv.uses
      );
      
    let { inviter } = invite;
    let fullmsg = client.util.massreplace(msg, [{ word: /{user.name}/, replaced: member.user.name}, {word: /{user.id}/, replaced: member.user.id }, { word: /{user.tag}/, replaced: member.user.tag }, {
      word: /{test}/,
      replaced: 'true'
}, {
  word: /{inviter.name}/,
  replaced: inviter.username
}, {
  word: /{invite.type}/,
  replaced: invitetype
}])
    if (member.user.bot)
      return client.channels.cache
        .get(ch)
        .send(fullmsg);
    
    
    
    client.channels.cache
      .get(ch)
      .send(fullmsg);
    // member.user.send('Welcome to ' + guild.name)
  },
};
