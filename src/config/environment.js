import 'dotenv/config.js'

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  LOCAL_HOST: process.env.HOST,
  LOCAL_PORT: process.env.PORT,
  BUILD_MODE: process.env.BUILD_MODE
}