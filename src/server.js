import express from 'express'

const app = express()

const hostname = 'localhost'
const port = 8000

app.get('/', function (req, res) {
  res.send('<h1>Hello World</h1>')
})

app.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started at http://${hostname}:${port}/`)
})