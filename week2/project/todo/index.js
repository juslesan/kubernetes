const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const app = new express()
const PORT = process.env.PORT || 3010
const path = require("path")
const router = express.Router()

let todos = []

app.set("view engine", "pug")
app.set("views", path.join(__dirname, "public"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const getTodos = async () => {
  try {
    const res = await axios.get('http://todo-back-svc')
    todos = res.data
  } catch (e) {
    console.log(e)
  }
}

router.post("/", async (req, res) => {
  try {
    if (req.body.length > 140) {
      res.json({error: 'Todo must be under 140 characters'})
    } else {
      const newTodos = await axios.post('http://todo-back-svc', req.body)
      todos = newTodos.data
      console.log(`${req.body} added to database`)
      res.redirect("/project")
    }
  } catch (err) {
    res.json(err)
  }
})

router.get("/", async (req, res) => {
  await getTodos()
  res.render("index", { todos })
})

app.use("/", router)

console.log(`Server started in port ${PORT}`)
app.listen(PORT)