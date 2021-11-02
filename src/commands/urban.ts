import { Shadow, CommandInteraction,  MessageEmbed } from '../client'
import { Command } from '../util/commands'

export default [
    {
        name: 'urban',
        type: 'slash',
        async execute(interaction: CommandInteraction, args: string[], client: Shadow) {
            await interaction.deferReply();
            const term = ( interaction.options.getString('term') as string);
            const query = new URLSearchParams({ term })
          const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json())  
          if (!list.length) {
            return interaction.editReply(`No results found for **${term}**.`);
        }
    
        interaction.editReply(`**${term}**: ${list[0].definition}`);
        }
    }
] as Array<Command>