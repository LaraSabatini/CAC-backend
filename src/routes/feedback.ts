import express from "express"
import { createFeedback, getFeedback } from "../services/feedback"

const router = express.Router()

router.post("/", createFeedback)

router.get("/page=:page", getFeedback)

export default router
