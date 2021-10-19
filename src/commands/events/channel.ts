import {
  CategoryChannel,
  NewsChannel,
  StageChannel,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import { Message, Shadow, MessageEmbed, Channel } from "../../client";
export default [
  {
    name: "channelCreate",
    type: "event",
    /**
     *
     * @param {Channel} channel
     * @param {Client} client
     * @returns
     */
    async execute(channel: any, client: Shadow) {
      if (channel.type === "GUILD_TEXT") channel = channel as TextChannel;
      if (channel.type === "GUILD_VOICE") channel = channel as VoiceChannel;
      if (channel.type === "GUILD_STAGE_VOICE")
        channel = channel as StageChannel;
      if (channel.type === "GUILD_CATEGORY")
        channel = channel as CategoryChannel;
      if (channel.type === "GUILD_NEWS") channel = channel as NewsChannel;

      if (!channel.guild)
        return client.error ? client.error("New dm channel created") : null;
      const ch: any = ((await client.db.get(
        "chlogs_" + channel.guild.id
      )) as TextChannel)
        ? client.channels.cache.get(
            await client.db.get("chlogs_" + channel.guild.id)
          )
        : null;
      if (!ch) return;
      /**
       * @returns {String}
       */
      let desc;
      switch (channel.type) {
        case "GUILD_TEXT":
          desc = `New channel created\nName: ${channel.name},\n ID: ${
            ch.id
          } \n NSFW ${channel.nsfw ? "yes" : "no"} \n Topic: ${channel.topic}`;
          break;
        case "GROUP_DM":
          client.error ? client.error("group dm found") : null;
          break;
        case "GUILD_STAGE_VOICE":
          desc = `New Stage Channel\nName: ${channel.name} \n ID: ${channel.id} \n User limit: ${channel.userLimit} \n bitrate: ${channel.bitrate} \n Topic ${channel.topic}`;
          break;
        case "GUILD_VOICE":
          desc = `New voice Channel\nName: ${channel.name} \n ID: ${channel.id} \n User limit: ${channel.userLimit} \n bitrate: ${channel.bitrate} `;
          break;
        case "GUILD_NEWS":
          desc = `New channel created\nName: ${channel.name},\n ID: ${
            channel.id
          } \n NSFW ${channel.nsfw ? "yes" : "no"} \n Topic: ${channel.topic}`;
          break;
        case "GUILD_CATEGORY":
          desc = `New catagory created\nName: ${channel.name} \n ID: ${channel.id} \n pos ${channel.rawPosition}`;
          break;
        case "GUILD_NEWS_THREAD":
          desc = `New thread created\nName: ${
            channel.name
          } \n autoArchiveDuration: ${require("ms")(
            channel.autoArchiveDuration
          )} \n ID: ${channel.id} \n creator: <@${channel.ownerId}> (${
            channel.ownerId
          })`;
          break;
        case "GUILD_PRIVATE_THREAD":
          desc = `New thread created\nName: ${
            channel.name
          } \n autoArchiveDuration: ${require("ms")(
            channel.autoArchiveDuration
          )} \n ID: ${channel.id} \n creator: <@${channel.ownerId}> (${
            channel.ownerId
          })`;
          break;
        case "GUILD_PUBLIC_THREAD":
          desc = `New thread created\nName: ${
            channel.name
          } \n autoArchiveDuration: ${require("ms")(
            channel.autoArchiveDuration
          )} \n ID: ${channel.id} \n creator: <@${channel.ownerId}> (${
            channel.ownerId
          })`;
          break;
        default:
          client.error ? client.error(channel.type) : null;
          break;
      }
      if (!desc) return;
      let embeds = [
        new MessageEmbed()
          .setTitle(`new Channel`)
          .setDescription(desc)
          .setColor("LIGHT_GREY")
          .setTimestamp(),
      ];
      ch?.send({ embeds });
    },
  },
  {
    name: "channelDelete",
    async execute(channel: any, client: Shadow) {
      //console.log(channel);
      if (!channel)
        return client.error ? client.error("no channel provided") : null;
      if (channel.partial) await channel.fetch();
      if (!channel.guild)
        return client.error ? client.error("New dm channel created") : null;
      const ch: any = (await client.db.get("chlogs_" + channel.guild.id))
        ? client.channels.cache.get(
            await client.db.get("chlogs_" + channel.guild.id)
          )
        : null;
      if (!ch)
        return client.error ? client.error("debug: no channel found!") : null;
      /**
       * @returns {String}
       */
      let desc;
      switch (channel.type) {
        case "GUILD_TEXT":
          desc = `channel deleted \nName: ${channel.name},\n ID: ${
            channel.id
          } \n NSFW ${channel.nsfw ? "yes" : "no"} \n Topic: ${channel.topic}`;
          break;
        case "GROUP_DM":
          client.error ? client.error("group dm found") : null;
          break;
        case "GUILD_STAGE_VOICE":
          desc = `Stage Channel deleted \nName: ${channel.name} \n ID: ${channel.id} \n User limit: ${channel.userLimit} \n bitrate: ${channel.bitrate} \n Topic ${channel.topic}`;
          break;
        case "GUILD_VOICE":
          desc = `voice Channel deleted \nName: ${channel.name} \n ID: ${channel.id} \n User limit: ${channel.userLimit} \n bitrate: ${channel.bitrate} `;
          break;
        case "GUILD_NEWS":
          desc = `channel deleted\nName: ${channel.name},\n ID: ${
            channel.id
          } \n NSFW ${channel.nsfw ? "yes" : "no"} \n Topic: ${channel.topic}`;
          break;
        case "GUILD_CATEGORY":
          desc = `catagory deleted\nName: ${channel.name} \n ID: ${channel.id} \n pos ${channel.rawPosition}`;
          break;
        case "GUILD_NEWS_THREAD":
          desc = `thread deleted \nName: ${
            channel.name
          } \n autoArchiveDuration: ${require("ms")(
            channel.autoArchiveDuration
          )} \n ID: ${channel.id} \n creator: <@${channel.ownerId}> (${
            channel.ownerId
          })`;
          break;
        case "GUILD_PRIVATE_THREAD":
          desc = `thread deleted \nName: ${
            channel.name
          } \n autoArchiveDuration: ${require("ms")(
            channel.autoArchiveDuration
          )} \n ID: ${channel.id} \n creator: <@${channel.ownerId}> (${
            channel.ownerId
          })`;
          break;
        case "GUILD_PUBLIC_THREAD":
          desc = `thread deleted \nName: ${
            channel.name
          } \n autoArchiveDuration: ${require("ms")(
            channel.autoArchiveDuration
          )} \n ID: ${channel.id} \n creator: <@${channel.ownerId}> (${
            channel.ownerId
          })`;
          break;
        default:
          client.error ? client.error(channel) : null;
          break;
      }
      if (!desc) return client.error ? client.error("desc is null") : null;
      let embeds = [
        new MessageEmbed()
          .setTitle(` Channel Deleted`)
          .setDescription(desc)
          .setColor("LIGHT_GREY")
          .setTimestamp(),
      ];
      ch?.send({ embeds }).catch(client.error);
    },
    type: "event",
  },
  {
    name: "channelUpdate",
    type: "event",
    /**
     *
     * @param {Channel} ochannel
     * @param {Channel} nchannel
     * @param {Client} client
     */
    async execute(ochannel: any, nchannel: any, client: Shadow) {
      const { guild } = nchannel;
      let guilddata = client.db.get("chlogs_" + guild.id);
      if (!guilddata) return;
      if (nchannel.deleted) return;
      const ch: any = client.channels.cache.get(guilddata);
      if (!ch) return;
      client.error ? client.error(!ch.id ? ch : ch.id) : null;
      if (ochannel.isText()) {
        ch.send({
          embeds: [
            new MessageEmbed()
              .setDescription("Channel Updated " + `${nchannel.toString()}`)
              .setColor("LIGHT_GREY")
              .setTitle("channel update"),
          ],
        });
      } else if (ochannel.isVoice()) {
        ch.send({
          embeds: [
            new MessageEmbed()
              .setDescription("Channel Updated " + `${nchannel.toString()}`)
              .setColor("LIGHT_GREY")
              .setTitle("channel update"),
          ],
        });
      } else if (ochannel.isThread()) {
        ch.send({
          embeds: [
            new MessageEmbed()
              .setDescription("Channel Updated " + `${nchannel.toString()}`)
              .setColor("LIGHT_GREY")
              .setTitle("channel update"),
          ],
        });
      } else {
        ch.send({
          embeds: [
            new MessageEmbed()
              .setDescription("Channel Updated " + `${nchannel.toString()}`)
              .setColor("LIGHT_GREY")
              .setTitle("channel update"),
          ],
        });
        //   client.error(ochannel.type + nchannel.type);
      }
    },
  },
];
