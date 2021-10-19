export default {
  name: "rateLimit",
  type: "event",
  once: false,
  execute(info: any, client: any) {
    client.logger ? client.logger.warn(info) : client.error(info);
  },
};
