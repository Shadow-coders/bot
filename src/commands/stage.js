const { getVoiceConnection, joinVoiceChannel } = require("@discordjs/voice");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
module.exports = [
  {
    name: "speak",
    execute(message, args, client) {
      if (!message.member.voice.channel)
        return message.channel.send(" no voice channel found");
      if (message.member.voice.channel.type !== "stage")
        return message.channel.send("not a stage channel");
      if (message.guild.me.voice.channel)
        message.member.setChannel(message.guild.me.voice.channel.id);
    },
  },
  {
    name: "dc",
    async execute(interaction, cmd, args, client) {
      const message = interaction;
      if (
        !message.member.voice.channel ||
        !message.member.permissions.has("MANAGE_GUILD")
      )
        return message.channel.send(" no voice channel found");
      if (!message.guild.me.voice.channel)
        return message.channel.send("im not in a vc");
      const connection = getVoiceConnection(message.guild.id);
      if (
        !message.guild.me.voice.channel.members.some(
          (m) => m.user.id === message.author.id
        )
      )
        return message.channel.send("your not in this vc");
      message.channel.send("left " + message.member.voice.channel.name);
      connection.destroy();
    },
    type: "slash",
    data: new SlashCommandBuilder()
      .setName("music")
      .setDescription("Music commands")
      .addSubcommand((cmd) => {
        return cmd.setName("dc").setDescription("Disconect from a vc");
      }),
  },
  {
    name: "dc",
    execute(message, args, client) {
      if (
        !message.member.voice ||
        !message.member.permissions.has("MANAGE_GUILD")
      )
        return message.channel.send(" no voice channel found");
      if (!message.guild.me.voice.channel)
        return message.channel.send("im not in a vc");
      const connection = getVoiceConnection(message.guild.id);
      if (
        !message.guild.me.voice.channel.members.some(
          (m) => m.user.id === message.author.id
        )
      )
        return message.channel.send("your not in this vc");
      message.channel.send("left " + message.member.voice.channel.name);
      connection.destroy();
    },
  },
  {
    name: "join",
    type: "slash",
    data: new SlashCommandBuilder()
      .setName("music")
      .setDescription("Music commands")
      .addSubcommand((cmd) =>
        cmd.setName("join").setDescription("Join a voice channel")
      ),
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {String} cmd
     * @param {String[]} args
     * @param {Client} client
     * @returns {void}
     */
    async execute(interaction, cmd, args, client) {
      if (!interaction.member.voice.channel)
        return interaction.reply({
          content: `You are not in a voice channel`,
          ephemeral: true,
        });
      let connection;
      try {
        connection = joinVoiceChannel({
          adapterCreator: interaction.guild.voiceAdapterCreator,
          guildId: interaction.guildId,
          channelId: interaction.member.voice.channel.id,
          selfDeaf: false,
          selfMute: false,
        });
        interaction.reply({
          content: `Joined channel ${interaction.member.voice.channel}`,
          ephemeral: true,
        });
      } catch (e) {
        client.error(e);
        interaction.reply({ content: `An error acourred`, ephemeral: true });
      }
    },
  },
  {
    name: "mtest",
    async execute(message, args, client) {
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
    async execute(message, args, client) {
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
      message.reply({ embeds: [new MessageEmbed()] }); //Sends the result
    },
  },
];
