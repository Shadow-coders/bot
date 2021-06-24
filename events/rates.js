module.exports = {
name: 'rateLimit',
once: false,
execute(info, client) {
client.error(info)
}
}