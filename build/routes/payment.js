"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_1 = require("../services/payment");
const router = express_1.default.Router();
router.post("/register-in-db", payment_1.registerPaymentInDB);
router.get("/search/id=:id", payment_1.getPaymentsByClient);
router.post("/create-preference", payment_1.createPreference);
exports.default = router;
