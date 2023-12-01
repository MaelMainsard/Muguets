
import { load } from 'ts-dotenv';
import { Sequelize } from 'sequelize-typescript';

const env = load({
  POSTGRES_USER: String,
  POSTGRES_PASSWORD: String,
  POSTGRES_DB: String,
  TOKEN_KEY: String,
  REFRESH_TOKEN_KEY: String
});

const sequelize = new Sequelize({
  dialect: 'postgres',
  database: env.POSTGRES_DB,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  host: env.POSTGRES_DB,
  models: [__dirname + '/models'], 
});

export default sequelize;

export const dbConfig = {
  user: env.POSTGRES_USER,
  database: env.POSTGRES_DB,
  password: env.POSTGRES_PASSWORD,
  host: env.POSTGRES_DB,
};

export const tokenConfig = {
  TOKEN_KEY: env.TOKEN_KEY,
  REFRESH_TOKEN_KEY: env.REFRESH_TOKEN_KEY
};
