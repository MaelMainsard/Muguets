import { statusCode } from "./statusCode";
import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import * as validator from 'validator';
import zxcvbn from 'zxcvbn';
import { generateRefreshToken, generateToken } from "./tokenController";
import { load } from 'ts-dotenv'

import { sendEmail } from "./emailController";
import { emailConfirmation } from '../assets/emailConfirmation/confirmation'
import { resetConfirmation } from "../assets/passwordReset/resetConfirmation";

import { AppDataSource } from "../db/data-source"
import { User } from "../db/entity/User"

const env = load({
  MS_PORT:Number,
})

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

    const resultat = zxcvbn(password);

    if(resultat.score < 2){
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send(`Votre mot de passe n'est pas assez sur (${resultat.score}/4)`)
        return false
    }
    return true

}

export const checkExistingAccountRegister = async (req: Request, res: Response): Promise<boolean> => {
  try {
    const { email } = req.body;

    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOne({ where: { email: email } });

    if (existingUser) {
      res.status(statusCode.STATUS_CODE_BAD_REQUEST).send("Un compte existe déjà avec cette adresse e-mail, connectez-vous :)");
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la vérification du compte existant :', error);
    res.status(statusCode.STATUS_CODE_ERROR).send('Erreur interne du serveur');
    return false;
  }
};

export const checkExistingAccountLogin = async (req: Request, res: Response): Promise<boolean> => {
    try {
      const { email } = req.body;
  
      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOne({ where: { email: email } });
  
      if (!existingUser) {
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send("Aucun compte trouvé avec cette adresse e-mail, inscrivez-vous :)");
        return false;
      }
  
      return true;
    } catch (error) {
      console.error('Erreur lors de la vérification du compte existant :', error);
      res.status(statusCode.STATUS_CODE_ERROR).send('Erreur interne du serveur');
      return false;
    }
};

export const addNewUser = async (req: Request, res: Response): Promise<boolean> => {
    try {
        const { email, password, username } = req.body;

        if (!username) {
            res.status(statusCode.STATUS_CODE_BAD_REQUEST).send('Votre nom est nécessaire');
            return false;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Utilisation de TypeORM pour insérer un nouvel utilisateur
        const userRepository = AppDataSource.getRepository(User);
        const newUser = {
          email: email,
          password: hashedPassword,
          username: username,
          confirmed: false,
        }
        const savedUser = await userRepository.save(newUser);

        const UID = savedUser.uid;

        const confirmationEmailToken = generateToken(UID, '24h');
        const token = generateToken(UID, '15m');

        const url = `http://127.0.0.1:${env.MS_PORT}/email_confirmation?token=${confirmationEmailToken}`;

        sendEmail(req, emailConfirmation(username, url), "Confirmation de votre adresse email");

        res.status(statusCode.STATUS_CODE_OK).json({
            token: token,
            refresh_token: generateRefreshToken(UID),
        });

        return true;
    } catch (error) {
        console.error('Erreur lors de l\'ajout d\'un nouvel utilisateur :', error);
        res.status(statusCode.STATUS_CODE_ERROR).send('Erreur interne du serveur');
        return false;
    }
};

export const logUser = async (req: Request, res: Response): Promise<boolean> => {
    try {
      const { email, password } = req.body;
  
      console.log(process.env.TEST);
  
      if (!email || !password) {
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send("L'e-mail et le mot de passe sont requis");
        return false;
      }
  
      const userRepository = AppDataSource.getRepository(User);
      const userQuery = await userRepository.findOne({
        where: { email: email },
      });
  
      if (!userQuery) {
        res.status(statusCode.STATUS_CODE_UNAUTHORISED).send("Votre e-mail / mot de passe n'est pas correct");
        return false;
      }
  
      const hashedPassword = userQuery.password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);
  
      if (!passwordMatch) {
        res.status(statusCode.STATUS_CODE_UNAUTHORISED).send("Votre e-mail / mot de passe n'est pas correct");
        return false;
      }
  
      const UID = userQuery.uid;
      
  
      res.status(statusCode.STATUS_CODE_OK).json({
        token: generateToken(UID, '15m'),
        refresh_token: generateRefreshToken(UID),
      });
  
      return true;
    } catch (error) {
      console.error('Erreur lors de la connexion de l\'utilisateur :', error);
      res.status(statusCode.STATUS_CODE_ERROR).send('Erreur interne du serveur');
      return false;
    }
};

export const sendResetPassword = async (req: Request, res: Response): Promise<boolean> => {
    try {
      const { email } = req.body;
  
      const userRepository = AppDataSource.getRepository(User);
      const userQuery = await userRepository.findOne({
        where: { email: email },
      });
  
      if (!userQuery) {
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send("Aucun utilisateur trouvé avec cet e-mail");
        return false;
      }
  
      const UID = userQuery.uid;
  
      const token = generateToken(UID, '1H');
  
      const url = `http://127.0.0.1:3001/reset_password?token=${token}`;
  
      sendEmail(req, resetConfirmation(url), "Réinitialisez votre mot de passe");
  
      res.status(statusCode.STATUS_CODE_OK).send('OK');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réinitialisation de mot de passe :', error);
      res.status(statusCode.STATUS_CODE_ERROR).send('Erreur interne du serveur');
      return false;
    }
};

