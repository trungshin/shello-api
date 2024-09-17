/* eslint-disable no-console */
import express from 'express'
import { CONNECT_DB, CLOSE_DB, GET_DB } from './config/mongodb.js'
import exitHook from 'async-exit-hook'

const START_SERVER = () => {
  const app = express()

  const hostname = 'localhost'
  const port = 8000

  app.get('/', async (req, res) => {
    console.log(await GET_DB().listCollections().toArray())

    res.send('<h1>Hello World</h1>')
  })

  app.listen(port, hostname, () => {
    console.log(`Server started at http://${hostname}:${port}/`)
  })

  // Perform cleanup tasks before stopping the server
  exitHook(() => {
    CLOSE_DB()
  })
}

(async () => {
  try {
    await CONNECT_DB()
    console.log('Connected to MongoDB!')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
