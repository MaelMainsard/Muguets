import express from 'express';
import bodyParser from 'body-parser';
import "reflect-metadata"

import { AppDataSource } from './db/data-source';
import { statusCode } from './controller/statusCode';
import { checkEmailAdress, checkPassword, checkExistingAccountLogin,checkExistingAccountRegister, addNewUser, logUser, sendResetPassword} from './controller/userController'
import { getNewToken, verifyEmailConfirmation, verifyToken } from './controller/tokenController';
import { load } from 'ts-dotenv'
import cors from 'cors';
import { seedUsers } from './db/seeder/seed-user';

const env = load({
  MS_PORT:Number
})

const app = express();


console.log('Starting USER microservice')


app.use(bodyParser.json());
app.use(cors());


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

app.post('/verify_token',async (req, res) => {
  try {
    if(!verifyToken(req,res)) return
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

app.post('/reset_password', (_req, res) => {
  try {
    
  } catch (error) {
    console.error(error)
    res.status(statusCode.STATUS_CODE_ERROR).send(error);
  }
});


AppDataSource.initialize().then(() => {
  seedUsers()
  app.listen(env.MS_PORT,() => {
    console.log(`Server is running on http://localhost:${env.MS_PORT}`);
  });
}).catch(error => console.log(error));