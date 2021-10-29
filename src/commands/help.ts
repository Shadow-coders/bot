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
const voidReply = (i:ButtonInteraction) => {
  //@ts-ignore
  i.reply({ emphral: true, content: 'VOID' }, { fetchReply: true }).then((m) => {
    i.channel?.messages.cache.get(m.id)?.delete();
  })
}
export default [
  {
    name: "help",
    catagory: "basic",
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

const prefix = await client.db.get('prefix_'+ message.guild?.id) || "!!"

const btrow = new MessageActionRow()
.addComponents(new MessageButton().setCustomId(ID.FAST_BACK_PAGES).setDisabled(true).setEmoji('⏪').setStyle('PRIMARY'))
.addComponents(new MessageButton().setCustomId(ID.BACK_PAGE).setDisabled(true).setEmoji('◀️').setStyle('PRIMARY'))
.addComponents(new MessageButton().setCustomId(ID.BLANK).setDisabled(true).setLabel('\u200b').setStyle('PRIMARY'))
.addComponents(new MessageButton().setCustomId(ID.FORWARD_PAGE).setEmoji('▶️').setStyle('PRIMARY'))
.addComponents(new MessageButton().setCustomId(ID.FAST_FORWARD_PAGES).setStyle('PRIMARY').setEmoji('⏩'))
const components = [btrow]
let pages:any = []; //return foo at the first page, and bar at the second page
let last = 0;
for (var i = 0; client.commands.size > i; i++) {
  if (!i.toString().endsWith("0")) continue;
  if (i === 0) continue;
  let info = await commands(client, message, last, i);
  let embed = new MessageEmbed()
    .setTitle("Page " + (i + 1).toString().slice(0, 1))
    .setDescription(info)
    .setColor("RANDOM")
    .setTimestamp()
    .setFooter(
      `Page ${i.toString().slice(0, 1)}/${(client.commands.size / 10)
        .toString()
        .slice(0, 1)}`
    )
    //@ts-ignore
    .setThumbnail(client.user?.displayAvatarURL({ dynamic: true }));
  pages.push(embed);
  last = i;
}
const msg = await message.reply({ components, embeds: [pages[0]] })
    const disable = (i?: any): Promise<void> => {
      return new Promise((resolve, reject) => {
      components[0].components.forEach((c:any) => c.disabled = true)
      //@ts-ignore
    components[0].components.forEach((c:MessageButton) => c.setStyle('SECONDARY'))  
    resolve()
    })
    }
    const collector = msg.channel.createMessageComponentCollector({  componentType: 'BUTTON', filter: (i: any) => {
      console.log(!(i.user.id == message.author.id), !(i.customId  === 'help_select_menu'))
      if(!(i.user.id == message.author.id)) {
i.reply({ content: 'You cant use these buttons or select menus!', ephemeral: true })
return false;
      }
      return true;
    } 
  });
  let pageIndex = 0;
 collector.on('collect', async (interaction:ButtonInteraction) => {
        //if (i.user.id === message.author.id) {
         
if(interaction.customId == ID.FORWARD_PAGE) {
  pageIndex++;
  interaction.update({
    components,
    embeds: [pages[pageIndex]]
  })
}
// (interaction.message as Message).edit({
//            content: interaction.customId,
//            embeds: pages,
//            components
//          })

voidReply(interaction);
    });

    collector.on('end', async collected => {
      await disable();
      msg.edit({
         content: 'Ended with ' + collected.size,
         components
       })
    });
   
    
    },
  },
];
