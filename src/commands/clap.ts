import { 
  Shadow,
  Message,
  CommandInteraction,

 } from '../client'

export default [
  {
    name: "clap",

    execute(message:Message, args:String[], client:Shadow) {
      if (!args)
        return message.channel.send("You need a message to 👏 clap 👏");
      return message.channel.send(args.join("👏"));
    },
  },
  {
    name: "clap",
    execute(interaction:CommandInteraction, cmd:String, args:any[], client:Shadow) {
      interaction.reply(args[0].split(/ +/).join("👏"));
    },
    type: "slash",
    create(create:Function) {
      return create({
        name: "clap",
        description: "clap your message!",
        options: [
          {
            name: "message",
            type: "STRING",
            description: "the message to add 👏 to",
            required: true,
          },
        ],
      });
    },
    description: "clap your message!",
        options: [
          {
            name: "message",
            type: "STRING",
            description: "the message to add 👏 to",
            required: true,
          },
        ]
  },
];
