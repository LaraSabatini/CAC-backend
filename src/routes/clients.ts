import express from "express"
import {
  editSavedArticles,
  getSavedArticles,
  createComment,
  getCommentsByClient,
  filterClients,
  searchClients,
  getClientsEmails,
  getClientEmail,
} from "../services/clients"

const router = express.Router()

router.put("/saved-articles/id=:id", editSavedArticles)

router.get("/saved-articles/id=:id", getSavedArticles)

router.post("/comments", createComment)

router.get("/comments/id=:id", getCommentsByClient)

router.get("/emails", getClientsEmails)

router.get("/email/id=:id", getClientEmail)

router.post("/filter", filterClients)

router.post("/search", searchClients)

export default router
