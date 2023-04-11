import express from "express"
import {
  createPricing,
  editPricing,
  deletePricing,
  getPricing,
  getPricingAsFilter
} from "../services/pricing"

const router = express.Router()

router.post("/", createPricing)
router.put("/id=:id", editPricing)
router.delete("/id=:id", deletePricing)
router.get("/", getPricing)
router.get("/filters", getPricingAsFilter)

export default router
