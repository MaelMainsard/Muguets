import { dbConfig } from "../config";
import { Pool } from 'pg';
import { statusCode } from "./statusCode";
import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import * as validator from 'validator';
import * as zxcvbn from 'zxcvbn';
import { generateRefreshToken, generateToken } from "./tokenController";

import { sendEmail } from "./emailController";
import { emailConfirmation } from '../assets/emailConfirmation/confirmation'
import { resetConfirmation } from "../assets/passwordReset/resetConfirmation";


const pool = new Pool(dbConfig);

export const checkEmailAdress = (req: Request, res: Response):boolean => {
    const { email } = req.body

    if(!email){
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send('Email manquant');
        return false
    }

    const isEmailValid = validator.default.isEmail(email);

    if (!isEmailValid) {
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send("L'email n'est pas valide");
        return false
    }
    return true
};

export const checkPassword = (req: Request, res: Response):boolean => {
    const { password } = req.body

    if(!password){
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send('Mot de passe manquant');
        return false
    }

    const resultat = zxcvbn.default(password);

    if(resultat.score < 2){
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send(`Votre mot de passe n'est pas assez sur (${resultat.score}/4)`)
        return false
    }
    return true

}

export const checkExistingAccountRegister = async (req: Request, res: Response):Promise<boolean> => {
    const { email } = req.body

    const existingUser = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send("Un compte existe déjas avec cette adresse mail, connectez vous :)");
        return false
    }

    return true
};

export const checkExistingAccountLogin = async (req: Request, res: Response):Promise<boolean> => {
    const { email } = req.body

    const existingUser = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);

    if (existingUser.rows.length <= 0) {
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send("Aucun compte trouvé avec cette adresse mail, inscrivez vous :)");
        return false
    }

    return true
};

export const addNewUser = async (req: Request, res: Response):Promise<boolean> => {
    const { email, password, username } = req.body

    if(!username){
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send('Votre nom est necéssaire');
        return false
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query('INSERT INTO "User" (email, password, username, confirmed) VALUES ($1, $2, $3, $4) RETURNING *', [email, hashedPassword, username, false]);

    const UID = result.rows[0].id

    const confrimation_email_token = generateToken(UID,'24h')

    const token = generateToken(UID,'15m')

    const url = `http://127.0.0.1:3001/email_confirmation?token=${confrimation_email_token}`

    sendEmail(req,emailConfirmation(username,url))

    res.status(statusCode.STATUS_CODE_OK).json({
      token: token,
      refesh_token: generateRefreshToken(UID)
    });
    return true
};

export const logUser = async (req: Request, res: Response):Promise<boolean> => {
    const { email, password } = req.body
    console.log(process.env.TEST);
    if(!email || !password){
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send("l'email et le mot de passe sont requis");
        return false
    }

    const userQuery = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);

    const hashedPassword = userQuery.rows[0].password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
        res.status(statusCode.STATUS_CODE_UNAUTHORISED).send("Votre email / mot de passe n'est pas correct");
        return false
    }
    const UID = userQuery.rows[0].id

    res.status(statusCode.STATUS_CODE_OK).json({
      token: generateToken(UID,'15m') ,
      refesh_token: generateRefreshToken(UID)
    });
    
    return true
};

export const sendResetPassword = async (req: Request, res: Response):Promise<boolean> => {
    const { email } = req.body

    const userQuery = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);

    const UID = userQuery.rows[0].id

    const token = generateToken(UID,'1H')

    const url = `http://127.0.0.1:3001/reset_password?token=${token}`

    sendEmail(req,resetConfirmation(url))

    return true

};


