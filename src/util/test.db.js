const DB = require("./db");
const { DatabaseError } = require("./error");
const db = new DB({ logger: console, path: __dirname + "/db/test.json" });
db.on("debug", (info) => console.log(info));
db.connect();
db.set("foo" + Date.now(), "bar");
console.log(db.get("foo"));
process.on("beforeExit", (c) => {
  db.all().forEach((f) => {
    db.delete(f.key);
    console.log(f);
  });
});
