// pw: dqHWCsLkLLloUIp1
const MONGODB_URI = 'mongodb+srv://trungshin:1n3mzvaNxxJDAMoF@cluster0-trungshin.szfa1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0-TrungShin'
const DATABASE_NAME = 'shello'

import { MongoClient, ServerApiVersion } from 'mongodb'

let shelloDbInstance = null

const MongoClientInstance = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

// CONNECT TO DATABASE
export const CONNECT_DB = async () => {
  await MongoClientInstance.connect()

  shelloDbInstance = MongoClientInstance.db(DATABASE_NAME)
}

// Close the connection to the Database
export const CLOSE_DB = async () => {
  await MongoClientInstance.close()
}

export const GET_DB = () => {
  if (!shelloDbInstance) throw new Error('Must connect to Database first!')
  return shelloDbInstance
}