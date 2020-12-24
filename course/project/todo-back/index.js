const bodyParser = require('body-parser')
const express = require('express')
const app = new express()
const { Pool } = require('pg')
const config = require('./config')
const PORT = process.env.PORT || 3011
const router = express.Router()
const NATS = require('nats')

const nc = NATS.connect({
  url: process.env.NATS_URL || 'nats://nats:4222'
})

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
  await pool.query('CREATE TABLE todos (id serial NOT NULL, todo VARCHAR (150), done boolean NOT NULL)', (err, res) => {
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
          return val
        })
      } catch (e) {
        console.log(e)
      }
      let ready = true
      clearInterval(initialValueInterval)
    }
  })
}, 1000)

router.get("/", async (req, res) => {
  console.log('GET / received')
  await pool.query('SELECT * FROM todos', async (err, res) => {
    if (err) {
      console.log(err)
    } else {
      console.log(res.rows)
      todos = res.rows.map((val) => {
        return val
      })
      console.log(todos)
    }
  })
  res.json(todos)
})

router.post("/", async (req, res) => {
  console.log('POST / received')
  if (req.body.todo) {
    try {
      await pool.query(`INSERT INTO todos (id, todo, done) VALUES (DEFAULT, '${req.body.todo}', 'false')`)
      await pool.query('SELECT * FROM todos', async (err, res) => {
        if (err) {
          console.log(err)
        } else {
          console.log(res.rows)
          todos = res.rows.map((val) => {
            return val
          })
          console.log(todos)
        }
      })
      nc.publish('todo_status', JSON.stringify({message: `new todo '${req.body.todo}' added`}))
      res.json(todos)
    } catch (err) {
      console.log('inserting into db failed')
      res.status(500).send()
    }
  }
})

router.get("/health", async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT todo FROM todos')
    if (!dbRes.code) {
      console.log('DB ready')
      res.status(200).send()
    } else {
      console.log('DB not ready yet')
      res.status(500).send()
    }
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
})

router.put("/todos/:id", async (req, res) => {
  console.log('Request Id:', req.params.id)
  try {
    await pool.query(`UPDATE todos SET done = TRUE WHERE id=${req.params.id}`)
    nc.publish('todo_status', JSON.stringify(
      {
        message: `todo with id ${req.params.id} set to done`
      }
    ))
    res.status(200).send()
  } catch (err) {
    console.error(err)
    res.status(501).send()
  }
})

app.use("/", router)

console.log(`Server started in port ${PORT}`)
app.listen(PORT)