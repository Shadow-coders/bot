
class Util {
constructor(ops) {

  console.warn("All of util is static!!")
  Util.toArray().forEach(element => {
    this[element[0]] = element[1]
  });
this.ops = ops
}
static toJSON() {
  return {
    getShards: Util.getShards
  }
}
static getShards(size) {
return (size / 2) * size
}
static getNumber(min,max) {
  if(!min) min = 0
  if(!max) return 0;
  min = Math.ceil(min);
  max = Math.floor(max);
  const math = Math.floor(Math.random() * (max - min) + min)
  return { min, max, math };
} 
static getRandomLetters(length) {
  if(!length) return 'NO_LENGTH_PROVIED_' + Math.random();
  let result = '';
  let characters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return { length, result };
}

static massreplace(text, arr) {
if(!text || !arr) return {result:''};
if(!typeof text === string || !Array.isArray(arr)) return {result:''};
const callback = (info, i) => {
if(!typeof info === 'object') return;
text = text.split(info.word).join(info.replaced)
}
const p = arr.forEach
p(callback)
  return text;
}
static findnumbs(text) {
  return text.replace(/[^0-9]/g, '')
}

};
module.exports = Util;