const dops = require(__dirname + "/ops.json");
const fs = require("fs");
const events = require("events").EventEmitter;
var colors = require("colors");
let x;
let y;
let cons = 0;
const express = require("express");
class ARemoteDB extends events {
  constructor(ops = dops) {
    super();
    cons++;
    this.reciver = ops.reciver;
    x = 0;
    y = 0;
    this.ops = ops;
    if (!ops.reciver) {
      const prams = [
        { v: ops.uri, n: "URI" },
        { v: ops.username, n: "USERNAME" },
        { v: ops.password, n: "PASSWORD" },
      ];
      prams.forEach((pram) => {
        if (!pram.v) throw `MISSING_PRAM_${pram.n}`;
      });
      x = 8;
      y = 8;
      this.uri = ops.uri;
      this.username = ops.username;
      this.password = ops.password;
      this.ws = null;
      this.connection = null;
      this.connected = false;
      this.fetch = async function (uri, prams) {
        if (this.connection) {
          this.connection.requests++;
          this.connection.emit("request", uri, prams);
          this.connection.emit(
            "debug",
            "[REQUEST] => request is being sent to " + uri
          );
        }
        this.emit("debug", "[REQUEST] => sending request to " + uri);
        return await require("node-fetch")(uri, prams);
      };
      this.headers = {
        username: ops.username,
        password: ops.password,
        "Content-type": "application/json",
        from: "fetch@shadow",
      };
      this.ping = 0;
      this.uptime = Date.now() - this.readyAt;
      this.emit("debug", "[PING] => starting pinger..");
      setInterval(async () => {
        let date = Date.now();
        this.emit("debug", "[PING] => finding ping...");
        await this.fetch(this.uri + "/ping", {
          headers: this.headers,
        })
          .then((res) => res.json())
          .then((m) => {
            const { message } = m;
            if (!message) return this.emit("error", new Error("NO_PING_FOUND"));
            this.emit("debug", "[PING] => found a callbacked ping adding...");
            this.ping = Date.now() - date + message;
          });
        this.emit(
          "debug",
          "[PING] => connected at a rate of " + this.ping + "ms"
        );
        if (this.connection) {
          this.emit("debug", "[CONNECTION/PING] => saving ping...");
          this.connection.emit("debug", "[PING] => finding ping...");
          this.connection.ping = Date.now() - date + this.ping / 2;
          this.connection.emit(
            "debug",
            "[PING] => connected at a rate of " + this.connection.ping + "ms"
          );
          this.emit("debug", "[CONNECTION/PING] => saved");
        }
      }, 5000 * 1);
    }
    if (ops.reciver) {
      if (!ops.tables || !Array.isArray(ops.tables)) throw "INVALID_TABLES"; // invalid tables or null format: { name: 'mains', default: true/false }
      if (!ops.accounts || !Array.isArray(ops.accounts))
        throw "INVALID_ACCOUNTS"; // Missing accounts as an array fo
      this.tables = ops.tables;
      this.accounts = new Map();
      this.port = ops.port;
      this.path = ops.path || "./db/";
      this.see = ops.see || true;
      ops.accounts.forEach((acc, i) => {
        if (!acc.username) throw `INVALID_USERNAME @ ${i}`;
        if (!acc.password) throw `INVALID_PASSWORD @ ${i}`;
        acc["createdstamp"] = Date.now();
        acc.id = Buffer.from(`${Date.now()}`).toString("base64").trim();
        this.accounts.set(`${acc.username}@${acc.password}`, acc);
      });
      this.uptime = Date.now() - this.readyAt;
      this.Isclosed = true;
      x = 64;
      y = 64;
      this.debug = function (info, info2) {
        if (info2) {
          info = +info2;
        }
        this.emit("debug", info);
      };
      this.tables.forEach((t) => {
        if (!fs.existsSync(this.path)) {
          fs.mkdirSync(this.path);
        }
        if (!fs.existsSync(this.path + "/" + t.name)) {
          fs.mkdir(this.path + `/${t.name}`, null, (err) => {
            if (err) {
              throw err;
            }
            if (!fs.existsSync(this.path + `/${t.name}/${t.name}.json`)) {
              fs.writeFileSync(this.path + `/${t.name}/${t.name}.json`, "{}");
            }
            if (!fs.existsSync(this.path + `/${t.name}/raw.json`)) {
              fs.writeFileSync(this.path + `/${t.name}/raw.json`, "{}");
            }
            if (!fs.existsSync(this.path + `/${t.name}/pretty.json`)) {
              fs.writeFileSync(this.path + `/${t.name}/pretty.json`, "{}");
            }
            if (!fs.existsSync(this.path + `/${t.name}/logs.txt`)) {
              fs.writeFileSync(
                this.path + `/${t.name}/logs.txt`,
                `Created today at ${new Date().toTimeString()} `
              );
            }
          });
        } else {
          if (!fs.existsSync(this.path + `/${t.name}/${t.name}.json`)) {
            fs.writeFileSync(this.path + `/${t.name}/${t.name}.json`, "{}");
          }
          if (!fs.existsSync(this.path + `/${t.name}/raw.json`)) {
            fs.writeFileSync(this.path + `/${t.name}/raw.json`, "{}");
          }
          if (!fs.existsSync(this.path + `/${t.name}/pretty.json`)) {
            fs.writeFileSync(this.path + `/${t.name}/pretty.json`, "{}");
          }
          if (!fs.existsSync(this.path + `/${t.name}/logs.txt`)) {
            fs.writeFileSync(
              this.path + `/${t.name}/logs.txt`,
              `Created today at ${new Date().toTimeString()} `
            );
          }
        }
      });
    }
  }
  async get(key, table) {
    if (!table) table = "main";
    let res;
    await this.fetch(
      this.uri + `/${table}/callback?key=` + encodeURI(key) + `&table=${table}`,
      {
        method: "get",
        headers: this.headers,
      }
    ).then((req) => req.json().then((json) => (res = json)));
    return (await res["message"]) || res["error"] || null;
  }

