import express from 'express';
import bodyParser from 'body-parser';

import { statusCode } from './controller/statusCode';
import { checkEmailAdress, checkPassword, checkExistingAccountLogin,checkExistingAccountRegister, addNewUser, logUser} from './controller/userController'
import { getNewToken } from './controller/tokenController';
import { Pool } from 'pg';
import { dbConfig } from "./config";

const pool = new Pool(dbConfig);
const app = express();
const port = 3001;

console.log('Starting USER microservice')

app.use(bodyParser.json());

pool.connect((err, client, done) => {
  if (err) {
    console.error('Connection error to the database:', err);
    done();
  }
   else {
    console.log('Successfully connected to the database');
    done();
  }
});


app.post('/register', async (req, res) => {
  try {
    if(!checkEmailAdress(req,res)) return
    if(!checkPassword(req,res)) return
    if(!await checkExistingAccountRegister(req,res)) return
    if(!await addNewUser(req,res)) return
  } catch (error) {
    console.error(error);
    res.status(statusCode.STATUS_CODE_ERROR).send(error);
  }
});

app.post('/login',async (req, res) => {
  try {
    if(!await checkExistingAccountLogin(req,res)) return
    if(!await logUser(req,res)) return
  } catch (error) {
    console.error(error)
    res.status(statusCode.STATUS_CODE_ERROR).send(error);
  }
});

app.post('/refresh', (req, res) => {
  try {
    if(!getNewToken(req,res)) return
  } catch (error) {
    console.error(error)
    res.status(statusCode.STATUS_CODE_ERROR).send(error);
  }
});


app.listen(port, () => {
  console.log(`MS is running at http://localhost:${port}`);
});

// Next mettre un token d'utilisation