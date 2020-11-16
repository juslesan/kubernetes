const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const app = new express()
const PORT = process.env.PORT || 3000
const path = require("path")
const config = require('./config')

let data = null
let pings = '0'

app.set("view engine", "pug")
app.set("views", path.join(__dirname, "public"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const getPings = async () => {
  try {
    const res = await axios.get('http://pingpong-svc')
    pings = res.data
  } catch (e) {
    console.log(e)
  }
}

getPings()

fs.watch('/usr/src/app/files/file.log', function (event, filename) {
  data = fs.readFileSync('/usr/src/app/files/file.log', {encoding:'utf8', flag:'r'})
})

app.use("/", async (req, res) => {
  await getPings()
  res.render("index", { data, pings: `Ping / Pong ${pings}`, message: config.message},)
})

console.log(`Server started in port ${PORT}`)
app.listen(PORT)