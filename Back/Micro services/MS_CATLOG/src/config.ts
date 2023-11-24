
import { load } from 'ts-dotenv';
import { Sequelize } from 'sequelize-typescript';

const env = load({
  DATABASE_NAME: String,
  DATABASE_PASSWORD: String,
  DATABASE_HOST: String,
  DATABASE_PORT: Number,
  TOKEN_KEY: String,
  REFRESH_TOKEN_KEY: String
});

const sequelize = new Sequelize({
  dialect: 'postgres',
  database: env.DATABASE_NAME,
  username: 'postgres',
  password: env.DATABASE_PASSWORD,
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  models: [__dirname + '/models'], 
});

export default sequelize;

export const dbConfig = {
  user: 'postgres',
  database: env.DATABASE_NAME,
  password: env.DATABASE_PASSWORD,
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT || 5432,
};

export const tokenConfig = {
  TOKEN_KEY: env.TOKEN_KEY,
  REFRESH_TOKEN_KEY: env.REFRESH_TOKEN_KEY
};
