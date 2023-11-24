import express from 'express';
import bodyParser from 'body-parser';

import { statusCode } from './controller/statusCode';
import { checkEmailAdress, checkPassword, checkExistingAccountLogin,checkExistingAccountRegister, addNewUser, logUser, sendResetPassword} from './controller/userController'
import { getNewToken, verifyEmailConfirmation } from './controller/tokenController';
import { Pool } from 'pg';
import { dbConfig } from "./config";
import cors from 'cors';

const pool = new Pool(dbConfig);
const app = express();
const port = 3001;

console.log('Starting USER microservice')

app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

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

app.get('/refresh', (req, res) => {
  try {
    if(!getNewToken(req,res)) return
  } catch (error) {
    console.error(error)
    res.status(statusCode.STATUS_CODE_ERROR).send(error);
  }
});

app.get('/email_confirmation', (req, res) => {
  try {
    verifyEmailConfirmation(req,res)
  } catch (error) {
    console.error(error)
    res.status(statusCode.STATUS_CODE_ERROR).send(error);
  }
});

app.post('/send_reset_password', async (req, res) => {
  try {
    if(!await checkExistingAccountLogin(req,res)) return
    if(!await sendResetPassword(req,res)) return
  } catch (error) {
    console.error(error)
    res.status(statusCode.STATUS_CODE_ERROR).send(error);
  }
});

app.post('/reset_password', (req, res) => {
  try {
    
  } catch (error) {
    console.error(error)
    res.status(statusCode.STATUS_CODE_ERROR).send(error);
  }
});

app.listen(port, () => {
  console.log(`MS is running at http://localhost:${port}`);
});
