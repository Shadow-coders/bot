module.exports = {
name: 'messageDelete',
once: false,
async execute(message, client) {
const ch = await client.db.get('messagelogs_' + message.guild.id)
if(!ch) return;
// Ignore direct messages
	if (!message.guild) return;
	const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_DELETE',
	});
	// Since there's only 1 audit log entry in this collection, grab the first one
	const deletionLog = fetchedLogs.entries.first();

	// Perform a coherence check to make sure that there's *something*
	if (!deletionLog) return client.channels.cache.get(ch).send(message.author.id+" | "+message.content)

	// Now grab the user object of the person who deleted the message
	// Also grab the target of this action to double-check things
	const { executor, target } = deletionLog;

	// Update the output with a bit more information
	// Also run a check to make sure that the log returned was for the same author's message
	if (target.id === message.author.id) {
		client.channels.cache.get(ch).send(message.author.id+" | "+message.content + " \n deleted by: "+ executor.tag)
	} else {
		client.channels.cache.get(ch).send(message.author.id+" | "+message.content)
	}

}
}