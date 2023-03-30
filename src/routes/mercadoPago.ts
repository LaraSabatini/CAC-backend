import express from "express"
import {
  createPreference,
  getClientId,
  paymentNotification,
} from "../services/mercadoPago"

const router = express.Router()

router.get("/getClient/preferenceId=:preferenceId", getClientId)

router.post("/create-preference/type=:type", createPreference)

router.post("/notifications", paymentNotification)

export default router
