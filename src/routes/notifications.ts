import express from "express"
import paymentNotification from "../services/notifications"

const router = express.Router()

router.post("/", paymentNotification)

export default router
