"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feedback_1 = require("../services/feedback");
const router = express_1.default.Router();
router.post("/", feedback_1.createFeedback);
router.get("/page=:page", feedback_1.getFeedback);
exports.default = router;
