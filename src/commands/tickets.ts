import Ticket from "../models/tickets"
import {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Message,
  Shadow,
  ButtonInteraction,
  CommandInteraction,
  TextChannel
} from "../client";
import { SlashCommandBuilder } from "@discordjs/builders"

async function ticketCreate(message:Message | CommandInteraction | ButtonInteraction, args: any[], client:Shadow, ops?:any) {
  let data = await client.db.get("ticket_" + message.guild?.id);
  //@ts-ignore
  if (ops.interaction) message.author = message.member?.user;
  if (!data) {
    let str = "No data found for this guild";
    if (ops.interaction)
    //@ts-ignore
      return message.reply({ content: str, ephemeral: true });
    //@ts-ignore
    return message.reply(str).then((m:any) => {
      setTimeout(() => m.delete(), 3000);
    });
  }
  if (!data.catagory) {
    let str = "No catagory found for this guild";
    if (ops.interaction)
    //@ts-ignore
      return message.reply({ content: str, ephemeral: true });
    //@ts-ignore
    return message.reply(str).then((m:any) => {
      setTimeout(() => m.delete(), 3000);
    });
  }
  if (
    await Ticket.findOne({
      guildId: message.guild?.id,
    //@ts-ignore
      userId: message.author?.id,
    })
  ) {
    let str = "You have a ticket";
    if (ops.interaction)
    //@ts-ignore
      return message.reply({ content: str, ephemeral: true });
    //@ts-ignore
    return message.reply(str).then((m:any) => {
      setTimeout(() => m.delete(), 3000);
    });
  }
  if (!data.roles) data.roles = [];
  if (!data.count) data.count = 0;
  /**
   * @returns {Array}
   */
  let extraoptions = data.roles.map((role:string) => {
    return {
      id: role,
      allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES"],
    };
  });
  let ch = await message.guild?.channels.create(
    //@ts-ignore
    `${message.author.username}-${data.count}`,
    {
    //@ts-ignore
      reason: `[${message.author.toString()}] ticket created`,
      parent: data.catagory,
      permissionOverwrites: [
    //@ts-ignore
        { id: message.author.id, allow: ["VIEW_CHANNEL", "SEND_MESSAGES"] },
        { id: message.guild.id, deny: ["VIEW_CHANNEL"] },
        ...extraoptions,
      ],
    //@ts-ignore
      topic: `${message.author}, ticket created today at ${
        message.createdAt
      } this user needs help on ${args.join(" ")}`,
      rateLimitPerUser: 1,
    }
  );
    //@ts-ignore
  if (!ch) return message.reply("Faild to make channel");
  data.count++;
  client.db.set("ticket_" + message.guild?.id, data);
  let row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setEmoji("❌")
        .setLabel("Close")
        .setStyle("DANGER")
        .setCustomId("ticket_close")
    )
    .addComponents(
      new MessageButton()
        .setLabel("Claim")
        .setEmoji("🔓")
        .setCustomId("ticket_claim")
        .setStyle("SUCCESS")
    );
  let Model = new Ticket({
    //@ts-ignore
    userId: message.author.id,
    guildId: message.guild?.id,
    reason: args.join(" ") !== "" ? args.join(" ") : null,
    claimedId: null,
    claimed: false,
  });
  ch.send({
    embeds: [
      new MessageEmbed()
        .setTitle("New ticket")
        .setDescription(
          data.messages
            ? data.messages.first
            : "Thank you for making this ticket"
        )
        .setAuthor(
    //@ts-ignore
          message.author.tag,
    //@ts-ignore
          message.author.displayAvatarURL({ dynamic: true })
        ),
    ],
    components: [row],
  }).then((c) => {
    Model.messageId = c.id;
    Model.channelId = ch?.id;
    Model.save();
  });
  (() => {
    if (ops.interaction)
    //@ts-ignore
      return message.reply({
        content: "Ticket created in " + `<#${ch.id}>`,
        ephemeral: true,
      });
    //@ts-ignore
    return message.reply("Ticket created in " + `<#${ch.id}>`);
  })();
}
/**
 * @name Tickets
 */
