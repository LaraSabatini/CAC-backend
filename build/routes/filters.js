import express from "express";
import { getFilters, createFilter, deleteFilter } from "../services/filters";
const router = express.Router();
router.post("/", createFilter);
router.get("/type=:type", getFilters);
router.delete("/id=:id&type=:type", deleteFilter);
export default router;
