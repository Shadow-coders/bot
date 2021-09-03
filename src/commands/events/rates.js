module.exports = {
  name: "rateLimit",
  type: "event",
  once: false,
  execute(info, client) {
    client.error(info);
  },
};
