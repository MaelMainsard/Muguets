"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPassword = exports.logUser = exports.addNewUser = exports.checkExistingAccountLogin = exports.checkExistingAccountRegister = exports.checkPassword = exports.checkEmailAdress = void 0;
const statusCode_1 = require("./statusCode");
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator = __importStar(require("validator"));
const zxcvbn = __importStar(require("@zxcvbn-ts/core"));
const tokenController_1 = require("./tokenController");
const emailController_1 = require("./emailController");
const confirmation_1 = require("../assets/emailConfirmation/confirmation");
const resetConfirmation_1 = require("../assets/passwordReset/resetConfirmation");
const typeorm_1 = require("typeorm");
const User_1 = require("../db/entity/User");
const checkEmailAdress = (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(statusCode_1.statusCode.STATUS_CODE_BAD_REQUEST).send('Email manquant');
        return false;
    }
    const isEmailValid = validator.default.isEmail(email);
    if (!isEmailValid) {
        res.status(statusCode_1.statusCode.STATUS_CODE_BAD_REQUEST).send("L'email n'est pas valide");
        return false;
    }
    return true;
};
exports.checkEmailAdress = checkEmailAdress;
const checkPassword = (req, res) => {
    const { password } = req.body;
    if (!password) {
        res.status(statusCode_1.statusCode.STATUS_CODE_BAD_REQUEST).send('Mot de passe manquant');
        return false;
    }
    const resultat = zxcvbn.zxcvbn(password);
    if (resultat.score < 2) {
        res.status(statusCode_1.statusCode.STATUS_CODE_BAD_REQUEST).send(`Votre mot de passe n'est pas assez sur (${resultat.score}/4)`);
        return false;
    }
    return true;
};
exports.checkPassword = checkPassword;
const checkExistingAccountRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        // Utilisation de TypeORM pour rechercher un utilisateur existant
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const existingUser = yield userRepository.findOne({ where: { email: email } });
        if (existingUser) {
            res.status(statusCode_1.statusCode.STATUS_CODE_BAD_REQUEST).send("Un compte existe déjà avec cette adresse e-mail, connectez-vous :)");
            return false;
        }
        return true;
    }
    catch (error) {
        console.error('Erreur lors de la vérification du compte existant :', error);
        res.status(statusCode_1.statusCode.STATUS_CODE_ERROR).send('Erreur interne du serveur');
        return false;
    }
});
exports.checkExistingAccountRegister = checkExistingAccountRegister;
const checkExistingAccountLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const existingUser = yield userRepository.findOne({ where: { email: email } });
        if (!existingUser) {
            res.status(statusCode_1.statusCode.STATUS_CODE_BAD_REQUEST).send("Aucun compte trouvé avec cette adresse e-mail, inscrivez-vous :)");
            return false;
        }
        return true;
    }
    catch (error) {
        console.error('Erreur lors de la vérification du compte existant :', error);
        res.status(statusCode_1.statusCode.STATUS_CODE_ERROR).send('Erreur interne du serveur');
        return false;
    }
});
exports.checkExistingAccountLogin = checkExistingAccountLogin;
const addNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username } = req.body;
        if (!username) {
            res.status(statusCode_1.statusCode.STATUS_CODE_BAD_REQUEST).send('Votre nom est nécessaire');
            return false;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Utilisation de TypeORM pour insérer un nouvel utilisateur
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const newUser = {
            email: email,
            password: hashedPassword,
            username: username,
            confirmed: false,
        };
        const savedUser = yield userRepository.save(newUser);
        const UID = savedUser.uid;
        const confirmationEmailToken = (0, tokenController_1.generateToken)(UID, '24h');
        const token = (0, tokenController_1.generateToken)(UID, '15m');
        const url = `http://127.0.0.1:3001/email_confirmation?token=${confirmationEmailToken}`;
        (0, emailController_1.sendEmail)(req, (0, confirmation_1.emailConfirmation)(username, url), "Confirmation de votre adresse email");
        res.status(statusCode_1.statusCode.STATUS_CODE_OK).json({
            token: token,
            refresh_token: (0, tokenController_1.generateRefreshToken)(UID),
        });
        return true;
    }
    catch (error) {
        console.error('Erreur lors de l\'ajout d\'un nouvel utilisateur :', error);
        res.status(statusCode_1.statusCode.STATUS_CODE_ERROR).send('Erreur interne du serveur');
        return false;
    }
});
exports.addNewUser = addNewUser;
const logUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log(process.env.TEST);
        if (!email || !password) {
            res.status(statusCode_1.statusCode.STATUS_CODE_BAD_REQUEST).send("L'e-mail et le mot de passe sont requis");
            return false;
        }
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const userQuery = yield userRepository.findOne({
            where: { email: email },
        });
        if (!userQuery) {
            res.status(statusCode_1.statusCode.STATUS_CODE_UNAUTHORISED).send("Votre e-mail / mot de passe n'est pas correct");
            return false;
        }
        const hashedPassword = userQuery.password;
        const passwordMatch = yield bcrypt_1.default.compare(password, hashedPassword);
        if (!passwordMatch) {
            res.status(statusCode_1.statusCode.STATUS_CODE_UNAUTHORISED).send("Votre e-mail / mot de passe n'est pas correct");
            return false;
        }
        const UID = userQuery.uid;
        res.status(statusCode_1.statusCode.STATUS_CODE_OK).json({
            token: (0, tokenController_1.generateToken)(UID, '15m'),
            refresh_token: (0, tokenController_1.generateRefreshToken)(UID),
        });
        return true;
    }
    catch (error) {
        console.error('Erreur lors de la connexion de l\'utilisateur :', error);
        res.status(statusCode_1.statusCode.STATUS_CODE_ERROR).send('Erreur interne du serveur');
        return false;
    }
});
exports.logUser = logUser;
const sendResetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const userQuery = yield userRepository.findOne({
            where: { email: email },
        });
        if (!userQuery) {
            res.status(statusCode_1.statusCode.STATUS_CODE_BAD_REQUEST).send("Aucun utilisateur trouvé avec cet e-mail");
            return false;
        }
        const UID = userQuery.uid;
        const token = (0, tokenController_1.generateToken)(UID, '1H');
        const url = `http://127.0.0.1:3001/reset_password?token=${token}`;
        (0, emailController_1.sendEmail)(req, (0, resetConfirmation_1.resetConfirmation)(url), "Réinitialisez votre mot de passe");
        res.status(statusCode_1.statusCode.STATUS_CODE_OK).send('OK');
        return true;
    }
    catch (error) {
        console.error('Erreur lors de l\'envoi de la réinitialisation de mot de passe :', error);
        res.status(statusCode_1.statusCode.STATUS_CODE_ERROR).send('Erreur interne du serveur');
        return false;
    }
});
exports.sendResetPassword = sendResetPassword;
