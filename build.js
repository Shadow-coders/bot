let { readFileSync, statSync, readdirSync, openSync} = require('fs')
let fs = require('fs')
let debug = []
async function walk(path) {
const BAD = ['node_modules', '.git', '.npm', '.cache']
    const something = await fs.promises
      .readdir(path, { 
        withFileTypes: true })
      .then((f) => {
        return f.filter(d => BAD.some(c => c !== d.name)).map((d) => {
            d.name = `${path}/${d.name}`.replace('//', '/')
          return d;
        });
      });

    const files = something.filter((d) => d.isFile());
    const dirs = something.filter((d) => d.isDirectory());

    for (const d of dirs) {
      const items = await walk(d.name);

      files.push(...items);
    }

    return files;
  }
  walk(__dirname + '/src').then(files => {
      files = files.filter(f => f.name.endsWith('.js'))
      for(const file of files) {
          try {
              if(!file.name.endsWith('index.js'))  require(file.name)
          debug.push({ ok: true, name: file.name })
            } catch (e) {
             debug.push({ ok: false, name: file.name, error: e })
          }
      }
      let data = []
      let bcount = 0
      let gcount = 0
      debug.forEach(element => {
          if(!element.ok) {
              bcount++
              data.push(`❌ | I can not enter ${element.name} i get this error \n ${element.error.message} `)
          } else {
            gcount++  
            data.push(`✅ | I entered ${element.name}`)
          }
      });
      console.log(`|-----------------|\n` + data.join('\n') + '\n|-----------------|')
  console.log('|----  with a total of ' + gcount + ` good files, and with a total ${bcount} bad files` + ' ----|')
    })
