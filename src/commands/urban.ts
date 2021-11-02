import { Shadow, CommandInteraction,  MessageEmbed } from '../client'
import { Command } from '../util/commands'

export default [
    {
        name: 'urban',
        type: 'slash',
        async execute(interaction: CommandInteraction, args: string[], client: Shadow) {
            await interaction.deferReply();
            console.log(1)
            const term = ( interaction.options.getString('term') as string);
            const query = new URLSearchParams({ term })
            console.log(query)
            //@ts-ignore
          const json = await client.fetch ? client.fetch(`https://api.urbandictionary.com/v0/define?${query}`).then((response:any) => response.json()) : null
          console.log(json)
          if(!json.list) return interaction.editReply({ content: 'No json_list here is current json\n' + JSON.stringify(json), })
         let { list } = json;
         console.log(list.length)
          if (!list.length) {
            return interaction.editReply(`No results found for **${term}**.`);
        }
    
        interaction.editReply(`**${term}**: ${list[0].definition}`);
        }
    }
] as Array<Command>