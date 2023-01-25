import express from "express"
import { uploadFiles, getFile } from "../services/fileManagement"

const router = express.Router()

router.post("/", uploadFiles)

router.get("/file_name=:file_name&file_extension=:file_extension", getFile)

export default router
