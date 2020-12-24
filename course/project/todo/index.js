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
      console.log(`${req.body} add todo request sent`)
      res.redirect("/project")
    }
  } catch (err) {
    console.log(`${req.body} add todo request failed`)
    res.redirect("/project")
  }
})

router.get("/todos/:id", async (req, res) => {
  console.log(req.params.id)
  try {
    await axios.put(`http://todo-back-svc/todos/${req.params.id}`)
    res.redirect("/project")
  } catch (err) {
    console.error(err)
  }
    
})

router.get("/", async (req, res) => {
  await getTodos()
  console.log('GET / received')
  res.render("index", { todos })
  console.log(todos)
})

router.get("/health", async (req, res) => {
  try {
    const res1 = await axios.get('http://todo-back-svc')
    const res2 = await axios.get('http://image-svc')
    res.status(200).send()
    console.log('Health probe passed')
  } catch (err) {
    console.log(err) 
    res.status(500).send()
  }
})

app.use("/", router)

console.log(`Server started in port ${PORT}`)
app.listen(PORT)