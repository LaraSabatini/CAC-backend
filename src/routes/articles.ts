import express from "express"
import {
  createArticle,
  getArticles,
  editArticle,
  deleteArticle,
  getArticleById,
  getRelatedArticles,
} from "../services/articles"

const router = express.Router()

router.post("/", createArticle)

router.get("/page=:page", getArticles)

router.get("/id=:id", getArticleById)

router.get(
  "/related-articles/themeId=:themeId&regionId=:regionId",
  getRelatedArticles,
)

router.put("/id=:id", editArticle)

router.delete("/id=:id", deleteArticle)

export default router
