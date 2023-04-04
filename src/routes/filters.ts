import express from "express"
import { getFilters, createFilter, deleteFilter } from "../services/filters"

const router = express.Router()

router.post("/", createFilter)
router.get("/", getFilters)
router.delete("/id=:id", deleteFilter)

export default router
