import { Shadow, Message, CommandInteraction } from '../client'
import simplydjs from 'simply-djs'
export default [
  {
    name: "calc",
    description: "get a calculater!",
    usage: "calc",
    execute(message:Message, args:String[], client:Shadow) {
      // messageCreate event
      // calculator command
      //@ts-ignore
      simplydjs.calculator(message, {
        embedColor: "#FF0000",
      });
    },
  },
  {
    name: "calculator",
    async execute(interaction:CommandInteraction, cmd:String, args:any[], client:Shadow) {
      const simplydjs = require("simply-djs");

      // messageCreate event
      // calculator command
      simplydjs.calculator(interaction, {
        embedColor: "#FF0000",
        slash: true,
      });
    },
  },
];
