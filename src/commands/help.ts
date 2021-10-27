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
     const ID = {
       /* BUTTONS */
FAST_FORWARD_PAGES: `FAST_FORWARD_PAGES_help_menu`,
FORWARD_PAGE: `FORWARD_PAGE_help_menu`,
BLANK: `/e^/\ne`.replace('\n', '\n\n').repeat(3).replace(/\n/g, '\n\n\n'),
BACK_PAGE: `BACK_PAGE_help_menu`,
FAST_BACK_PAGES: `FAST_BACK_PAGES_help_menu`,
GetButtonIDs: () => {
  return [ID.FAST_BACK_PAGES, ID.BACK_PAGE, ID.BLANK, ID.FORWARD_PAGE, ID.FAST_FORWARD_PAGES]
}
     }
    const slrow = new MessageActionRow()
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
                            {
                              label: 'disable',
                              description: 'Disables collector',
                              value: 'disable',
                            }
                        ]),
                );
const btrow = new MessageActionRow()
.addComponents(new MessageButton().setCustomId(ID.FAST_BACK_PAGES).setDisabled(true).setEmoji('⏪').setStyle('PRIMARY'))
.addComponents(new MessageButton().setCustomId(ID.BACK_PAGE).setDisabled(true).setEmoji('◀️').setStyle('PRIMARY'))
.addComponents(new MessageButton().setCustomId(ID.BLANK).setDisabled(true).setLabel('\u200b').setStyle('PRIMARY'))
.addComponents(new MessageButton().setCustomId(ID.FORWARD_PAGE).setEmoji('▶️').setStyle('PRIMARY'))
.addComponents(new MessageButton().setCustomId(ID.FAST_FORWARD_PAGES).setStyle('PRIMARY').setEmoji('⏩'))
const components = [slrow, btrow]
const msg = await message.reply({ content: 'Pong!', components })
    const disable = (i?: any): Promise<void> => {
      return new Promise((resolve, reject) => {
      components[0].components[0].disabled = true; 
      components[1].components.forEach((c:any) => c.disabled = true)
      //@ts-ignore
    components[1].components.forEach((c:MessageButton) => c.setStyle('SECONDARY'))  
    resolve()
    })
    }
    const collector = msg.channel.createMessageComponentCollector({  componentType: 'SELECT_MENU', filter: (i: any) => {
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
    collector.on('collect', async (i:SelectMenuInteraction) => {
        //if (i.user.id === message.author.id) {
if(i.values[0] === 'disable') await disable();
         (i.message as Message).edit({
           content: i.values.join('\n'),
           components
         })
    });
    
    collector.on('end', async collected => {
      await disable();
      msg.edit({
         content: 'Ended with ' + collected.size,
         components
       })
    });
    const bcollector = message.channel.createMessageComponentCollector({ componentType: 'BUTTON', filter: (i:any) => {
     //@ts-ignore
      client.error('Collected on help_button_coloector')
      if(!(i.user.id == message.author.id)) {
        i.reply({ content: 'You cant use these buttons or select menus!', ephemeral: true })
        return false;
              }
              console.log(!(ID.GetButtonIDs().includes(i.customId)), ID.GetButtonIDs(), i.customId)
              if(!(ID.GetButtonIDs().includes(i.customId))) {
                console.log('RETURNING_FALSE')
                return false;
              }
              return true;
    }
  })
  bcollector.on('collect', (i:ButtonInteraction) => {
       //@ts-ignore
       client.error('sending a reply on help_button_coloector')
    i.reply({ content: 'Testssssss', ephemeral: true });
  })
  bcollector.on('end', () => {})
    
    },
  },
];
