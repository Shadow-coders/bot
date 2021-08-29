const events = require('events').EventEmitter
var colors = require('colors')
let dops = {
    path: './db/cloud.json',
    logger: console,
    tables: []
}
const fs = require('fs')
let _this;
class DB extends events {
    /**
     * 
     * @param {*} ops an object of the things you need 
     */
    constructor(ops = dops) {
        super()
_this = this;
this.contructed_at = Date.now()
this.fullstorage = []
this.path = ops.path
this.logger = ops.logger
this.isClosed = true
this.on('debug', info => this.logger.debug(info))
 this.connect()
 
}
connect() {
    this.emit('debug', 'loading....')
    this.logger.log('[DB]'.bold + ' Connected to DB!')
    _this = this;
    this.readyAt = Date.now()
    this.emit('ready', {})
    this.isClosed = false
    this.database = this._get()
    this.emit('debug', 'checking for path')
    if(!fs.existsSync(this.path)) {
        this.emit('debug', '[debug]'.bold + ' writeing file...')
        fs.writeFileSync(this.path, '{}')
    }
}

/**
 * 
 * @param {string} key the key you want to get
 * @returns {*} the value of the key can be anithing 
 */
get(key) {
const item = this.database[key]
if(!item) return null;
    return item.value
}
/**
 *  
 * @param {String} key 
 * @param {*} value 
 * @returns {object} an object of the thing
 */
set(key, value) {
 let timestamp;
try {
    timestamp = this.database[key].creationStamp
} catch {
    timestamp = Date.now()
}
let lay = { key: key, value: value, timestamp: Date.now(), creationStamp: timestamp }
this.database[key] = lay
this._save()
this.emit('edit', key, value)
return lay;
}
delete(key) {
    if(!key || typeof key !== 'string') return this.logger.error('[DB]'.red.bold + ' typeof key was not string')
delete this.database[key]
this._save()
return true;
} 
all() {
    const res = []
    const db = Object.entries(this.database)
    db.forEach(entry => {
res.push(entry.pop())
    })
    return res;
}
push(key, value) {
    let data = this.database[key]
    if(!data || !Array.isArray(data['value'])) {
        data = []
    }
    this.database[key].value.push(value)
    return this._save()[key]
}
_save() {
    fs.writeFileSync(this.path, JSON.stringify(this.database, null, 2))
    return this._get()
}
_get() {
    const data = JSON.parse(fs.readFileSync(this.path).toString())
    return data; 
}
}
// module.exports = DB;

module.exports = require('./db/index')