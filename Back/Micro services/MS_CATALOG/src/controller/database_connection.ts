import { Pool } from 'pg';
import { dbConfig } from "../config";
import cors from 'cors';

export const pool = new Pool(dbConfig);

export const DB_CONNECT = pool.connect((err, client, done) => {
    if (err) {
      console.error('Connection error to the database:', err);
      done();
    }
     else {
      console.log('Successfully connected to the database');
      done();
    }
});

