import express from "express"
import uploadFiles from "../services/uploadFiles"

const router = express.Router()

router.post("/", uploadFiles)

export default router
