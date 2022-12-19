import express from "express"
import { createPayment, getPaymentsByClient } from "../services/payment"

const router = express.Router()

router.post("/", createPayment)

router.get("/search/id=:id", getPaymentsByClient)

export default router
