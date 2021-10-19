import fs from "fs";
import Discord from "discord.js";
import events from "./fileHandler";
var colors = require("colors/safe");
export interface Command {
  name: String;
  description?: String;
  aliases?: String[];
  execute: Function;
  type?: String;
  id?: any;
  once?: Boolean;
  create?: Function;
  permissions?: any[];
  cooldown?: any;
  usage?: String;
}
export default class Commands extends events {
  paths: any[];
  client: any;
  path: any;
  all: any;
  json: Function;
  readyAt: Number;
  public constructor(ops = { path: "./commands/", client: null }) {
    super();
    this.paths = [];
    this.client = ops.client ?? {};
    this.path = ops.path;
    this.client.CM = this;
    if (!this.client.commands) {
      this.client.commands = new Map();
    }
    if (!this.client.events) {
      this.client.events = new Map();
    }
    if (!this.client.slash_commands) {
      this.client.slash_commands = new Map();
    }
    this.all = new Map();
    this.json = function (le: any) {
      if (!le || le === 1) return JSON.parse(JSON.stringify(this, null, 2));
      else return JSON.stringify(this);
    };
    this.readyAt = Date.now();
  }
  async removeCMD(obj: any) {
    if (typeof obj !== "object") throw "INVALID_OBJECT";
    const name = obj.id
      ? { type: "id", data: obj.id }
      : { type: "name", data: obj.name };
    if (!this.all.find((c: any) => c[name.type] === name.data)) return;
    const cmd = this.all.find((c: any) => c[name.type] === name.data);
    if (cmd.type === "event") return false;
    if (cmd.type === "slash") {
      this.client.slash_commands.delete(cmd.name);
      return this.all.delete(cmd.name);
    } else if (cmd.type === "command") {
      this.client.commands.delete(cmd.name);
      return this.client.commands.delete(cmd.name);
    }
  }
  async addCommand(cmd: Command) {
    function Args() {
      throw new Error("MISSING_ARGS");
    }
    if (!cmd.type) return Args();
    if (!cmd.name) return Args();
    if (!cmd.execute) return Args();
    if (!cmd.id) {
      cmd.id = Math.floor(Math.random() * 111111111);
    }
    if (cmd.aliases && Array.isArray(cmd.aliases)) {
      // cmd.aliases.forEach((ali:any) => {
      //   let cmdd = cmd;
      //   this.all.set(`${cmd.type}:aliases;${ali}`, cmd);
      // });
    }
    if (cmd.type === "event") {
      this.client.events.set(cmd.id, cmd);
      this.all.set(`events:${cmd.name}`, cmd);
      if (cmd.once)
        return this.client.on(cmd.name, (...args: any) =>
          cmd.execute(...args, this.client)
        );
      else
        return this.client.on(cmd.name, (...args: any) =>
          cmd.execute(...args, this.client)
        );
    } else if (cmd.type === "slash") {
      const exists = this.client.slash_commands.find(
        (c: any) => c.name === cmd.name && cmd.id !== c.id
      );
      if (exists) throw new Error("COMMAND_EXISTS");
      if (!cmd.create || !(typeof cmd.create === "function")) {
        cmd.create = async function (create: any) {
          return await create({
            name: cmd.name,
            description: cmd.description ? cmd.description : "None Provided",
          });
        };
      }
      this.all.set(`slash:${cmd.name}`, cmd);
      return this.client.slash_commands.set(cmd.id, cmd);
    } else if (cmd.type === "command") {
      const exists = this.client.commands.find(
        (c: any) => c.name === cmd.name && c.id !== cmd.id
      );
      if (exists) throw new Error("COMMAND_EXISTS");
      this.all.set(`command:${cmd.name}`, cmd);
      this.client.commands.set(cmd.id, cmd);
    }
    return cmd;
  }

