const Koa = require('koa')
const app = new Koa()
const PORT = process.env.PORT || 5000

app.use(async ctx => {
  ctx.status = 200
  ctx.body = `OK\n`
})

console.log(`Server started in port ${PORT}`)
app.listen(PORT)