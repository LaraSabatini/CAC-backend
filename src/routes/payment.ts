import express from "express"
import { registerPaymentInDB, getPaymentsByClient } from "../services/payment"

const router = express.Router()

router.post("/register-in-db", registerPaymentInDB)

router.get("/search/id=:id", getPaymentsByClient)

export default router
