import express from "express"
import {
  createArticle,
  getArticles,
  editArticle,
  deleteArticle,
  getArticleById,
  getRelatedArticles,
  filterArticles,
  searchArticles,
} from "../services/articles"

const router = express.Router()

router.post("/", createArticle)

router.post("/filterArticles", filterArticles)

router.post("/search", searchArticles)

router.get("/page=:page", getArticles)

router.get("/id=:id", getArticleById)

router.get(
  "/related-articles/themeId=:themeId&regionId=:regionId",
  getRelatedArticles,
)

router.put("/id=:id", editArticle)

router.delete("/id=:id", deleteArticle)

export default router