  async all(table) {
    if (!table) table = "main";
    let res = await this.fetch(this.uri + `/${table}/callback`, {
      headers: this.headers,
      method: "patch",
      body: JSON.stringify({ table: table }),
    }).then((res) => res.json());
    return res.message;
  }
  /**
   *
   * @param {String} table
   * @param {String} key
   * @param {*} value
   * @returns value
   */
  async set(key, value, table) {
    if (!table) table = "main";
    let res;
    if (typeof key !== "string") return false;
    if (typeof value === "function") {
      value = [{}];
    }
    let timestamp;
    try {
      timestamp = this.database[key].creationtimestamp;
    } catch {
      timestamp = Date.now();
    }
    const body = { key: key, value: value, table: table };
    await this.fetch(this.uri + `/${table}/callback`, {
      method: "post",
      headers: this.headers,
      body: JSON.stringify(body),
    }).then((req) => req.json().then((json) => (res = json)));
    this.emitSet(table, key, value);
    return (await res["message"]) || null;
  }
  /**
   *
   * @param {String} table
   * @param {String} key
   * @returns {Boolean} true or false
   */
  async delete(key, table) {
    if (!table) table = "main";
    let res = await this.fetch(this.uri + `/${table}/callback`, {
      method: "delete",
      headers: this.headers,
      body: JSON.stringify({ key: key, table: table }),
    });
    if (!res.status === 204) return null;
    this.emitDelete(table, key);
    return res.status === 204 ? true : false;
  }
  emitDelete(t, k) {
    this.emit("delete", k, t);
    this.emit("remove", k, t);
  }
  emitSet(t, k, v) {
    this.emit("set", t, k, v);
    this.emit("change", t, k, v);
  }
  /**
   * @readonly
   * @returns {undefined}
   */
  async connect() {
    if (this.reciver) {
      // a lot of code here lol
      this.emit("debug", "[SERVER] => starting server...");
      this.readyAt = Date.now();
      this.app = express();
      const app = this.app;
      this.Isclosed = false;
      if (!this.see) {
        app.get("/", (req, res) => res.send("bruh"));
      } else {
        app.get("/", (req, res) => {
          res.json({
            endpoints: [
              {
                GET: "/callback",
                POST: "/v-changes",
                POST: "/data",
                GET: "/callback-data",
                GET: { name: "/login", works: true },
                GET: "/data",
              },
            ],
            Authorisation: "username@password <-- format",
            out: false,
          });
        });
        app.get("/login", (req, res) => {
          res.sendFile(__dirname + "/files/index.html");
        });
        app.get("/data", (req, res) => {
          if (
            !this.accounts.get(`${req.query.username}@${req.query["password"]}`)
          )
            return res
              .status(401)
              .json({ status: 401, error: "INVALID_LOGIN" });
          let table;
          if (!req.query.table) {
            table = this.tables.filter((t) => t.default)[0] || this.tables[0];
          }
          if (this.Isclosed) return res.status(403).json({ message: "closed" });

          let db = Object.entries(
            JSON.parse(
              fs.readFileSync(
                `${this.path}${req.query.table}/${req.query.table}.json`
              )
            )
          );
          let ress = [];
          for (const entry of db) {
            ress.push(entry.pop());
          }
          res.status(200).json({ message: ress || "" });
        });
      }
      app.get("/ping", async (req, res) => {
        const date = Date.now();
        if (
          !this.accounts.get(
            `${req.headers["username"]}@${req.headers["password"]}`
          )
        )
          return res.status(401).json({ status: 401, error: "INVALID_LOGIN" });

        await res.json({ message: `${Date.now() - date}` });
        this.ping = Date.now() - date;
      });
      app.get("/disconnect", (req, res) => {
        if (
          !this.accounts.get(
            `${req.headers["username"]}@${req.headers["password"]}`
          )
        )
          return res.status(401).json({ status: 401, error: "INVALID_LOGIN" });
        setTimeout(() => {
          res.status(204);
        }, 500);
      });

      app.get("/connection", (req, res) => {
        this.errormessage = { status: 401, message: "INVALID_LOGIN" };
        if (
          !this.accounts.get(
            `${req.headers["username"]}@${req.headers["password"]}`
          )
        )
          return res.status(401).json({ status: 401, error: "INVALID_LOGIN" });
        const start = req.headers["password"].split("");
        const last = req.headers["password"].slice(
          req.headers["password"].length - 1
        );
        const hash = [];
        start.forEach((l) => hash.push("*"));
        console.log(`new login, {
            username: ${req.headers["username"]}
            password: ${start[0] + hash.join("") + last}
        }`);
        res.json({
          connected: true,
          credentials: {
            username: req.headers["username"],
            date: Date.now(),
            date2: new Date(),
          },
        });
      });
      app.use(express.json());
      app.use((req, res, next) => {
        this.emit("debug", "[REQUEST] => new request @ " + req.url);
        this.emit("request", req, res, next);
        next();
      });
      this.emit("debug", "[SERVER] => Loading table events ");
      this.tables.forEach((TABLE) => {
        TABLE = TABLE.name;
        app.post(`/${TABLE}/callback`, (req, res) => {
          if (
            !this.accounts.get(
              `${req.headers[`username`]}@${req.headers[`password`]}`
            )
          )
            return res
              .status(401)
              .json({ status: 401, error: `INVALID_LOGIN` });
          if (!req.body.key || !req.body.value)
            return res
              .status(400)
              .json({ status: 400, message: `MISSING_QUERYS` });
          let table;
          let user;
          let timestamp;
          this.debug(`[DB] => prams found`);
          try {
            table = req.body[`table`];
          } catch {
            table = this.tables[0].name;
          }
          const old = JSON.parse(
            fs.readFileSync(this.path + `/${table}/${table}.json`)
          );
          try {
            timestamp = JSON.parse(
              fs.readFileSync(this.path + `/${table}/${table}.json`)
            )[req.body.key].creationtimestamp;
          } catch {
            timestamp = Date.now();
          }
          try {
            user = JSON.parse(
              fs.readFileSync(this.path + `/${table}/${table}.json`)
            )[req.body.key].user.created;
          } catch {
            user = req.headers[`username`];
          }
          const body = {
            key: req.body.key,
            value: req.body.value,
            creationtimestamp: timestamp,
            lasteditstamp: Date.now(),
            user: {
              created: user,
              last_edit: req.headers[`username`],
            },
          };
          if (this.Isclosed) return res.status(403).json({ message: `closed` });

          const Table = JSON.parse(
            fs.readFileSync(this.path + `/${table}/${table}.json`)
          );
          Table[req.body.key] = body;

          fs.appendFileSync(
            `${this.path}/${table}/logs.txt`,
            `\nthe item ${req.body.key} now is equal to ${
              req.body.value
            } this was by ${
              body.user.last_edit
            } | Today at ${new Date().toLocaleTimeString()}`
          );
          this._saveDatabase(table, Table);
          this.emitSet(req.body.table, req.body.key, req.body.value);
          if (old[req.body.key]) {
            res.status(200).json({ status: 200, message: body });
          } else {
            res.status(201).json({ status: 201, message: body });
          }
        });
        app.delete(`/${TABLE}/callback`, (req, res) => {
          if (
            !this.accounts.get(
              `${req.headers[`username`]}@${req.headers[`password`]}`
            )
          )
            return res
              .status(401)
              .json({ status: 401, error: `INVALID_LOGIN` });
          const body = req.body;
          // console.log(body)
          if (this.Isclosed) return res.status(403).json({ error: `closed` });
          const Table = JSON.parse(
            fs.readFileSync(`${this.path}/${body.table}/${body.table}.json`)
          );
          if (!Table[body.key])
            return res.status(404).json({ message: null, invalid: true });
          delete Table[body.key];
          fs.appendFileSync(
            `${this.path}/${body.table}/logs.txt`,
            `\n deleted ${body.key}`
          );
          this._saveDatabase(body.table, Table);
          res.status(204).end();
          this.emitDelete(req.body.table, req.body.key);
        });
        app.patch(`/${TABLE}/callback`, (req, res) => {
          if (
            !this.accounts.get(
              `${req.headers[`username`]}@${req.headers[`password`]}`
            )
          )
            return res
              .status(401)
              .json({ status: 401, error: `INVALID_LOGIN` });
          req.query.table = req.body["table"];
          console.log(req.body);
          if (this.Isclosed) return res.status(403).json({ error: `closed` });

          let db = Object.entries(
            JSON.parse(
              fs.readFileSync(
                `${this.path}${req.query.table}/${req.query.table}.json`
              )
            )
          );
          let ress = [];
          for (const entry of db) {
            ress.push(entry.pop());
          }
          res.status(200).json({ status: 200, message: ress || [] });
        });
        app.get(`/${TABLE}/callback`, (req, res) => {
          if (
            !this.accounts.get(
              `${req.headers[`username`]}@${req.headers[`password`]}`
            )
          )
            return res
              .status(401)
              .json({ status: 401, message: `INVALID_LOGIN` });
          if (!req.query.key)
            return res
              .status(400)
              .json({ status: 400, message: `Missing ?key=<name>` });
          if (!req.query.table)
            return res
              .status(400)
              .json({ status: 400, message: `Missing &table=<name>` });
          if (this.Isclosed) return res.status(403).json({ error: `closed` });
          const object = JSON.parse(
            fs.readFileSync(
              this.path + `/${req.query.table}/${req.query.table}.json`
            )
          )[req.query.key];
          if (req.query.raw) {
            res.status(200).json({ status: 200, message: object });
          } else {
            try {
              res.status(200).json({ status: 200, message: object["value"] });
            } catch {
              res.status(200).json({ status: 200, message: null });
            }
          }
        });
      });

      this.emit("debug", `[SERVER] => loaded ${this.tables.length} table(s)`);
      this.server = app.listen(this.port, () => {
        this.emit("debug", "[SERVER] => server running");
        this.emit("ready");
      });
    } else {
      let connection = await this.fetch(this.uri + "/connection", {
        headers: this.headers,
      }).catch((e) => {
        try {
          console.error(e.message.bgRed);
          this.emit("debug", `[CONNECTION/ERROR] => ${e.message}`);
        } finally {
          this.emit("debug", "[CONNECTION] => exiting... ");
          process.exit(1);
        }
      });
      connection.json().then(async (j) => {
        if (j["message"] === "LOGGED_IN") {
          this.fetch(this.uri + "/disconnect", {
            headers: this.headers,
          }).then(async (res) => {
            connection = await this.fetch(this.uri + "/connection", {
              headers: this.headers,
            });
          });
        }
      });
      if (!connection) throw new Error("stop it, i have no connection :(");
      this.emit("debug", "[CONNECTION] => creating connection");
      this.connection = new events();
      let list = {
        ping: 0,
        readyAt: Date.now(),
        uptime:
          Date.now() - this.connection.readyAt
            ? this.connection.readyAt
            : Date.now(),
        constroctur: {
          unconstoctied: ARemoteDB,
          constroucted: this,
        },
        uri: this.uri,
        disconnect: this.disconnect,
        reconnect: this.connect,
        fetch: this.fetch,
        fetchData: connection,
        requests: 0,
      };
      function fix(array) {
        const res = [];
        array.forEach((e) => {
          res.push({ name: e[0], value: e[1] });
        });
        return res;
      }
      list = fix(Object.entries(list));
      list.forEach((th) => {
        this.connection[th.name] = th.value;
      });

      this.on("connect", () => this.emit("ready"));
      this.emit("connect", this.connection);

      this.connection.emit("open");
      return this.connection;
    }
  }

