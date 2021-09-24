class MessageConstructor {
  constructor(ops = undefined) {
    this.content = ops.content || null;
    this.embeds = ops.embeds || null;
    this.components = ops.components || null;
  }
  addEmbeds(embeds) {
    if (!Array.isArray(embeds)) embeds = [embeds];
    if (!this.embeds) this.embeds = [];
    embeds.forEach(this.embeds.push);
    return this;
  }
  addContent(content) {
    if (!content) return;
    this.content = content;
    return this;
  }
}
module.exports = MessageConstructor;
