import {
  ButtonInteraction,
  Interaction,
  SelectMenuInteraction,
} from "discord.js";
import {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
  Message,
  CommandInteraction,
  Shadow,
} from "../client";
import { Command } from "../util/commands";
const commands = async function (
  client: Shadow,
  message: Message,
  min: Number,
  max: Number
) {
  if (!min) {
    min = 0;
  }
  if (!max) {
    max = 10;
  }
  if (typeof max !== "number" || typeof min !== "number") return "NaN";

  try {
    let prefix = (await client.db.get("prefix_" + message.guild?.id)) || "!!";
    const res = client.commands
      .filter((c: any) => c)
      .map((cmd: Command) => {
        return `\`${prefix + cmd.name}\` ${
          cmd.description || "None"
        } \n Usage: ${cmd.usage ? prefix + cmd.usage : "None"}`;
      })
      .slice(min, max)
      .join("\n");
    return res;
  } catch (err) {
    client.error ? client.error(err, "[HELP_COMMAND_MENU]") : null;
    return "None";
  }
};
export default [
  {
    name: "help",
    async execute(message: Message, args: String[], client: Shadow) {
     const filter = (i:SelectMenuInteraction) => {
        i.deferUpdate();
        return i.user.id === message.author.id;
    };
    const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('help_select_menu')
                        .setPlaceholder('Nothing selected')
                        .addOptions([
                            {
                                label: 'Select me',
                                description: 'This is a description',
                                value: 'first_option',
                            },
                            {
                                label: 'You can select me too',
                                description: 'This is also a description',
                                value: 'second_option',
                            },
                        ]),
                );
const components = [row]
const msg = await message.reply({ content: 'Pong!', components })
    
    const collector = msg.channel.createMessageComponentCollector({  time: 15000 * 5, filter: (i: any) => {
      console.log(!(i.user.id == message.author.id), !(i.customId  === 'help_select_menu'))
      if(!(i.user.id == message.author.id)) {
i.reply({ content: 'You cant use these buttons or select menus!', ephemeral: true })
return false;
      }
      if(!(i.customId  === 'help_select_menu')) {
        return false;
      }
      return true;
    } 
  });
    collector.on('collect', (i:SelectMenuInteraction) => {
        //if (i.user.id === message.author.id) {
         (i.message as Message).edit({
           content: i.values.join('\n'),
           components
         })
    });
    
    collector.on('end', collected => {
        message.reply(`Collected ${collected.size} interactions.`);
    });
    
    
    },
  },
];
