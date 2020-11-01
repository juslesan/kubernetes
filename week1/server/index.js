const Koa = require('koa')
const app = new Koa()
const PORT = process.env.PORT || 3000

const createRandomString = () => Math.random().toString(36).substr(2, 6)

const startingString = createRandomString()

app.use(async ctx => {
  const stringNow = createRandomString()
  console.log('--------------------')
  console.log(`Responding with ${stringNow}`)
  ctx.body = `Hello World!!! ${startingString}: ${stringNow}`
})

console.log(`Server started in port ${PORT}`)
app.listen(PORT)