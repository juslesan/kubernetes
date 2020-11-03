const Koa = require('koa')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const app = new Koa()
const PORT = process.env.PORT || 3002

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'image.jpg')

let lastDownload = null

const dayPassed = (now) => {
  return lastDownload && ((lastDownload + 86400000) < now)
}

const getFile = async () => new Promise(res => {
  fs.readFile(filePath, (err, buffer) => {
    if (err) return console.log('FAILED TO READ FILE', '----------------', err)
    res(buffer)
  })
})

const fileAlreadyExists = async () => new Promise(res => {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats) return res(false)
    return res(true)
  })
})

const findAFile = async () => {
  if (await fileAlreadyExists()) return

  await new Promise(res => fs.mkdir('', (err) => res()))
  const response = await axios.get('https://picsum.photos/1200', { responseType: 'stream' })
  response.data.pipe(fs.createWriteStream(filePath))
}

const removeFile = async () => new Promise(res => fs.unlink(filePath, (err) => res()))

app.use(async ctx => {
  if (ctx.path.includes('favicon.ico')) return
  if (dayPassed(Date.now())) {
    await removeFile()
    await findAFile()
    ctx.body = await getFile()
    ctx.set('Content-type', 'image/jpeg')
    ctx.status = 200
  } else {
    await findAFile()
    ctx.body = await getFile()
    ctx.set('Content-type', 'image/jpeg')
    ctx.status = 200
  }
})

console.log('Started')

app.listen(PORT)