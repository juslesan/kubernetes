const fs = require('fs')
const Koa = require('koa')
const app = new Koa()
const PORT = process.env.PORT || 3000
let data = null
let pings = '0'

try {
  pings = fs.readFileSync('/usr/src/app/files/pingpong.log', {encoding:'utf8', flag:'r'})
} catch (e) {
  console.error(e)
}

fs.watch('/usr/src/app/files/file.log', function (event, filename) {
  data = fs.readFileSync('/usr/src/app/files/file.log', {encoding:'utf8', flag:'r'})
})

fs.watch('/usr/src/app/files/pingpong.log', function (event, filename) {
  pings = fs.readFileSync('/usr/src/app/files/pingpong.log', {encoding:'utf8', flag:'r'})
})

app.use(async ctx => {
  console.log(`Responding with ${data}`)
  ctx.response.type = 'html'
  ctx.response.body = `
                      <div style="height: 100%; width:25%;">
                      <p>${data}</p>
                      <p>Ping / Pongs ${pings}</p>
                      <img alt="random image" width="100%" src="http://locahost:8001/image" style="float:left; position:relative;"/>

                      <input maxlength="120" style="float:left; position:relative;"/>
                      <button>Create TODO</button>
                      <ul>
                        <li>TODO 1</li>
                        <li>TODO 2</li>
                        <li>TODO 3</li>
                      </ul>

                      </div>
                      `
})

console.log(`Server started in port ${PORT}`)
app.listen(PORT)