  /**
   * subscribe to github repository so that you can receive feeds related to it
   * @param {string} reason reason of closing/
   * @readonly
   */
  async close(r) {
    if (!this.reciver) {
      await this.fetch(this.uri + "/disconnect", {
        method: "get",
        headers: this.headers,
      });
      this.connection = null;
      this.Isclosed = true;
    } else {
      this.Isclosed = true;
    }
  }
  destroy(r) {
    if (!this.reciver) {
      process.exit(1);
    } else {
      this.server.close(() => {
        process.exit(1);
      });
    }
  }
  _saveDatabase(t, data) {
    if (!this.reciver) return;
    fs.writeFileSync(
      this.path + `/${t}/${t}.json`,
      JSON.stringify(data, null, 2)
    );
    fs.writeFileSync(`${this.path}/${t}/raw.json`, JSON.stringify(data));
    fs.writeFileSync(
      `${this.path}/${t}/pretty.json`,
      JSON.stringify(data, null, 2)
    );
    fs.appendFileSync(`${this.path}/${t}/logs.txt`, `\n Database Saved!`);
  }
  /**
   *
   * @param {String} table
   * @returns all funcs and events for this table
   *
   */
  focus(table = "main") {
    const item = {};

    //     item.set = async function(key, value) {
    //         return await this.set(table, key, value)
    //     }
    //     item.get = async function(key) {
    //      // this.get(table, key)
    //     return 404;
    //     }
    //     item.delete = async function(key) {
    //         return await this.delete(table, key)
    //     }
    // item.all = async function() {
    //     return await this.all(table)
    // }
    // item.getRaw = async function(key) {
    //     return await this.getRaw(table, key)
    // }
    // item.on = this.on
    return {
      set: function (key, value) {
        return this.set;
      },
      get: function (key) {
        return this.get;
      },
    };
  }
  async cleanVersion() {
    return {
      set: this.set,
      get: this.get,
      delete: this.delete,
      all: this.all,
    };
  }

  async getRaw(key, table) {
    if (!table) table = "main";
    await this.fetch(
      this.uri +
        `/${table}/callback?key=${encodeURIComponent(
          key
        )}&table=${table}&raw=true`,
      {
        headers: this.headers,
      }
    )
      .then((res) => res.json())
      .then((json) => {
        return json;
      });
  }
  async push(table, key, array) {
    let value = await this.get(table, key);
    if (!value || !Array.isArray(value)) {
      value = [];
    }
    value.push(array);
    return await this.set(table, key, value);
  }
  async add(table, key, number) {
    let value = await this.get(table, key);
    if (!value || !typeof value === "number") {
      value = 0;
    }
    if (!number || !typeof number === "number") {
      value++;
    } else {
      value = value + number;
    }

    return await this.set(table, key, value);
  }
}
process.on("uncaughtException", (err) => console.error(err));
module.exports = ARemoteDB;
