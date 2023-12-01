"use strict";
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
exports.verifyEmailConfirmation = exports.getNewToken = exports.generateRefreshToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const statusCode_1 = require("./statusCode");
const ts_dotenv_1 = require("ts-dotenv");
const succes_1 = require("../assets/emailConfirmation/succes");
const error_1 = require("../assets/error");
const typeorm_1 = require("typeorm");
const User_1 = require("../db/entity/User");
const env = (0, ts_dotenv_1.load)({
    TOKEN_KEY: String,
    REFRESH_TOKEN_KEY: String
});
const generateToken = (UID, time) => {
    return jsonwebtoken_1.default.sign({ username: UID }, env.TOKEN_KEY, { expiresIn: time });
};
exports.generateToken = generateToken;
const generateRefreshToken = (UID) => {
    return jsonwebtoken_1.default.sign({ username: UID }, env.REFRESH_TOKEN_KEY, { expiresIn: '7d' });
};
exports.generateRefreshToken = generateRefreshToken;
const getNewToken = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(401).send('Token de rafraichissent manquant');
        return false;
    }
    jsonwebtoken_1.default.verify(refreshToken, env.REFRESH_TOKEN_KEY, (err, user) => {
        if (err)
            return res.status(statusCode_1.statusCode.STATUS_CODE_WRONG).send("Le refresh token n'est pas valide");
        const accessToken = (0, exports.generateToken)(user, '15m');
        res.json({ 'token': accessToken });
    });
    return true;
};
exports.getNewToken = getNewToken;
const verifyEmailConfirmation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.query.token;
        const decoded = jsonwebtoken_1.default.verify(token, env.TOKEN_KEY); // Vérifiez et décodez le jeton
        const UID = decoded.username;
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        // Utilisez la méthode update de TypeORM
        const updateResult = yield userRepository.update({ uid: UID }, // Critère de recherche
        { confirmed: true } // Utilisez un type assertion ici
        );
        if (updateResult.affected === 0) {
            res.status(401).send(error_1.templateError);
            return;
        }
        res.status(200).send((0, succes_1.emailSucess)('https://google.fr'));
    }
    catch (error) {
        console.error('Erreur lors de la vérification de la confirmation de l\'e-mail :', error);
        res.status(500).send('Erreur interne du serveur');
    }
});
exports.verifyEmailConfirmation = verifyEmailConfirmation;
