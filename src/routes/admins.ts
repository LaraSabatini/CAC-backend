import express from "express"
import { getAdmins, getAdminName, editAdminData } from "../services/admins"

const router = express.Router()

router.get("/", getAdmins)

router.get("/id=:id", getAdminName)

router.put("/", editAdminData)

export default router
