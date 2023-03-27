"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateReCaptcha_1 = __importDefault(require("../services/validateReCaptcha"));
const router = express_1.default.Router();
router.post("/", validateReCaptcha_1.default);
exports.default = router;
