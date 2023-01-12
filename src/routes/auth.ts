import express from "express"
import {
  adminRegister,
  adminLogin,
  adminChangePassword,
  getAdminData,
} from "../services/adminAuth"
import {
  clientRegister,
  clientLogin,
  clientChangePassword,
  validateDuplicatedUser,
  getClientData,
} from "../services/clientAuth"

const router = express.Router()

router.post("/admin/login", adminLogin)

router.post("/admin/register", adminRegister)

router.put("/admin/change-password", adminChangePassword)

router.post("/client/login", clientLogin)

router.post("/client/register", clientRegister)

router.put("/client/change-password", clientChangePassword)

router.post("/client/validate", validateDuplicatedUser)

router.get("/client/id=:id", getClientData)

router.get("/admin/id=:id", getAdminData)

export default router
