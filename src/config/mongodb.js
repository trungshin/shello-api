import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environment'

let shelloDbInstance = null

const MongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

// CONNECT TO DATABASE
export const CONNECT_DB = async () => {
  await MongoClientInstance.connect()

  shelloDbInstance = MongoClientInstance.db(env.DATABASE_NAME)
}

// Close the connection to the Database
export const CLOSE_DB = async () => {
  await MongoClientInstance.close()
}

export const GET_DB = () => {
  if (!shelloDbInstance) throw new Error('Must connect to Database first!')
  return shelloDbInstance
}