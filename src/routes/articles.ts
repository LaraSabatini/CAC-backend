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

router.put("/id=:id", editArticle)

router.delete("/id=:id", deleteArticle)

export default router
