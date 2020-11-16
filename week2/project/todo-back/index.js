const bodyParser = require('body-parser')
const express = require('express')
const app = new express()
const { Pool } = require('pg')
const config = require('./config')

const PORT = process.env.PORT || 3011
const router = express.Router()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

let todos = []

const pool = new Pool({
  user: 'admin',
  host: 'proj-postgres-svc',
  database: config.database,
  password: config.postgresPassword,
  port: 5432,
})

const createTable = async () => {
  await pool.query('CREATE TABLE todos (id serial NOT NULL, todo VARCHAR (150))', (err, res) => {
    if (err) {
      console.log(err)
    } else {
      console.log(res)
    }
  })
}

const initialValueInterval = setInterval(async () => {
  await pool.query('SELECT todo FROM todos', async (err, res) => {
    if (err) {
      if (err.code === '42P01') {
        await createTable()
      }
    } else {
      try {
        todos = res.rows.map((val) => {
          return val.todo
        })
      } catch (e) {
        console.log(e)
      }
      clearInterval(initialValueInterval)
    }
  })
}, 1000)

router.get("/", async (req, res) => {
  await pool.query('SELECT todo FROM todos', async (err, res) => {
    if (err) {
      console.log(err)
    } else {
      todos = res.rows.map((val) => {
        return val.todo
      })
      console.log(todos)
    }
  })
  res.json(todos)
})

router.post("/", async (req, res) => {
  if (req.body.todo) {
    await pool.query(`INSERT INTO todos (id, todo) VALUES (DEFAULT, '${req.body.todo}')`, (err, res) => {
      if (err) {
        console.log(err)
      } else {
        console.log(res)
        todos.push(req.body.todo)
      }
    })
    res.json(todos)
  } else {
    res.json(todos)
  }
})

app.use("/", router)

console.log(`Server started in port ${PORT}`)
app.listen(PORT)