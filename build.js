console.log("STARTING BUILD")
for(let i = 0;i < 30;i++) {
let arr = []
for(let j = 0;j < i;j++) {
arr.push('#')
}

setTimeout(console.clear, 1000)
console.log(arr.join(''))
}
