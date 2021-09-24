const { MessageEmbed } = require("discord.js");

class Util {
  constructor(ops) {
    console.warn("All of util is static!!");
    Util.toArray().forEach((element) => {
      this[element[0]] = element[1];
    });
    this.ops = ops;
  }
  static toJSON() {
    return {
      getShards: Util.getShards,
    };
  }
  static getShards(size) {
    return (size / 2) * size;
  }
  static getNumber(min, max) {
    if (!min) min = 0;
    if (!max) return 0;
    min = Math.ceil(min);
    max = Math.floor(max);
    const math = Math.floor(Math.random() * (max - min) + min);
    return { min, max, math };
  }
  static casinoEmbed(msg, client, message, title) {
    let embed = new MessageEmbed();
    embed.setAuthor(
      client.user.tag,
      client.user.displayAvatarURL({ dynamic: true })
    );
    embed.setTitle("Casino - " + title);
    embed.setColor("GOLD");
    embed.setURL(
      `http://${Util.randomPart([
        "example.com",
        "youtube.com",
        "saahil.is-a.dev",
        "shadow-bot.dev",
        "localhost:" + Util.getNumber(80, 9999),
        "google.com",
        "repl.it",
        "discord.com",
        "discordapp.com",
        "soundcloud.com",
      ])}/`
    );
    if (!(typeof msg === "string") && Util.isObject(msg)) {
      Object.entries(msg).forEach((e) => {
        embed[e[0]] = e[1];
      });
    }
  }
  static randomPart(arr) {
    if (arr.length === 0) return [];
    if (arr.length === 1) return arr[0];
    const numb = Util.getNumber(0, arr.length);
    return arr[numb];
  }
  static isObject(test) {
    return (
      !Array.isArray(test) &&
      Object.isExtensible(test) &&
      !typeof test !== "object"
    );
  }
  static getRandomLetters(length) {
    if (!length) return "NO_LENGTH_PROVIED_" + Math.random();
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return { length, result };
  }

  static massreplace(text, arr) {
    if (!text || !arr) return { result: "" };
    if (!typeof text === text || !Array.isArray(arr)) return { result: "" };
    arr.forEach((info, i) => {
      if (!typeof info === "object") return;
      text = text.split(info.word).join(info.replaced);
    });
    return text;
  }
  static onlyWords(text) {
    return text.replace(/[^a-z]/g, "");
  }
  static findnumbs(text) {
    return text.replace(/[^0-9]/g, "");
  }
}
module.exports = Util;
