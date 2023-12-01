"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const ts_dotenv_1 = require("ts-dotenv");
const env = (0, ts_dotenv_1.load)({
    POSTGRES_USER: String,
    POSTGRES_DB: String,
    POSTGRES_PASSWORD: String
});
exports.AppDataSource = new typeorm_1.DataSource({
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
});
