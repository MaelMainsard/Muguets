import "reflect-metadata"
import { DataSource } from "typeorm"
import { load } from 'ts-dotenv'

const env = load({
    POSTGRES_USER:String,
    POSTGRES_DB:String,
    POSTGRES_PASSWORD:String
})


export const AppDataSource = new DataSource({
    type: "postgres",
    host: env.POSTGRES_DB,
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    synchronize: true,
    logging: false,
    entities: ['src/db/entity/*.ts'],
    migrations: ['src/db/migration/*.ts'],
    subscribers: [],
})

