"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const filters_1 = require("../services/filters");
const router = express_1.default.Router();
router.post("/", filters_1.createFilter);
router.get("/type=:type", filters_1.getFilters);
router.delete("/id=:id&type=:type", filters_1.deleteFilter);
exports.default = router;
