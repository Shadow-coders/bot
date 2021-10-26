export default {
  name: "debug",
  once: false,
  async execute(info: String, client: any) {
    if (!client.logger) return client.debug.push(info);
    if (client.debug.length > 0) {
      client.logger.debug(client.debug.join("\n"));
      client.debug = [];
      return;
    }
    client.logger.debug(info);
  },
  type: "event",
};
