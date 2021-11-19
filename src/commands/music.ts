import {
  Message,
  Shadow,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "../client";
let { raw } = require("youtube-dl-exec");
const ytdl = require("ytdl-core");
const { SlashCommandBuilder } = require("@discordjs/builders");

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  entersState,
  StreamType,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  getVoiceConnection,
  demuxProbe,
} = require("@discordjs/voice");
const { Music } = require("../util/Music");
//console.log(Music)
let MusicSystem = new Music();
let { execute, skip, stop } = MusicSystem;
// function changeVol(message, serverQueue, args) {
//     message.channel.send("set volume to " + parseInt(args));
//     //serverQueue.volume = parseInt(args);
//     //  serverQueue.connection.dispatcher.setVolumeLogarithmic(parseInt(args[0]) / 5)
// };

// async function execute(message, serverQueue, args, NoMessage) {

//   const voiceChannel = message.member.voice.channel;
//   if (!voiceChannel)
//     return message.channel.send(
//       "You need to be in a voice channel to play music!"
//     );
//   const permissions = voiceChannel.permissionsFor(message.client.user);
//   if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
//     return message.channel.send(
//       "I need the permissions to join and speak in your voice channel!"
//     );
//   }
//     const yts = require( 'yt-search' )
// let video = await yts(args[0])
// video = { all: video.all.filter(v => v.type === 'video') }
// if(video.all.length === 0) {
// if(!NoMessage) message.channel.send({ content: `Cannot find song **${args[0]}** ` })
// return;
// }
//   const songInfo = video.all[0]
//   const song = {
//         title: songInfo.title,
//         url: songInfo.url,
// other: songInfo
//    };

//   if (!serverQueue) {
//     let queueContruct = {
// songs: [],
// voiceChannel: voiceChannel,
// textChannel: message.channel,
// player: null,
// playing: true,
// volume: 5
//     }
// // console.log(song.other)
//     message.client.queue.set(message.guild.id, queueContruct);

//     queueContruct.songs.push(song);

//     try {
//       var connection = joinVoiceChannel({
//         channelId: message.member.voice.channel.id,
//         guildId: message.member.guild.id,
//         adapterCreator: message.member.guild.voiceAdapterCreator,
//     })
// // console.log(connection)
//       queueContruct.connection = connection;
// if(message.member.voice.channel.type === 'GUILD_STAGE_VOICE') {
// setTimeout(() => {
// message.guild.me.voice.setSuppressed(false).catch(err => {
// message.client.error(err)
// message.guild.me.voice.setRequestToSpeak(true);
// message.reply("Faild to set as speaking request send.")
// })
// }, 3000)

// }
//       play(message, queueContruct.songs[0], NoMessage);
//     } catch (err) {
//       message.client.error(err);
// if(queueContruct.connection) {
// queueContruct.connection.destroy()
// }
//     //  message.client.queue.delete(message.guild.id);
//       return message.channel.send(err.message);
//     }
//   } else {
//     serverQueue.songs.push(song);
//     return message.channel.send(`${song.title} has been added to the queue!`);
//   }
// }

// function skip(message, serverQueue) {
//   if (!message.member.voice.channel)
//     return message.channel.send(
//       "You have to be in a voice channel to stop the music!"
//     );
//   if (!serverQueue)
//     return message.channel.send("There is no song that I could skip!");
// serverQueue.songs[0].looped = false
// serverQueue.songs[0].skipped = true
// serverQueue.player.stop();
// }

// function stop(message, serverQueue) {
//   if (!message.member.voice.channel)
//     return message.channel.send(
//       "You have to be in a voice channel to stop the music!"
//     );

//   if (!serverQueue)
//     return message.channel.send("There is no song that I could stop!");
//   serverQueue.songs = [];
//   if(serverQueue.connection) {
// serverQueue.connection.destroy()
// serverQueue.connection = null
// serverQueue.player = null
// serverQueue.playing = false
// }
// message.channel.send(' the queue has ended!')
// message.client.queue.delete(message.guild.id)
// }

// async function play(message, song, looped) {
// const guild = message.guild
// const serverQueue = message.client.queue.get(guild.id);
//   if (!song) {
//     serverQueue.connection.destroy()
//     message.client.queue.delete(guild.id);
// message.channel.send(' the queue has ended!')
//     return;
//   }

