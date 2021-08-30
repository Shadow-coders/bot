const fs = require('fs')
module.exports = () => {
try{
    if(fs.existsSync(__dirname + '/bot')) fs.rm(__dirname + '/bot', { recursive: true })
    console.log(require('child_process').execSync('git clone --branch dev https://github.com/Shadow-coders/bot').toString())
    setTimeout(() => {
        process.exit(0)
    }, 3000)
    return true;
    
} catch (e) {
    console.error(e)
    return false;
}
}