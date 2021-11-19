import {
  Shadow,
  Message,
  CommandInteraction,
  MessageEmbed,
  MessageSelectMenu,
  MessageButton,
  MessageActionRow,
} from "../client";
export default class HelpPageHandler {
  public static instance: any;

  public constructor() {
    HelpPageHandler.instance = this;
  }
}