export default [
  {
    name: "ticket",
    /**
     *
     * @param {Message} message
     * @param {String[]} args
     * @param {Client} client
     */
    async execute(message: Message, args: String[], client:Shadow) {
      if (!args) return message.reply("Missing Args , ");
      let cmd = args.shift();
      let data = await client.db.get("ticket_" + message.guild?.id);
      switch (cmd) {
        case "setCatagory":
          if (!args[0]) return message.reply("Missing Args , Channel id");
          let channel = message.guild?.channels.cache.get(args[0].toString());
          if (!channel) return message.reply("Invalid channel");
          if (!(channel?.type === "GUILD_CATEGORY"))
            return message.reply("Invalid");
          if (!data) data = {};
          data.catagory = channel.id;

          client.db.set("ticket_" + message.guild?.id, data).then(() => {
            message.reply("Done!");
          });
          break;
        case "message":
          if (!data) data = {};
          message.channel.send({
            embeds: [
              new MessageEmbed()
                .setTitle("Tickets")
                .setDescription("Click the button to use tickets")
                .setTimestamp(),
            ],
            components: [
              new MessageActionRow().addComponents(
                new MessageButton()
                  .setCustomId("tickets_create")
                  .setStyle("PRIMARY")
                  .setLabel(data?.label || "Click for a ticket")
              ),
            ],
          });

          break;
        default:
          if (!cmd) return;
          message.reply("I dont know what  is " + cmd + " is");
      }
    },
  },
  {
    name: "ticketcreate",
    /**
     *
     * @param {Message} message
     * @param {String[]} args
     * @param {Client} client
     */
    async execute(message: Message, args: String[], client: Shadow) {
      ticketCreate(message, args, client);
    },
  },
  {
    name: "create",
    execute(interaction: CommandInteraction, cmd: String, args:any[], client: Shadow) {
      ticketCreate(interaction, args, client, {
        interaction: true,
        command: true,
      });
    },
    data: new SlashCommandBuilder()
      .setName("ticket-create")
      .setDescription("create a ticket")
      .addStringOption((option) => {
        return option
          .setName("reason")
          .setDescription("the reason for this ticket")
          .setRequired(false);
      }),
    type: "slash",
  },
  {
    name: "close",
    async execute(message: Message, args: String[], client:Shadow) {
      if (
        !(await Ticket.findOne({
          channelId: message.channel.id,
          guildId: message.guild?.id,
        }))
      )
        return message.reply("This is not a ticket");
      let data = await Ticket.findOne({
        channelId: message.channel.id,
        guildId: message.guild?.id,
      });
      try {
    //@ts-ignore
        let ch:TextChannel | undefined = client.channels.cache.get(data.channelId);
        ch?.send("Closed").then(() => {
          setTimeout(() => ch?.delete(), 3000);
        });
        data.remove();
      } catch (e: any) {
        client.error ? client.error(e.message) : null;
        message.delete();
      }
    },
  },
  {
    name: "interactionCreate",
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction:ButtonInteraction, client:Shadow) {
      if (!interaction.isButton()) return;
      let cmd = interaction.customId;
      switch (cmd) {
        case "ticket_close":
          if (
            !(await Ticket.findOne({
              channelId: interaction.channel?.id,
              guildId: interaction.guild?.id,
            }))
          )
            return interaction.reply("This is not a ticket");
          let data = await Ticket.findOne({
            channelId: interaction.channel?.id,
            guildId: interaction.guild?.id,
          });
          try {
            let ch = client.channels.cache.get(data.channelId);
    //@ts-ignore
    interaction.message?.edit({
              components: [
                new MessageActionRow()
                  .addComponents(
                    new MessageButton()
                      .setEmoji("❌")
                      .setLabel("Close")
                      .setStyle("DANGER")
                      .setCustomId("ticket_close")
                      .setDisabled(true)
                  )
                  .addComponents(
                    new MessageButton()
                      .setLabel("Claim")
                      .setEmoji("🔓")
                      .setCustomId("ticket_claim")
                      .setStyle("SUCCESS")
                      .setDisabled(true)
                  ),
              ],
              content: `Closing...`,
              embeds: interaction.message.embeds,
            });
            interaction
              .reply({
                content: "Deleting ticket in 3 seconds",
                ephemeral: false,
              })
              .then(() => {
                setTimeout(() => ch?.delete(), 3000);
                data.remove();
              });
          } catch (e) {
            client.error ? client.error(e) : null;
            interaction.reply({
              content: "I cannot delete this ticket an error acourred",
              ephemeral: true,
            });
          }
          break;
        case "ticket_claim":
          await interaction.deferReply();
          let ChannelData = Ticket.findOne({
            channelId: interaction.channel?.id,
          });
          let GuildData = await client.db.get("ticket_" + interaction.guild?.id);
          if (!GuildData)
            return interaction.editReply({
              content: "NO data found for this guild ",
         //     ephemeral: true,
            });
          if (!ChannelData)
            return interaction.editReply({
              content: "NO data found for this channel ",
         //     ephemeral: true,
            });
          if (!GuildData.roles) GuildData.roles = [];
          ChannelData.claimedId = interaction.member?.user.id;
          ChannelData.claimed = true;
          await Ticket.findOneAndUpdate(
            { channelId: interaction.channel?.id },
            {
              claimedId: interaction.member?.user.id,
            }
          );
          let extra = GuildData.roles.map((role:string) => {
            return {
              id: role,
              deny: ["SEND_MESSAGES"],
              allow: ["VIEW_CHANNEL"],
            };
          });
    //@ts-ignore
          interaction.channel?.permissionOverwrites.set([
            {
              id: interaction.member?.user.id,
              allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
            },
            {
              id: interaction.guildId,
              deny: ["SEND_MESSAGES", "VIEW_CHANNEL"],
            },
            ...extra,
          ]);
          interaction.editReply(`Ticket claimed by ${interaction.member?.user}`);
    //@ts-ignore
          interaction.message.edit({
            content: interaction.message.content
              ? interaction.message.content
              : undefined,
            embeds: interaction.message.embeds,
            components: [
              new MessageActionRow()
                .addComponents(
                  new MessageButton()
                    .setCustomId("ticket_close")
                    .setStyle("DANGER")
                    .setLabel("Close")
                    .setEmoji("❌")
                )
                .addComponents(
                  new MessageButton()
                    .setCustomId("ticket_claim")
                    .setLabel("Claimed")
                    .setEmoji("🔒")
                    .setDisabled(true)
                    .setStyle("SECONDARY")
                ),
            ],
          });
          break;
        case "tickets_create":
          ticketCreate(
            interaction,
            ["Button Click, none can be provided"],
            client,
            { interaction: true }
          );
          break;
      }
    },
    type: "event",
  },
  {
    name: "close",
    async execute(interaction: CommandInteraction, cmd: String, args: any[], client: Shadow) {
      let message = interaction;
      let id = message.channel?.id;
      if (!(await Ticket.findOne({ channelId: id, guildId: message.guild?.id })))
        return message.reply("This is not a ticket");
      let data = await Ticket.findOne({
        channelId: message.channel?.id,
        guildId: message.guild?.id,
      });
      try {
    //@ts-ignore
        let ch:TextChannel = client.channels.cache.get(data.channelId);
    //@ts-ignore
        ch?.send("Closed").then(() => {
          setTimeout(() => ch?.delete(), 3000);
        });
        data.remove();
      } catch (e) {
        client.error ? client.error(e) : null;
        interaction.reply(`Error`);
      }
    },
    type: "slash",
    data: new SlashCommandBuilder()
      .setName("tickets")
      .setDescription("This is a ticket command manager")
      .addSubcommand((cmd) => {
        return cmd
          .setName("close")
          .setDescription("Close a ticket")
          .addChannelOption((ch) => {
            return ch
              .setName("channel")
              .setDescription("A certin channel to close")
              .setRequired(false);
          });
      }),
  },
];
