const express = require('express')
const axios = require('axios')

const app = new express()
const PORT = process.env.PORT || 3000

let url

try {
  console.log(process.argv[2])
  if (!process.argv[2].includes('http://')) {
    url = 'http://' + process.argv[2]
  } else {
    url = process.argv[2]
  }
} catch (err) {
  throw new Error('Invalid argument')
}

app.use("/", async (req, res) => {
  try {
    const url_res = await axios.get(url)
    res.status(200).send(url_res.data)
  } catch (err) {
    console.log(err)
    res.status(400).send()
  }
})

console.log(`Server started in port ${PORT}`)
app.listen(PORT)