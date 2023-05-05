"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const articles_1 = require("../services/articles");
const router = express_1.default.Router();
router.post("/", articles_1.createArticle);
router.post("/filterArticles", articles_1.filterArticles);
router.post("/search", articles_1.searchArticles);
router.get("/page=:page", articles_1.getArticles);
router.get("/id=:id", articles_1.getArticleById);
router.get("/drafts", articles_1.getDrafts);
router.get("/related-articles/themeId=:themeId&regionId=:regionId", articles_1.getRelatedArticles);
router.put("/id=:id", articles_1.editArticle);
router.delete("/id=:id", articles_1.deleteArticle);
router.put("/saved/id=:id&action=:action&prevAmount=:prevAmount", articles_1.editAmountsSaved);
exports.default = router;
