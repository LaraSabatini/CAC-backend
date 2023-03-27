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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv.config({
    path: path_1.default.resolve(__dirname, `${process.env.NODE_ENV}.env`),
});
const config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    HOST: process.env.HOST || "localhost",
    PORT: process.env.PORT || 3000,
    DB: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB,
    },
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PASS: process.env.MAIL_PASS,
    EMAIL: process.env.EMAIL,
    MP_PUBLIC_KEY_TEST: process.env.MP_PUBLIC_KEY_TEST,
    MP_ACCESS_TOKEN_TEST: process.env.MP_ACCESS_TOKEN_TEST,
    MP_PUBLIC_KEY_OWN: process.env.MP_PUBLIC_KEY_OWN,
    MP_ACCESS_TOKEN_OWN: process.env.MP_ACCESS_TOKEN_OWN,
    RECAPTCHA_PUBLIC_KEY: process.env.RECAPTCHA_PUBLIC_KEY,
    RECAPTCHA_PRIVATE_KEY: process.env.RECAPTCHA_PRIVATE_KEY,
    listPerPage: 25,
};
exports.default = config;
