import { Shadow } from "../../client";
export default {
  name: "voiceStateUpdate",
  once: false,
  type: "event",
  async execute(oldState: any, newState: any, client: Shadow) {
    if (!oldState.channel && newState.channel) {
      client.emit("channeljoin", newState.channel);
    } else if (oldState.channel && !newState.channel) {
      client.emit("channelleave", oldState.channel);
    }
  },
};
