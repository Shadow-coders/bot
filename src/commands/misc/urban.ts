import { Shadow, CommandInteraction, MessageEmbed } from "../../client";
import { Command } from "../../util/commands";

export default [
  {
    name: "urban",
    type: "slash",
    async execute(
      interaction: CommandInteraction,
      args: string[],
      client: Shadow
    ) {
      console.log(1);
      const term = interaction.options.getString("term") as string;
      console.log(term);
      const query = new URLSearchParams({ term: term });
      console.log(query, `https://api.urbandictionary.com/v0/define?${query}`);
      //@ts-ignore
      const json = (await client.fetch)
        ? client
            .fetch(`https://api.urbandictionary.com/v0/define?${query}`)
            .then((response: any) => response.json())
        : null;
      console.log(json, interaction.replied);
      if (!json.list)
        return interaction.reply({
          content: "No json_list here is current json\n" + JSON.stringify(json),
        });
      let { list } = json;
      console.log(list.length);
      if (!list.length) {
        return interaction.reply(`No results found for **${term}**.`);
      }

      interaction.reply(`**${term}**: ${list[0].definition}`);
    },
  },
] as Array<Command>;
