"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admins_1 = require("../services/admins");
const router = express_1.default.Router();
router.get("/", admins_1.getAdmins);
router.get("/id=:id", admins_1.getAdminName);
router.put("/", admins_1.editAdminData);
router.put("/profile-pic/id=:id", admins_1.removeProfilePic);
router.post("/id=:id", admins_1.uploadProfilePic);
router.get("/profile-pic/id=:id", admins_1.getProfilePic);
exports.default = router;
