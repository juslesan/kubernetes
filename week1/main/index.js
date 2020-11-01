
const randomHash = Math.random().toString(36).substr(2, 36) + "-"
                    + Math.random().toString(36).substr(2, 4) + "-"
                    + Math.random().toString(36).substr(2, 4) + "-"
                    + Math.random().toString(36).substr(2, 4) + "-"
                    + Math.random().toString(36).substr(2, 36)

const printWithTS = () => {
  const datetime = new Date();

  // prints date & time in YYYY-MM-DD format
  console.log(datetime + ": " +  randomHash)
  setTimeout(printWithTS, 5000)
}

printWithTS()


