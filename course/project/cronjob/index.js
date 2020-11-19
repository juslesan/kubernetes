const { Pool } = require('pg')
const config = require('./config')
const axios = require('axios')

const pool = new Pool({
  user: 'admin',
  host: 'proj-postgres-svc',
  database: config.database,
  password: config.postgresPassword,
  port: 5432,
})


const getLink = async () => {
  const res = await axios.get('https://en.wikipedia.org/wiki/Special:Random')
  pool.query(`INSERT INTO todos (id, todo) VALUES (DEFAULT, 'READ ${res.request.res.responseUrl}')`, (err, res) => {
    if (err) {
      console.log(err)
    } else {
      console.log(res)
    }
    pool.end()
  })
}

getLink()
console.log('DONE')
