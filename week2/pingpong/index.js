const fs = require('fs')
const Koa = require('koa')
const { Pool } = require('pg')
const config = require('./config')
const app = new Koa()
const PORT = process.env.PORT || 8080

let counter = 0

const pool = new Pool({
  user: 'admin',
  host: 'postgres-svc',
  database: config.database,
  password: config.postgresPassword,
  port: 5432,
})

const createTable = async () => {
  await pool.query('CREATE TABLE pings (id INT, count INT)', (err, res) => {
    if (err) {
      console.log(err)
    } else {
      console.log(res)
    }
  })
  await insertPings()
}

const insertPings = async () => {
  await pool.query('INSERT INTO pings(id, count) VALUES(0, 0)', (err, res) => {
    if (err) {
      console.log(err)
    } else {
      console.log(res)
    }
  })
}
const initialValueInterval = setInterval(async () => {
  await pool.query('SELECT count FROM pings where id = 0', async (err, res) => {
    if (err) {
      if (err.code === '42P01') {
        await createTable()
        await insertPings()
      }
    } else if (res.rowCount === 0) {
      await insertPings()
    } else {
      clearInterval(initialValueInterval)
    }
  })
}, 2000)


app.use(async ctx => {
  await pool.query('UPDATE pings SET count = count + 1 WHERE id = 0', async (err, res) => {
    if (err) {
      console.log(err)
    }
    return res
  })
  try {
    await pool.query('SELECT count FROM pings where id = 0', async (err, res) => {
      counter = res.rows[0].count
    })
  } catch (e) {
    console.error(e)
  }
  ctx.body = `${counter}`
})

console.log(`Server started in port ${PORT}`)
app.listen(PORT)