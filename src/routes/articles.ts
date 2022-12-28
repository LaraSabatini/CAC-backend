import express from "express"
import {
  createArticle,
  getArticles,
  editArticle,
  deleteArticle,
} from "../services/articles"

const router = express.Router()

router.post("/", createArticle)

router.get("/page=:page", getArticles)

router.put("/", editArticle)

router.delete("/", deleteArticle)

export default router
