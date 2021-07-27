module.exports = {
name: "uptime",
execute(message, args, client) {
let days = Math.floor(client.uptime / 86400000);
      let hours = Math.floor(client.uptime / 3600000) % 24;
      let minutes = Math.floor(client.uptime / 60000) % 60;
      let seconds = Math.floor(client.uptime / 1000) % 60;

      message.channel.send(`__Uptime:__\n${days}d ${hours}h ${minutes}m ${seconds}s \n
total time in ms: ${client.uptime}`);
}
}