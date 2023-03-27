"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileManagement_1 = require("../services/fileManagement");
const router = express_1.default.Router();
router.post("/", fileManagement_1.uploadFiles);
router.get("/file_name=:file_name&file_extension=:file_extension", fileManagement_1.getFile);
router.delete("/route=:route", fileManagement_1.deleteFile);
exports.default = router;
