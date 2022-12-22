import express from "express"
import {
  createProduct,
  editProduct,
  deleteProduct,
  getProducts,
} from "../services/products"

const router = express.Router()

router.post("/", createProduct)
router.put("/id=:id", editProduct)
router.delete("/id=:id", deleteProduct)
router.get("/", getProducts)

export default router
