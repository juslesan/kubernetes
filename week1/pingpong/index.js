const Koa = require('koa')
const app = new Koa()
const PORT = process.env.PORT || 3001

let counter = 0

app.use(async ctx => {
  counter += 1
  ctx.body = `pong ${counter}`
})

console.log(`Server started in port ${PORT}`)
app.listen(PORT)