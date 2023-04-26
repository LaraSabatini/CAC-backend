import express from "express"
import { getAdmins } from "../services/admins"

const router = express.Router()

router.get("/", getAdmins)

export default router
