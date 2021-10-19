import { promisify } from "util";
const Model = require("../models/main");

class Mongo extends require("events").EventEmitter {
  constructor(connection = null) {
    super();
    this.Model = Model;
    this.connection = connection || { n: null };
    this.ping = 0;
    this.debug = function (name: any, data: any) {
      this.emit("debug", `[${name || "DB"}] => (${data})`);
    };
    this.readyAt = Date.now();
    this.uptime = Date.now() - this.readyAt;
    this.on("events.ping", (ping: any) => {
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
      if (this.ping > require("ms")("1m") && this.logger)
        this.logger.warn(
          "[DB/PING] the database ping is over 1M \n The database is have hight slow issues nofun!"
        );
    }, 3e4);
    this.emit("ready", this);
  }
  set(key: String, value: any) {
    return new Promise(async (res, rej) => {
      await this.wait(10);
      if (!(await Model.exists({ key: key }))) {
        const data = new Model({ key: key, data: value });
        data.save();
        res({ key, value });
      }
      const data = await Model.findOneAndUpdate({ key: key }, { data: value });
      res({ key, value });
    });
  }
  async get(key: any) {
    await this.wait(10);
    const data = await Model.findOne({ key: key }).lean({ defaults: true });
    //console.log(data)
    if (!data) return null;
    //console.log(data["data"])

    return data["data"];
  }
  all(): Promise<Object> {
    return new Promise(async (res, rej) => {
      await this.wait(10);
      let data = await Model.find().lean({ defaults: true });
      res(data);
    });
  }
  delete(key: any): Promise<Boolean> {
    return new Promise(async (res, rej) => {
      await this.wait(10);
      const k = await Model.findOne({ key: key });
      if (!k) return rej(false);
      k.remove().catch((e: any) => rej(e));
      return res(true);
    });
  }
  wait(time: any): Promise<void> {
    return new Promise((res) => {
      setTimeout(() => res(), time);
    });
  }
}
export default Mongo;
