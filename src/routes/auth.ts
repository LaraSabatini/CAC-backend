import express from "express"
import {
  adminRegister,
  adminLogin,
  adminChangePassword,
} from "../services/adminAuth"
import {
  clientRegister,
  clientLogin,
  clientChangePassword,
} from "../services/clientAuth"

const router = express.Router()

router.post("/admin/login", adminLogin)

router.post("/admin/register", adminRegister)

router.post("/admin/change-password", adminChangePassword)

router.post("/client/login", clientLogin)

router.post("/client/register", clientRegister)

router.put("/client/change-password", clientChangePassword)

export default router