  async loadthings() {
    const debug = true;
    let { path, client, paths } = this;
    // this.paths = []
    // console.log(this)
    if (typeof path !== "string")
      throw new TypeError(
        `Expecting typeof string on 'path' parameter, get '${typeof path}' instead`
      );

    if (!require("path").isAbsolute(path)) {
      path = require("path").resolve(path);
    }

    try {
      if (await fs.promises.stat(path).then((f: any) => !f.isDirectory())) {
        throw new Error("e");
      }
    } catch (e: any) {
      throw new TypeError("Path is not a valid directory! " + e.message);
    }

    const index = paths.filter((d: any) => d.path === path).length;

    if (index < 0)
      paths.push({
        path: path,
        debug: debug,
      });

    const validCmds = ["command", "event", "slash"];

    const dirents = await walk(path);
    const debugs = [];

    for (const { name } of dirents) {
      delete require.cache[name];

      let cmds;

      try {
        cmds = require(name).default;
        //    console.log(cmds)
      } catch (err) {
        debugs.push(colors.red(`| Failed to walk in ${name}`));
        this.client.error(err);

        continue;
      }

      if (cmds == null) {
        debugs.push(`| No data provided in ${name}`);

        continue;
      }

      if (!Array.isArray(cmds)) cmds = [cmds];

      debugs.push(colors.yellow(`| Walking in ${name}`));

      for (const cmd of cmds) {
        if (!isObject(cmd)) {
          debugs.push(`| Provided data is not an Object`);
          continue;
        }

        if (!("type" in cmd)) cmd.type = "command";

        const valid = validCmds.some((c) => c === cmd.type);

        if (!valid) {
          debugs.push(
            colors.red(
              `| Invalid command type '${cmd.type}' at ${
                cmd.name || cmd.channel
              }`
            )
          );

          continue;
        }

        cmd.load = true;
        cmd.path = name.replace("//", "/");

        try {
          this.addCommand(cmd);
        } catch {
          debugs.push(
            colors.red(
              `| Failed to load '${cmd.name || cmd.channel}' (${cmd.type})`
            )
          );

          continue;
        }
        debugs.push(
          colors.green(`| Loaded '${cmd.name || cmd.channel}' (${cmd.type})`)
        );
      }
    }

    if (debug) {
      client.error(debugs.join("\n")).then(console.log);
      console.log(
        "|------------------------------------------|\n" +
          debugs.join("\n") +
          "\n|------------------------------------------|"
      );
    }

    function isObject(data: any) {
      return (
        data instanceof Object &&
        !Buffer.isBuffer(data) &&
        !Array.isArray(data) &&
        !(data instanceof RegExp)
      );
    }

    async function walk(path: any) {
      const something = await fs.promises
        .readdir(path, { withFileTypes: true })
        .then((f: any) => {
          return f.map((d: any) => {
            d.name = `${path}/${d.name}`;

            return d;
          });
        });

      const files = something.filter((d: any) => d.isFile());
      const dirs = something.filter((d: any) => d.isDirectory());

      for (const d of dirs) {
        const items = await walk(d.name);

        files.push(...items);
      }

      return files;
    }
  }
  async reload() {
    this.client.commands.forEach((c: any) => this.client.commands.delete(c.id));
    this.client.slash_commands.forEach((c: any) =>
      this.client.slash_commands.delete(c.id)
    );
    const debug = true;
    let { path, client, paths } = this;
    // this.paths = []
    // console.log(this)
    if (typeof path !== "string")
      throw new TypeError(
        `Expecting typeof string on 'path' parameter, get '${typeof path}' instead`
      );

    if (!require("path").isAbsolute(path)) {
      path = require("path").resolve(path);
    }

    try {
      if (await fs.promises.stat(path).then((f: any) => !f.isDirectory())) {
        throw new Error("e");
      }
    } catch (e: any) {
      throw new TypeError("Path is not a valid directory! " + e.message);
    }

    const index = paths.filter((d: any) => d.path === path).length;

    if (index < 0)
      paths.push({
        path: path,
        debug: debug,
      });

    const validCmds = ["command", "slash"];

    const dirents = await walk(path);
    const debugs: String[] = [];

    for (const { name } of dirents) {
      delete require.cache[name];

      let cmds;

      try {
        cmds = require(name);
      } catch {
        debugs.push(`| Failed to walk in ${name}`);

        continue;
      }

      if (cmds == null) {
        debugs.push(`| No data provided in ${name}`);

        continue;
      }

      if (!Array.isArray(cmds)) cmds = [cmds];

      debugs.push(`| Walking in ${name}`);

      for (const cmd of cmds) {
        if (!isObject(cmd)) {
          debugs.push(`| Provided data is not an object`);

          continue;
        }

        if (!("type" in cmd)) cmd.type = "command";

        const valid = validCmds.some((c) => c === cmd.type);

        if (!valid) {
          continue;
        }
        cmd.path = name;
        cmd.load = true;

        try {
          this.addCommand(cmd);
        } catch {
          debugs.push(
            `| Failed to load '${cmd.name || cmd.channel}' (${cmd.type})`
          );

          continue;
        }

        debugs.push(`| Loaded '${cmd.name || cmd.channel}' (${cmd.type})`);
      }
    }

    if (debugs) {
      console.log(
        "|------------------------------------------|\n" +
          debugs.join("\n") +
          "\n|------------------------------------------|"
      );
      const send = () =>
        client.channels.cache
          .get("765669027552559149")
          .send("```\n" + debugs.join("\n") + "\n```")
          .then((m: any) => m.pin());
      setTimeout(send, 5000);
    }

    function isObject(data: any) {
      return (
        data instanceof Object &&
        !Buffer.isBuffer(data) &&
        !Array.isArray(data) &&
        !(data instanceof RegExp)
      );
    }

    async function walk(path: any) {
      const something = await fs.promises
        .readdir(path, { withFileTypes: true })
        .then((f: any) => {
          return f.map((d: any) => {
            d.name = `${path}/${d.name}`;

            return d;
          });
        });

      const files = something.filter((d: any) => d.isFile());
      const dirs = something.filter((d: any) => d.isDirectory());

      for (const d of dirs) {
        const items = await walk(d.name);

        files.push(...items);
      }

      return files;
    }
  }
}
