const { MessageEmbed, APIMessage } = require('discord.js')
async function createAPIMessage(interaction, content, client) {
    const apiMessage = await APIMessage.create(client.channels.resolve(interaction.channel_id), content)
        .resolveData()
        .resolveFiles();
    
    return { ...apiMessage.data, files: apiMessage.files };
}
async function e(data) {
client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: data
                }
            })
}

module.exports = {
name: 'echo',
async execute(interaction,command,args,client) {
const description = args.find(arg => arg.name.toLowerCase() == "content").value;
            const embed = new MessageEmbed()
                .setTitle("Echo!")
                .setDescription(description)
                .setAuthor(interaction.member.user.username);

            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: await createAPIMessage(interaction, embed, client)
                }
            })
}
}