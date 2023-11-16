import { dbConfig } from "../config";
import { Pool } from 'pg';
import { statusCode } from "./statusCode";
import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import * as validator from 'validator';
import * as zxcvbn from 'zxcvbn';
import { generateRefreshToken, generateToken } from "./tokenController";

const pool = new Pool(dbConfig);

export const checkEmailAdress = (req: Request, res: Response):boolean => {
    const { email } = req.body

    if(!email){
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send('Email Missing');
        return false
    }

    const isEmailValid = validator.default.isEmail(email);

    if (!isEmailValid) {
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send('Email not valid');
        return false
    }
    return true
};

export const checkPassword = (req: Request, res: Response):boolean => {
    const { password } = req.body

    if(!password){
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send('Password missing');
        return false
    }

    const resultat = zxcvbn.default(password);

    if(resultat.score < 2){
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send(`Password not strong enough (${resultat.score}/4)`)
        return false
    }
    return true

}

export const checkExistingAccountRegister = async (req: Request, res: Response):Promise<boolean> => {
    const { email } = req.body

    const existingUser = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send("Existing account found, please login");
        return false
    }

    return true
};

export const checkExistingAccountLogin = async (req: Request, res: Response):Promise<boolean> => {
    const { email } = req.body

    const existingUser = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);

    if (existingUser.rows.length <= 0) {
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send("No account found, please subscribe first");
        return false
    }

    return true
};

export const addNewUser = async (req: Request, res: Response):Promise<boolean> => {
    const { email, password, username } = req.body

    if(!username){
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send('Name required');
        return false
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query('INSERT INTO "User" (email, password, username) VALUES ($1, $2, $3) RETURNING *', [email, hashedPassword, username]);

    const UID = result.rows[0].id

    res.status(statusCode.STATUS_CODE_OK).json({
      token: generateToken(UID) ,
      refesh_token: generateRefreshToken(UID)
    });
    return true
};

export const logUser = async (req: Request, res: Response):Promise<boolean> => {
    const { email, password } = req.body

    if(!email || !password){
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send('Email / Password required');
        return false
    }

    const userQuery = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);

    const hashedPassword = userQuery.rows[0].password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
        res.status(statusCode.STATUS_CODE_UNAUTHORISED).send("Password incorrect");
        return false
    }
    const UID = userQuery.rows[0].id

    res.status(statusCode.STATUS_CODE_OK).json({
      token: generateToken(UID) ,
      refesh_token: generateRefreshToken(UID)
    });
    
    return true
};

