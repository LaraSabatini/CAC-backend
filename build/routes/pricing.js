"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pricing_1 = require("../services/pricing");
const router = express_1.default.Router();
router.post("/", pricing_1.createPricing);
router.put("/id=:id", pricing_1.editPricing);
router.delete("/id=:id", pricing_1.deletePricing);
router.get("/", pricing_1.getPricing);
router.get("/filters", pricing_1.getPricingAsFilter);
exports.default = router;
