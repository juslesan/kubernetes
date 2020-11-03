const fs = require('fs')

const randomHash = Math.random().toString(36).substr(2, 36) + "-"
+ Math.random().toString(36).substr(2, 4) + "-"
+ Math.random().toString(36).substr(2, 4) + "-"
+ Math.random().toString(36).substr(2, 4) + "-"
+ Math.random().toString(36).substr(2, 36)

const writeWithTS = () => {
  const datetime = new Date();
  // writes date & time in YYYY-MM-DD format
  fs.writeFileSync('/usr/src/app/files/file.log', datetime + ": " + randomHash)
  setTimeout(writeWithTS, 5000)
}

writeWithTS()