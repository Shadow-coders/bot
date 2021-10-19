import colors from "colors";
import Discord from "discord.js";
import fs from "fs";
import { EventEmitter } from "events";
class Logger extends EventEmitter {
  // TYPEDEFS
  client: any;
  channel: String | any;
  id: String | any;
  logs: String[];

  constructor(client: Discord.Client, id: any) {
    super();
    this.client = client;
    this.channel = id ? "829753754713718816" : "829753754713718816";
    this.id = this.channel;
    this.logs = [];
    // e
    console.log("[LOGGER]".bold + " logger has started");
  }
  log(log: any, ops: any) {
    if (typeof log !== "string") {
      log = require("util").inspect(log);
    }
    let str = "[LOGGER]".bold + " " + log;
    this.emit("logCreate", str);
    console.log(str);
    const embed = new Discord.MessageEmbed()
      .setTitle("[LOG]")
      .setDescription("```bash\n" + log + "```")
      .setColor("#00ff00");

    this.client.channels.cache.get(this.id).send({ embeds: [embed] });
  }
  error(error: any) {
    if (typeof error !== "string") {
      error = require("util").inspect(error);
    }
    let str = "[ERROR]" + ` ${error}`;
    this.emit("logCreate", str);
    console.error(str);
    const embed = new Discord.MessageEmbed()
      .setTitle("[ERROR]")
      .setDescription("```bash\n" + error + "```")
      .setColor("#ff0000");
    if (!this.channel) return;
    if (!this.client.user) return;
    this.client?.channels.cache.get(this.id).send({ embeds: [embed] });
  }
  warn(log: any) {
    if (typeof log !== "string") {
      log = require("util").inspect(log);
    }
    let str = "[WARN]" + " " + log;
    this.emit("logCreate", str);
    console.warn(str);
    const embed = new Discord.MessageEmbed()
      .setTitle("[WARN]")
      .setDescription("```bash\n" + log + "```")
      .setColor("#ffff00");

    this.client?.channels.cache.get(this.id).send({ embeds: [embed] });
  }
  debug(log: any) {
    let str = "[DEBUG]" + " " + log;
    this.emit("logCreate", str);
    console.debug(str);
    if (10 > this.logs.length) return this.logs.push(log);
    const embed = new Discord.MessageEmbed()
      .setTitle("[DEBUG]")
      .setDescription("```bash\n" + this.logs.join("\n----------\n") + "```")
      .setColor("#ffffff");
    this.client.channels.cache
      .get(this.id)
      .send({ embeds: [embed] })
      .then((m: any) => (this.logs = []));
  }
}
const times = [];
process.on("uncaughtException", (err) => {
  console.error(err.message, err.name);
});
export default Logger;
