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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer = __importStar(require("nodemailer"));
const ts_dotenv_1 = require("ts-dotenv");
const env = (0, ts_dotenv_1.load)({
    MAILING_HOST: String,
    MAILING_USER: String,
    MAILING_PW: String,
    MAILING_PORT: Number
});
const sendEmail = (req, template, title) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const transporter = nodemailer.createTransport({
        host: env.MAILING_HOST,
        port: env.MAILING_PORT,
        secure: false,
        requireTLS: true,
        auth: {
            user: env.MAILING_USER,
            pass: env.MAILING_PW,
        },
    });
    try {
        const info = yield transporter.sendMail({
            from: '"MaelCe.fr"<noreply@maelce.fr>',
            to: email,
            subject: title,
            html: template,
            headers: { 'x-myheader': 'MaelCe.fr' },
        });
        console.log("Message sent: %s", info.response);
        return true;
    }
    catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
});
exports.sendEmail = sendEmail;
