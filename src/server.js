/* eslint-disable no-console */
import express from 'express'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import exitHook from 'async-exit-hook'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'

const START_SERVER = () => {
  const app = express()

  // Enable req.body json data
  app.use(express.json())

  app.use('/v1', APIs_V1)

  app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>')
  })

  app.listen(env.PORT, env.HOST, () => {
    console.log(`Server started at http://${env.HOST}:${env.PORT}/`)
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

