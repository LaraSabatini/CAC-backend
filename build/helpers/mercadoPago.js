"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mercadopago_1 = __importDefault(require("mercadopago"));
const config_1 = __importDefault(require("../config"));
mercadopago_1.default.configure({
    access_token: `${config_1.default.MP_ACCESS_TOKEN_TEST}`,
});
exports.default = mercadopago_1.default;
