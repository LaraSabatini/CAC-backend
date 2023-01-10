import express from "express"
import {
  createPricing,
  editPricing,
  deletePricing,
  getPricing,
} from "../../services/pricing"

const router = express.Router()

router.post("/", createPricing)
router.put("/id=:id", editPricing)
router.delete("/id=:id", deletePricing)
router.get("/", getPricing)

export default router
