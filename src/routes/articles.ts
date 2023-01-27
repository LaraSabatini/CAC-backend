import express from "express"
import {
  createArticle,
  getArticles,
  editArticle,
  deleteArticle,
  getArticleById,
} from "../services/articles"

const router = express.Router()

router.post("/", createArticle)

router.get("/page=:page", getArticles)

router.get("/id=:id", getArticleById)

router.put("/id=:id", editArticle)

router.delete("/id=:id", deleteArticle)

export default router
