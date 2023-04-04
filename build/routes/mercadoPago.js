"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mercadoPago_1 = require("../services/mercadoPago");
const router = express_1.default.Router();
router.get("/getClient/preferenceId=:preferenceId", mercadoPago_1.getClientId);
router.post("/create-preference/type=:type", mercadoPago_1.createPreference);
router.post("/notifications", mercadoPago_1.paymentNotification);
exports.default = router;
