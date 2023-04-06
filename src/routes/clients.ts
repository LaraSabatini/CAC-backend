import express from "express"
import { editSavedArticles, getSavedArticles } from "../services/clients"

const router = express.Router()

router.put("/saved-articles/id=:id", editSavedArticles)

router.get("/saved-articles/id=:id", getSavedArticles)

export default router