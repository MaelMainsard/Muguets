import jwt from 'jsonwebtoken';
import { statusCode } from "./statusCode";
import {Request, Response} from 'express';
import { tokenConfig } from '../config';

export const generateToken = (user: {username: string}): string => {
    return jwt.sign({ username: user.username }, tokenConfig.TOKEN_KEY, { expiresIn: '15m' });
}
  
export const generateRefreshToken = (user: { username: string }): string => {
    return jwt.sign({ username: user.username }, tokenConfig.REFRESH_TOKEN_KEY, { expiresIn: '7d' });
}

export const getNewToken = (req: Request, res: Response):boolean => {
    const { refreshToken  } = req.body

    if (!refreshToken){
        res.status(401).send('Refresh token missing');
        return false
    }

    jwt.verify(refreshToken, tokenConfig.REFRESH_TOKEN_KEY, (err: any, user: any) => {
        if (err) return res.status(statusCode.STATUS_CODE_WRONG).send('Refresh token not valid');
        const accessToken = generateToken(user);
        res.json({ 'token': accessToken });
     });

    return true
};