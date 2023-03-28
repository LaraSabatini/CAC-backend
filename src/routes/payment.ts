import express from "express"
import {
  registerPaymentInDB,
  getPaymentsByClient,
  createPreference,
} from "../services/payment"

const router = express.Router()

router.post("/register-in-db", registerPaymentInDB)

router.get("/search/id=:id", getPaymentsByClient)

router.post("/create-preference/type=:type", createPreference)

export default router
