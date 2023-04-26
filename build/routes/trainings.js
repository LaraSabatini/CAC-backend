"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trainings_1 = require("../services/trainings");
const router = express_1.default.Router();
router.get("/page=:page", trainings_1.getTrainings);
router.post("/", trainings_1.createTraining);
router.delete("/id=:id", trainings_1.deleteTraining);
router.put("/id=:id", trainings_1.editTraining);
exports.default = router;
