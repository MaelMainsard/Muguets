import { load } from 'ts-dotenv'

const env = load({
  DB_USER:String,
  DB_DATABASE:String,
  DB_PW:String,
  DB_HOST:String,
  DB_PORT:Number
})

export const dbConfig = {
  user: env.DB_USER,
  database: env.DB_DATABASE,
  password: env.DB_PW,
  host: env.DB_HOST,
  port: env.DB_PORT,
};