//   const player = createAudioPlayer()
// const data = await ytdl(song.url, { filter: "audioonly" })
// let resource =  createAudioResource(data, {
// inputType: StreamType.Arbitrary,
//  })

// player.play(resource)
// let date = Date.now()
//  player.on(AudioPlayerStatus.Idle, () => {
// if(1000 > Date.now() - date) return;
// // message.reply(`IDLE ${Date.now() - date}`)
// console.log(serverQueue.songs[0])

// if(serverQueue.songs[0].looped && !serverQueue.songs[0].skipped) return play(message, serverQueue.songs[0], true);

// serverQueue.songs.shift();
//       play(message, serverQueue.songs[0]);
//     })
//    player.on("error", error => message.client.error(error.message));
//   // dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
// serverQueue.player = player;
// // message.client.error(dispatcher)
// serverQueue.connection.on(VoiceConnectionStatus.Playing, () => {
//     message.client.error('The audio player has started playing!');
//   });
// serverQueue.connection.subscribe(player)
//   if (!looped) {
// serverQueue.textChannel.send(`Start playing: **${song.title}**`);
//                }
// }
export default [
  {
    name: "play",
    catagory: "music",
    execute(message: Message, args: String[], client: Shadow) {
      const serverQueue = client.queue.get(message.guild?.id);
      execute(message, serverQueue, args);
      return;
    },
  },
  {
    name: "pause",
    aliases: ["pa"],
    catagory: "music",
    execute(message: Message, args: String[], client: Shadow) {
      const server_queue = client.queue.get(message.guild?.id);
      if (!server_queue) return message.channel.send("There is no queue");
      if (server_queue.connection.dispatcher.paused)
        return message.channel.send("Song is already paused!"); //Checks if the song is already paused.
      server_queue.connection.dispatcher.pause(); //If the song isn't paused this will pause it.
      message.channel.send("Paused the song!"); //Sends a message to the channel the command was used in after it pauses.
    },
  },
  {
    name: "resume",
    aliases: ["r", "unpause"],
    catagory: "music",
    description: "Resume the song if any",
    execute(message: Message, args: String[], client: Shadow) {
      const server_queue = client.queue.get(message.guild?.id);
      if (!server_queue) return message.channel.send("There is no queue");
      if (!server_queue.connection.dispatcher.paused)
        return message.channel.send("Song isn't paused!"); //Checks if the song isn't paused.
      server_queue.connection.dispatcher.resume(); //If the song is paused this will unpause it.
      message.channel.send("Unpaused the song!"); //Sends a message to the channel the command was used in after it unpauses.
    },
  },
  {
    name: "skip",
    catagory: "music",
    execute(message: Message, args: String[], client: Shadow) {
      const serverQueue = client.queue.get(message.guild?.id);
      if (!serverQueue)
        return message.channel.send("There is no song playing!");
      skip(message, serverQueue);
      return;
    },
  },
  {
    name: "stop",
    catagory: "music",
    execute(message: Message, args: String[], client: Shadow) {
      const serverQueue = client.queue.get(message.guild?.id);
      if (!serverQueue) return message.channel.send("There is no song to stop");
      stop(message, serverQueue);
      return;
    },
  },
  {
    name: "queue",
    aliases: ["q"],
    catagory: "music",
    execute(message: Message, args: String[], client: Shadow) {
      if (!client.queue.get(message.guild?.id))
        return message.reply("No queue found");
      let queue = client.queue
        .get(message.guild?.id)
        .songs.map((song: any, i: any) => {
          if (!song) return ``;
          return ` (${i + 1}) - **${song.title || song.name}**  - ${
            song.author?.name || song.artists.map((a: any) => a.name).join(", ")
          }`;
        })
        .slice(0, 10)
        .join("\n");
      if (!queue) return message.channel.send("There is no song playing");
      let pages = 0;
      queue = {
        embeds: [
          new MessageEmbed()
            .setTitle("Queue")
            .setDescription(queue)
            .setColor("RANDOM")
            .setTimestamp(),
        ],
        components: [
          new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId("next_queue")
                .setLabel("Next")
                .setStyle("PRIMARY")
            )
            .addComponents(
              new MessageButton()
                .setCustomId("back_queue")
                .setLabel("Back")
                .setStyle("PRIMARY")
            ),
        ],
      };
      const filter = (i: any) =>
        ["back_queue", "next_queue"].some((e) => e === i.customId) &&
        i.user.id === message.author.id;
      const collector = message.channel.createMessageComponentCollector({
        filter,
        time: 15000 * 60,
      });

      collector.on("collect", async (i) => {
        if (i.customId === "next_queue") {
          pages++;
          let embed;
          if (pages === 1) {
            await i.update({
              embeds: [
                new MessageEmbed()
                  .setTitle("Queue")
                  .setDescription(
                    client.queue
                      .get(message.guild?.id)
                      .songs.map((song: any, i: any) => {
                        if (!song) return "No data";
                        return ` (${1 + i}) - **${
                          song.title || song.name
                        }**  - ${
                          song.author.name ||
                          song.artists.map((a: any) => a.name).join(", ")
                        }`;
                      })
                      .slice(10, 20)
                      .join("\n")
                  )
                  .setColor("RANDOM")
                  .setTimestamp(),
              ],
              components: [
                new MessageActionRow()
                  .addComponents(
                    new MessageButton()
                      .setCustomId("next_queue")
                      .setLabel("Next")
                      .setStyle("PRIMARY")
                  )
                  .addComponents(
                    new MessageButton()
                      .setCustomId("back_queue")
                      .setLabel("Back")
                      .setStyle("PRIMARY")
                  ),
              ],
            });
          } else if (pages === 2) {
            await i.update({
              embeds: [
                new MessageEmbed()
                  .setTitle("Queue")
                  .setDescription(
                    client.queue
                      .get(message.guild?.id)
                      .songs.map(
                        (song: any, i: any) =>
                          ` (${i + 1}) - **${song.title || song.name}**  - ${
                            song.author.name || song.artists.join(" ")
                          }`
                      )
                      .slice(20, 30)
                      .join("\n")
                  )
                  .setColor("RANDOM")
                  .setTimestamp(),
              ],
              components: [
                new MessageActionRow()
                  .addComponents(
                    new MessageButton()
                      .setCustomId("next_queue")
                      .setLabel("Next")
                      .setStyle("SECONDARY")
                      .setDisabled(true)
                  )
                  .addComponents(
                    new MessageButton()
                      .setCustomId("back_queue")
                      .setLabel("Back")
                      .setStyle("PRIMARY")
                  ),
              ],
            });
          }

          /*	await i.update({ embeds: [new MessageEmbed().setTitle("Queue").setDescription(client.queue.get(message.guild.id).songs.map((song, i) => ` (${i}) - **${song.title}**  - ${song.id}`).slice(10, 20).join("\n")).setColor("RANDOM").setTimestamp()], components: [new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('next_queue')
					.setLabel('Next')
					.setStyle('PRIMARY')
.setDisabled(true)
,
			)
.addComponents(
				new MessageButton()
					.setCustomId('back_queue')
					.setLabel('Back')
					.setStyle('PRIMARY'),
			)]
 });
*/
        } else if (i.customId === "back_queue") {
          pages = pages - 1;
          let embed;
          if (pages === 0) {
            await i.update({
              embeds: [
                new MessageEmbed()
                  .setTitle("Queue")
                  .setDescription(
                    client.queue
                      .get(message.guild?.id)
                      .songs.map(
                        (song: any, i: any) =>
                          ` (${i}) - **${song.title}**  - ${song.id}`
                      )
                      .slice(0, 10)
                      .join("\n")
                  )
                  .setColor("RANDOM")
                  .setTimestamp(),
              ],
              components: [
                new MessageActionRow()
                  .addComponents(
                    new MessageButton()
                      .setCustomId("next_queue")
                      .setLabel("Next")
                      .setStyle("PRIMARY")
                  )
                  .addComponents(
                    new MessageButton()
                      .setCustomId("back_queue")
                      .setLabel("Back")
                      .setStyle("SECONDARY")
                      .setDisabled(true)
                  ),
              ],
            });
          } else if (pages === 1) {
            await i.update({
              embeds: [
                new MessageEmbed()
                  .setTitle("Queue")
                  .setDescription(
                    client.queue
                      .get(message.guild?.id)
                      .songs.map(
                        (song: any, i: any) =>
                          ` (${i}) - **${song.title}**  - ${song.id}`
                      )
                      .slice(10, 20)
                      .join("\n")
                  )
                  .setColor("RANDOM")
                  .setTimestamp(),
              ],
              components: [
                new MessageActionRow()
                  .addComponents(
                    new MessageButton()
                      .setCustomId("next_queue")
                      .setLabel("Next")
                      .setStyle("SECONDARY")
                      .setDisabled(true)
                  )
                  .addComponents(
                    new MessageButton()
                      .setCustomId("back_queue")
                      .setLabel("Back")
                      .setStyle("PRIMARY")
                  ),
              ],
            });
          }

          /*	await i.update({ embeds: [new MessageEmbed().setTitle("Queue").setDescription(client.queue.get(message.guild.id).songs.map((song, i) => ` (${i}) - **${song.title}**  - ${song.id}`).slice(10, 20).join("\n")).setColor("RANDOM").setTimestamp()], components: [new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('next_queue')
					.setLabel('Next')
					.setStyle('PRIMARY')
.setDisabled(true)
,
			)
.addComponents(
				new MessageButton()
					.setCustomId('back_queue')
					.setLabel('Back')
					.setStyle('PRIMARY'),
			)]
 });
*/
        }
      });

      collector.on("end", (collected) => console.log(collected));
      //@ts-ignore
      message.channel
        .send(queue)
        //@ts-ignore
        .catch(
          //@ts-ignore
          client.error ? client.error : console.error
        );
    },
  },
  {
    name: "volume",
    execute(message: Message, args: String[], client: Shadow) {
      const serverQueue = client.queue.get(message.guild?.id);
      if (!serverQueue) return message.channel.send("There is no queue!");
      const missingArgs = async function (query: any) {
        switch (query) {
          case 1:
            message.channel.send("Missing volume argument!");
            break;
          case 2:
            message.channel.send("The volume argument is not a number!");
            break;
          default:
            message.channel.send("Missing something!");
            break;
        }
      };
      if (!args[0]) return missingArgs(1);
      //@ts-ignore
      if (NaN(args[0] as Number)) return missingArgs(2);
      //changeVol(message, serverQueue, args);
    },
  },
  {
    name: "loop",
    aliases: ["l"],
    execute(message: Message, args: String[], client: Shadow) {
      if (!message?.member?.voice?.channel)
        return message.channel.send("no voice channel found");
      let queue = client.queue.get(message.guild?.id);
      if (!queue || !message?.guild?.me?.voice)
        return message.channel.send(" there is no Song playing!");
      if (queue.songs[0].looped) {
        queue.songs[0].looped = false;
        message.channel.send("No longer looping " + queue.songs[0].name);
        return;
      }
      queue.songs[0].looped = true;
      message.channel.send("Now looping " + queue.songs[0].name);
    },
  },
  {
    name: "24-7",
    catagory: "music",
    async execute(message: Message, args: String[], client: Shadow) {
      let serverQueue = client.queue.get(message.guild?.id);
      await execute(
        message,
        serverQueue,
        "https://www.youtube.com/watch?v=lTRiuFIWV54".split(" "),
        { Nomessage: true }
      );
      serverQueue.songs[0].looped = true;
      message.channel.send(
        "Now play 24-7 vibes \n link: https://www.youtube.com/watch?v=Yu2Pvc1ObRw"
      );
      return;
    },
  },
  {
    name: "play",
    type: "slash",
    data: new SlashCommandBuilder()
      .setName("play")
      .setDescription("Play Music")
      .addStringOption((option: any) =>
        option
          .setName("input")
          .setRequired(true)
          .setDescription("The song to play")
      ),
    execute(
      interaction: CommandInteraction,
      cmd: String,
      args: any[],
      client: Shadow
    ) {
      const serverQueue = client.queue.get(interaction.guild?.id);
      execute(interaction, serverQueue, args, { interaction: true });
      return;
    },
  },
  {
    name: "pause",
    aliases: ["pa"],
    type: "slash",
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {String} cmd
     * @param {String[]} args
     * @param {Client} client
     * @returns
     */
    execute(
      interaction: CommandInteraction,
      cmd: String,
      args: any[],
      client: Shadow
    ) {
      let server_queue = client.queue.get(interaction.guild?.id);
      if (!server_queue)
        return interaction.reply({
          content: "There is no queue",
          ephemeral: true,
        });
      if (server_queue.player.paused)
        return interaction.reply({
          content: "Song is already paused!",
          ephemeral: true,
        }); //Checks if the song is already paused.
      server_queue.player.pause(); //If the song isn't paused this will pause it.
      server_queue.playing = false;
      interaction.reply("Paused the song!"); //Sends a message to the channel the command was used in after it pauses.
    },
  },
  {
    name: "resume",
    aliases: ["r", "unpause"],
    description: "Resume the song if any",
    type: "slash",
    execute(
      interaction: CommandInteraction,
      cmd: String,
      args: any[],
      client: Shadow
    ) {
      const server_queue = client.queue.get(interaction.guild?.id);
      if (!server_queue)
        return interaction.reply({
          content: "There is no queue",
          ephemeral: true,
        });
      if (!server_queue?.player.paused)
        return interaction.reply({
          content: "Song isn't paused!",
          ephemeral: true,
        }); //Checks if the song isn't paused.
      server_queue?.player.resume(); //If the song is paused this will unpause it.
      interaction.reply("Unpaused the song!"); //Sends a message to the channel the command was used in after it unpauses.
    },
  },
  {
    name: "skip",
    type: "slash",
    execute(
      interaction: CommandInteraction,
      cmd: String,
      args: any[],
      client: Shadow
    ) {
      const serverQueue = client.queue.get(interaction.guild?.id);
      if (!serverQueue)
        return interaction.reply({
          content: "There is no song playing!",
          ephemeral: true,
        });
      skip(interaction, serverQueue, { slash: true });
      return;
    },
  },
  {
    name: "stop",
    type: "slash",
    execute(
      interaction: CommandInteraction,
      cmd: String,
      args: any[],
      client: Shadow
    ) {
      const serverQueue = client.queue.get(interaction.guild?.id);
      if (!serverQueue)
        return interaction.reply({
          content: "There is no song to stop",
          ephemeral: true,
        });
      stop(interaction, serverQueue, true);
      return;
    },
  },
  {
    name: "queue",
    aliases: ["q"],
    execute(
      interaction: CommandInteraction,
      cmd: String,
      args: any[],
      client: Shadow
    ) {
      let queue = client?.queue
        .get(interaction?.guild?.id)
        .songs?.map(
          (song: any, i: any) => ` (${i}) - **${song.title}**  - ${song.id}`
        )
        .slice(0, 10)
        .join("\n");
      if (!queue)
        return interaction.reply({
          content: "There is no queue",
          ephemeral: true,
        });
      let pages = 0;
      queue = {
        embeds: [
          new MessageEmbed()
            .setTitle("Queue")
            .setDescription(queue)
            .setColor("RANDOM")
            .setTimestamp(),
        ],
        components: [
          new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId("next_queue")
                .setLabel("Next")
                .setStyle("PRIMARY")
            )
            .addComponents(
              new MessageButton()
                .setCustomId("back_queue")
                .setLabel("Back")
                .setStyle("PRIMARY")
            ),
        ],
      };
      const filter = (i: any) =>
        ["back_queue", "next_queue"].some((e) => e === i.customId) &&
        i.user.id === interaction.member?.user.id;
      const collector = interaction.channel?.createMessageComponentCollector({
        filter,
        time: 6 * 1000 * 60,
      });
      let pageindex = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
      let pageendindex = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      collector?.on("collect", async (i: any) => {
        if (i.customId === "next_queue") {
          pages++;
          let embed;
          await i.message.edit({
            embeds: [
              new MessageEmbed()
                .setTitle("Queue")
                .setDescription(
                  client.queue
                    .get(interaction.guild?.id)
                    .songs.map(
                      (song: any, i: any) =>
                        ` (${i}) - **${song.title}**  - ${song.id}`
                    )
                    .slice(pageindex[pages], pageendindex[pages])
                    .join("\n")
                )
                .setColor("RANDOM")
                .setTimestamp(),
            ],
            components: [
              new MessageActionRow()
                .addComponents(
                  new MessageButton()
                    .setCustomId("next_queue")
                    .setLabel("Next")
                    .setStyle(pageendindex[pages + 1] ? "PRIMARY" : "SECONDARY")
                    .setDisabled(pageendindex[pages + 1] ? false : true)
                )
                .addComponents(
                  new MessageButton()
                    .setCustomId("back_queue")
                    .setLabel("Back")
                    .setStyle(pageendindex[pages + 1] ? "PRIMARY" : "SECONDARY")
                    .setDisabled(
                      pageindex[pages - 1] && pages - 1 !== -1 ? false : true
                    )
                ),
            ],
          });
          // if (pages === 1) {
          //   await i.message.edit({
          //     embeds: [
          //       new MessageEmbed()
          //         .setTitle("Queue")
          //         .setDescription(
          //           client.queue
          //             .get(interaction.guild.id)
          //             .songs.map(
          //               (song, i) => ` (${i}) - **${song.title}**  - ${song.id}`
          //             )
          //             .slice(10, 20)
          //             .join("\n")
          //         )
          //         .setColor("RANDOM")
          //         .setTimestamp(),
          //     ],
          //     components: [
          //       new MessageActionRow()
          //         .addComponents(
          //           new MessageButton()
          //             .setCustomId("next_queue")
          //             .setLabel("Next")
          //             .setStyle("PRIMARY")
          //         )
          //         .addComponents(
          //           new MessageButton()
          //             .setCustomId("back_queue")
          //             .setLabel("Back")
          //             .setStyle("PRIMARY")
          //         ),
          //     ],
          //   });
          // } else if (pages === 2) {
          //   await i.update({
          //     embeds: [
          //       new MessageEmbed()
          //         .setTitle("Queue")
          //         .setDescription(
          //           client.queue
          //             .get(interaction.guild.id)
          //             .songs.map(
          //               (song, i) => ` (${i}) - **${song.title}**  - ${song.id}`
          //             )
          //             .slice(20, 30)
          //             .join("\n")
          //         )
          //         .setColor("RANDOM")
          //         .setTimestamp(),
          //     ],
          //     components: [
          //       new MessageActionRow()
          //         .addComponents(
          //           new MessageButton()
          //             .setCustomId("next_queue")
          //             .setLabel("Next")
          //             .setStyle("SECONDARY")
          //             .setDisabled(true)
          //         )
          //         .addComponents(
          //           new MessageButton()
          //             .setCustomId("back_queue")
          //             .setLabel("Back")
          //             .setStyle("PRIMARY")
          //         ),
          //     ],
          //   });
          // }

          /*	await i.update({ embeds: [new MessageEmbed().setTitle("Queue").setDescription(client.queue.get(message.guild.id).songs.map((song, i) => ` (${i}) - **${song.title}**  - ${song.id}`).slice(10, 20).join("\n")).setColor("RANDOM").setTimestamp()], components: [new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('next_queue')
            .setLabel('Next')
            .setStyle('PRIMARY')
  .setDisabled(true)
  ,
        )
  .addComponents(
          new MessageButton()
            .setCustomId('back_queue')
            .setLabel('Back')
            .setStyle('PRIMARY'),
        )]
   });
  */
        } else if (i.customId === "back_queue") {
          pages = pages - 1;
          let embed;
          await i.message.edit({
            embeds: [
              new MessageEmbed()
                .setTitle("Queue")
                .setDescription(
                  client.queue
                    .get(interaction.guild?.id)
                    .songs.map(
                      (song: any, i: any) =>
                        ` (${i}) - **${song.title}**  - ${song.id}`
                    )
                    .slice(0, 10)
                    .join("\n")
                )
                .setColor("RANDOM")
                .setTimestamp(),
            ],
            components: [
              new MessageActionRow()
                .addComponents(
                  new MessageButton()
                    .setCustomId("next_queue")
                    .setLabel("Next")
                    .setStyle(pageendindex[pages + 1] ? "PRIMARY" : "SECONDARY")
                    .setDisabled(pageendindex[pages + 1] ? false : true)
                )
                .addComponents(
                  new MessageButton()
                    .setCustomId("back_queue")
                    .setLabel("Back")
                    .setStyle(
                      pageindex[pages - 1] && pages - 1 !== -1
                        ? "PRIMARY"
                        : "SECONDARY"
                    )
                    .setDisabled(
                      pageindex[pages - 1] && pages - 1 !== -1 ? false : true
                    )
                ),
            ],
          });
          // } else if (pages === 1) {
          //   await i.update({
          //     embeds: [
          //       new MessageEmbed()
          //         .setTitle("Queue")
          //         .setDescription(
          //           client.queue
          //             .get(interaction.guild.id)
          //             .songs.map(
          //               (song, i) => ` (${i}) - **${song.title}**  - ${song.id}`
          //             )
          //             .slice(10, 20)
          //             .join("\n")
          //         )
          //         .setColor("RANDOM")
          //         .setTimestamp(),
          //     ],
          //     components: [
          //       new MessageActionRow()
          //         .addComponents(
          //           new MessageButton()
          //             .setCustomId("next_queue")
          //             .setLabel("Next")
          //             .setStyle("SECONDARY")
          //             .setDisabled(true)
          //         )
          //         .addComponents(
          //           new MessageButton()
          //             .setCustomId("back_queue")
          //             .setLabel("Back")
          //             .setStyle("PRIMARY")
          //         ),
          //     ],
          //   });
          // }

          /*	await i.update({ embeds: [new MessageEmbed().setTitle("Queue").setDescription(client.queue.get(message.guild.id).songs.map((song, i) => ` (${i}) - **${song.title}**  - ${song.id}`).slice(10, 20).join("\n")).setColor("RANDOM").setTimestamp()], components: [new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('next_queue')
            .setLabel('Next')
            .setStyle('PRIMARY')
  .setDisabled(true)
  ,
        )
  .addComponents(
          new MessageButton()
            .setCustomId('back_queue')
            .setLabel('Back')
            .setStyle('PRIMARY'),
        )]
   });
  */
        }
      });
      queue.fetchReply = true;
      const m = interaction.reply(queue);
      collector?.on("end", (collected) => {
        //@ts-ignore
        m.edit({
          //@ts-ignore
          embeds: m.embeds,
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setDisabled(true)
                .setStyle("SECONDARY")
                .setLabel("Next"),
              new MessageButton()
                .setDisabled(true)
                .setStyle("SECONDARY")
                .setLabel("Back")
            ),
          ],
        });
      });
    },
  },
  {
    name: "volume",
    type: "slash",
    execute(
      interaction: CommandInteraction,
      cmd: String,
      args: any[],
      client: Shadow
    ) {
      const serverQueue = client.queue.get(interaction.guild?.id);
      if (!serverQueue) return interaction.reply("There is no queue!");
      const missingArgs = async function (query: any) {
        switch (query) {
          case 1:
            interaction.reply("Missing volume argument!");
            break;
          case 2:
            interaction.reply("The volume argument is not a number!");
            break;
          default:
            interaction.reply("Missing something!");
            break;
        }
      };
      if (!args[0]) return missingArgs(1);
      //@ts-ignore
      if (NaN(args[0])) return missingArgs(2);
      //  changeVol(interaction, serverQueue, args, true);
    },
  },
  {
    name: "loop",
    aliases: ["l"],
    type: "slash",
    execute(
      interaction: CommandInteraction,
      cmd: String,
      args: any[],
      client: Shadow
    ) {
      //@ts-ignore
      if (!interaction?.member?.voice?.channel)
        return interaction.reply("no voice channel found");
      let queue = client.queue.get(interaction.guild?.id);
      if (!queue || !interaction.guild?.me?.voice)
        return interaction.reply(" there is no Song playing!");
      if (queue.songs[0].looped) {
        queue.songs[0].looped = false;
        interaction.reply("No longer looping " + queue.songs[0].name);
        return;
      }
      queue.songs[0].looped = true;
      interaction.reply("Now looping " + queue.songs[0].name);
    },
  },
  {
    name: "24-7",
    type: "slash",
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {String} cmd
     * @param {String[]} args
     * @param {Client} client
     * @returns
     */
    async execute(
      interaction: CommandInteraction,
      cmd: String,
      args: any[],
      client: Shadow
    ) {
      let serverQueue = client.queue.get(interaction.guild?.id);
      await execute(
        interaction,
        serverQueue,
        "https://www.youtube.com/watch?v=lTRiuFIWV54".split(" "),
        { noMessage: true }
      );
      serverQueue.songs[0].looped = true;
      interaction.followUp(
        "Now play 24-7 vibes \n link: https://www.youtube.com/watch?v=Yu2Pvc1ObRw"
      );
      return;
    },
  },
];
