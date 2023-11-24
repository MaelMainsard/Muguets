import jwt from 'jsonwebtoken';
import { statusCode } from "./statusCode";
import {Request, Response} from 'express';
import { load } from 'ts-dotenv'
import { Pool } from 'pg';
import { dbConfig } from "../config";
import { emailSucess } from '../assets/emailConfirmation/succes'
import { templateError } from '../assets/error'

const env = load({
    TOKEN_KEY:String,
    REFRESH_TOKEN_KEY:String
})

const pool = new Pool(dbConfig);

export const generateToken = (UID: string, time: string): string => {
    return jwt.sign({ username: UID }, env.TOKEN_KEY, { expiresIn: time});
}
  
export const generateRefreshToken = (user: { username: string }): string => {
    return jwt.sign({ username: user.username }, env.REFRESH_TOKEN_KEY, { expiresIn: '7d' });
}

export const getNewToken = (req: Request, res: Response):boolean => {
    const { refreshToken  } = req.body

    if (!refreshToken){
        res.status(401).send('Token de rafraichissent manquant');
        return false
    }

    jwt.verify(refreshToken, env.REFRESH_TOKEN_KEY, (err: any, user: any) => {
        if (err) return res.status(statusCode.STATUS_CODE_WRONG).send("Le refresh token n'est pas valide");
        const accessToken = generateToken(user,'15m');
        res.json({ 'token': accessToken });
     });

    return true
};

export const verifyEmailConfirmation = (req: Request, res: Response):void => {
  const token = req.query.token as string;

  jwt.verify(token, env.TOKEN_KEY, async (err, decoded) => {

    if (err) {
      return res.status(401).send(templateError);
    }

    const UID = (decoded as any).username;
    await pool.query('UPDATE "User" SET "confirmed" = $1 WHERE "id" = $2 RETURNING *', [true, UID]);
    return res.status(200).send(emailSucess('https://google.fr'));
  });
};

