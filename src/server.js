/* eslint-disable no-console */
import express from 'express'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import exitHook from 'async-exit-hook'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import cors from 'cors'
import { corsOptions } from '~/config/cors'

const START_SERVER = () => {
  const app = express()

  app.use(cors(corsOptions))

  // Enable req.body json data
  app.use(express.json())

  app.use('/v1', APIs_V1)

  // Middleware Centralized error handling
  app.use(errorHandlingMiddleware)

  app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>')
  })

  if (env.BUILD_MODE === 'prod') {
    app.listen(process.env.PORT, () => {
      console.log(`Server started at Port: ${process.env.PORT}`)
    })
  } else {
    app.listen(env.LOCAL_PORT, env.LOCAL_HOST, () => {
      console.log(`Server started at http://${env.LOCAL_HOST}:${env.LOCAL_PORT}/`)
    })
  }

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

