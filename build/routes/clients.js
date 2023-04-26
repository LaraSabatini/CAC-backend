"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clients_1 = require("../services/clients");
const router = express_1.default.Router();
router.put("/saved-articles/id=:id", clients_1.editSavedArticles);
router.get("/saved-articles/id=:id", clients_1.getSavedArticles);
router.post("/comments", clients_1.createComment);
router.get("/comments/id=:id", clients_1.getCommentsByClient);
router.get("/emails", clients_1.getClientsEmails);
router.get("/email/id=:id", clients_1.getClientEmail);
router.post("/filter", clients_1.filterClients);
router.post("/search", clients_1.searchClients);
exports.default = router;
