import express from "express"
import {
  getTrainings,
  createTraining,
  deleteTraining,
  editTraining,
} from "../services/trainings"

const router = express.Router()

router.get("/page=:page", getTrainings)

router.post("/", createTraining)

router.delete("/id=:id", deleteTraining)

router.put("/id=:id", editTraining)

export default router
