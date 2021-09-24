module.exports = {
  name: "rateLimit",
  type: "event",
  once: false,
  execute(info, client) {
    client.logger ? client.logger.warn(info) : client.error(info);
  },
};
