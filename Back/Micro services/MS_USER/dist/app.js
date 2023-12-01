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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
require("reflect-metadata");
const data_source_1 = require("./db/data-source");
const statusCode_1 = require("./controller/statusCode");
const userController_1 = require("./controller/userController");
const tokenController_1 = require("./controller/tokenController");
const ts_dotenv_1 = require("ts-dotenv");
const cors_1 = __importDefault(require("cors"));
const env = (0, ts_dotenv_1.load)({
    MS_PORT: Number
});
const app = (0, express_1.default)();
console.log('Starting USER microservice');
data_source_1.AppDataSource.initialize();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, userController_1.checkEmailAdress)(req, res))
            return;
        if (!(0, userController_1.checkPassword)(req, res))
            return;
        if (!(yield (0, userController_1.checkExistingAccountRegister)(req, res)))
            return;
        if (!(yield (0, userController_1.addNewUser)(req, res)))
            return;
    }
    catch (error) {
        console.error(error);
        res.status(statusCode_1.statusCode.STATUS_CODE_ERROR).send(error);
    }
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(yield (0, userController_1.checkExistingAccountLogin)(req, res)))
            return;
        if (!(yield (0, userController_1.logUser)(req, res)))
            return;
    }
    catch (error) {
        console.error(error);
        res.status(statusCode_1.statusCode.STATUS_CODE_ERROR).send(error);
    }
}));
app.get('/refresh', (req, res) => {
    try {
        if (!(0, tokenController_1.getNewToken)(req, res))
            return;
    }
    catch (error) {
        console.error(error);
        res.status(statusCode_1.statusCode.STATUS_CODE_ERROR).send(error);
    }
});
app.get('/email_confirmation', (req, res) => {
    try {
        (0, tokenController_1.verifyEmailConfirmation)(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(statusCode_1.statusCode.STATUS_CODE_ERROR).send(error);
    }
});
app.post('/send_reset_password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(yield (0, userController_1.checkExistingAccountLogin)(req, res)))
            return;
        if (!(yield (0, userController_1.sendResetPassword)(req, res)))
            return;
    }
    catch (error) {
        console.error(error);
        res.status(statusCode_1.statusCode.STATUS_CODE_ERROR).send(error);
    }
}));
app.post('/reset_password', (_req, res) => {
    try {
    }
    catch (error) {
        console.error(error);
        res.status(statusCode_1.statusCode.STATUS_CODE_ERROR).send(error);
    }
});
app.listen(env.MS_PORT, () => {
    console.log(`Server is running on http://localhost:${env.MS_PORT}`);
});
