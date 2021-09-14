const Model = require("../models/main");

class Mongo extends require("events").EventEmitter {
  constructor(connection = null) {
    super();
    this.Model = Model;
    this.connection = connection || { n: null };
    this.ping = 0;
    this.debug = function (name, data) {
      this.emit("debug", `[${name || "DB"}] => (${data})`);
    };
    this.readyAt = Date.now();
    this.uptime = Date.now() - this.readyAt;
    this.on("events.ping", (ping) => {
      this.debug(
        "HeartbeatTimer",
        "Heartbeat acknowledged, latency of " + ping + "ms."
      );
    });
    setInterval(() => (this.uptime = Date.now() - this.readyAt), 1);
    setInterval(async () => {
      this.debug("HeartbeatTimer", "sending a ping");
      let date = Date.now();
      if (!this.set) return;
      await this.set("ping", Date.now());
      this.ping = Date.now() - date;
      this.emit("events.ping", this.ping);
      if (this.ping > 1000 && this.logger)
        this.logger.warn(
          "[DB/PING] the database ping is over 1000!!\n expect low response time "
        );
    }, 3e5);
    this.emit("ready", this);
  }
  set(key, value) {
    return new Promise(async (res, rej) => {
      if (!(await Model.exists({ key: key }))) {
        const data = new Model({ key: key, data: value });
        data.save();
        res({ key, value });
      }
      const data = await Model.findOneAndUpdate({ key: key }, { data: value });
      res({ key, value });
    });
  }
  async get(key) {
    const data = await Model.findOne({ key: key });
    //console.log(data)
    if (!data) return null;
    //console.log(data["data"])

    return data["data"];
  }
  all() {
    return new Promise(async (res, rej) => {
      let data = await Model.find();
      res(data);
    });
  }
  delete(key) {
    return new Promise(async (res, rej) => {
      const k = await Model.findOne({ key: key });
      if (!k) return rej(false);
      k.remove().catch((e) => rej(e));
      return res(true);
    });
  }
}
module.exports = Mongo;
