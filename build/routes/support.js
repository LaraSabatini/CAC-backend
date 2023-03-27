"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const support_1 = require("../services/support");
const router = express_1.default.Router();
router.post("/unblock_account/id=:id", support_1.unblockRequest);
exports.default = router;
