
import  { Message, Shadow, CommandInteraction, MessageEmbed } from '../client'
const { getVoiceConnection, joinVoiceChannel } = require("@discordjs/voice");
import { SlashCommandBuilder } from "@discordjs/builders"
export default [
  {
    name: "dc",
    async execute(interaction:CommandInteraction, cmd: String, args:any[], client:Shadow): Promise<any>{
      const message:CommandInteraction = interaction;
      if (
        //@ts-ignore
        !message.member?.voice.channel ||
        //@ts-ignore
        !message.member.permissions.has("MANAGE_GUILD")
      )
        return message.channel?.send(" no voice channel found");
      if (!message.guild?.me?.voice.channel)
        return message.channel?.send("im not in a vc");
      const connection = getVoiceConnection(message.guild?.id);
      if (
        !message.guild.me.voice.channel.members.some(
          (m) => m.user.id === message.user.id
        )
      )
        return message.channel?.send("your not in this vc");
        //@ts-ignore
      message.channel.send("left " + message.member?.voice.channel.name);
      connection.destroy();
    },
    type: "slash",
    data: new SlashCommandBuilder()
      .setName("dc")
      .setDescription("Disconect from a vc"),
  },
  {
    name: "dc",
    execute(message: Message, args: String[], client:Shadow) {
      if (
        !message.member?.voice ||
        !message.member?.permissions.has("MANAGE_GUILD")
      )
        return message.channel.send(" no voice channel found");
      if (!message.guild?.me?.voice.channel)
        return message.channel.send("im not in a vc");
      const connection = getVoiceConnection(message.guild?.id);
      if (
        !message.guild.me.voice.channel.members.some(
          (m) => m.user.id === message.author.id
        )
      )
        return message.channel.send("your not in this vc");
      message.channel.send("left " + message.member?.voice.channel?.name);
     void connection.destroy();
    },
  },
  {
    name: "join",
    type: "slash",
    data: new SlashCommandBuilder()
      .setName("join")
      .setDescription("Join a voice channel")
      .addChannelOption((cmd) => {
return cmd.setName("channel").setDescription("Channel to join (optional)")
      }),
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {String} cmd
     * @param {String[]} args
     * @param {Client} client
     * @returns {void}
     */
    async execute(interaction: CommandInteraction, cmd: String, args: any[], client:Shadow) {
      const otherVc = interaction.options.getChannel('channel');
      //@ts-ignore
      if (!interaction.member?.voice.channel || !otherVc)
        return interaction.reply({
          content: `You are not in a voice channel and have not choose a voice channel`,
          ephemeral: true,
        });
      let connection;
      //@ts-ignore
      let vc = otherVc ? otherVc : intertaction.member?.voice.channel
      try {
        connection = joinVoiceChannel({
          adapterCreator: interaction.guild?.voiceAdapterCreator,
          guildId: interaction.guildId,
          //@ts-ignore
          channelId: vc.id,
          selfDeaf: false,
          selfMute: false,
        });
        interaction.reply({
          //@ts-ignore
          content: `Joined channel ${vc.toString()}`,
          ephemeral: true,
        });
        if (client.queue.get(interaction.guild?.id))
          client.queue.get(interaction.guild?.id).connection = connection;
      } catch (e) {
        client.error ? client.error(e) : console.error(e);
        interaction.reply({ content: `An error acourred`, ephemeral: true });
      }
    },
  },
  {
    name: "mtest",
    async execute(message: Message, args: String[], client: Shadow) {
      const {
        joinVoiceChannel,
        createAudioPlayer,
        createAudioResource,
        entersState,
        StreamType,
        AudioPlayerStatus,
        VoiceConnectionStatus,
      } = require("@discordjs/voice");

      const player = createAudioPlayer();

      const resource = createAudioResource(
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        {
          inputType: StreamType.Arbitrary,
        }
      );

      /*
        We will now play this to the audio player. By default, the audio player will not play until
        at least one voice connection is subscribed to it, so it is fine to attach our resource to the
        audio player this early.
    */
      player.play(resource);
    },
  },
  {
    name: "youtube",
    aliases: ["yt"],
    description: "Search on YouTube",
    async execute(message: Message, args: String[], client: Shadow) {
      const yts = require("yt-search");

      if (!args.length) return message.reply("No search query given"); //Checks if the user gave any search queries
      const { all } = await yts.search(args.join(" ")); //Searches for videos
      if (all.length === 0)
        return message.reply({
          content:
            "The query **" +
            args.join(" ") +
            "** was not found anywhere on youtube",
        });
      message.reply({
        embeds: [
          new MessageEmbed().setDescription(
            all.map((data: any, i: any) => {
              return ` ${i + 1} - [${data.name}](${data.url}) - [${
                data.author
              }]`;
            })
          ),
        ],
      }); //Sends the result
    },
  },
];
