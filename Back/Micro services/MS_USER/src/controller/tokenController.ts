import jwt from 'jsonwebtoken';
import { statusCode } from "./statusCode";
import {Request, Response} from 'express';
import { load } from 'ts-dotenv'
import { emailSucess } from '../assets/emailConfirmation/succes'
import { templateError } from '../assets/error'


import { AppDataSource } from "../db/data-source"
import { User } from "../db/entity/User"

const env = load({
    TOKEN_KEY:String,
    REFRESH_TOKEN_KEY:String
})

export const generateToken = (UID: string, time: string): string => {
    return jwt.sign({ username: UID }, env.TOKEN_KEY, { expiresIn: time});
}
  
export const generateRefreshToken = (UID: string ): string => {
    return jwt.sign({ username: UID }, env.REFRESH_TOKEN_KEY, { expiresIn: '7d' });
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

export const verifyEmailConfirmation = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.query.token as string;

        let decoded;

        try {
            decoded = jwt.verify(token, env.TOKEN_KEY) as { username: string }; // Vérifiez et décodez le jeton
        } catch (tokenError) {
            console.error('Erreur de vérification du jeton :', tokenError);
            res.status(401).send(templateError);
            return;
        }

        const UID = decoded.username;

        const userRepository = AppDataSource.getRepository(User);

        const updateUser = await userRepository.findOneBy({
            uid: UID,
        });

        if (!updateUser) {
            console.error('Utilisateur non trouvé pour UID :', UID);
            res.status(404).send(templateError); // Peut-être ajuster le code d'état en fonction de vos besoins
            return;
        }

        updateUser.confirmed = true;

        const savedUser = await userRepository.save(updateUser);

        if (!savedUser || savedUser.uid !== UID || !savedUser.confirmed) {
            console.error('La mise à jour n\'a pas été effectuée avec succès pour UID :', UID);
            res.status(401).send(templateError);
            return;
        }
        res.status(200).send(emailSucess('https://google.fr'));
    } catch (error) {
        console.error('Erreur lors de la vérification de la confirmation de l\'e-mail :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};