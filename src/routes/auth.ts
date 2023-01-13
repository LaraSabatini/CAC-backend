import express from "express"
import {
  adminRegister,
  adminLogin,
  adminChangePassword,
  getAdminData,
  editAdminData,
} from "../services/adminAuth"
import {
  clientRegister,
  clientLogin,
  clientChangePassword,
  validateEmail,
  validateIdentificationNumber,
  getClientData,
  editClientData,
} from "../services/clientAuth"

const router = express.Router()

router.post("/admin/login", adminLogin)

router.post("/admin/register", adminRegister)

router.put("/admin/change-password", adminChangePassword)

router.post("/client/login", clientLogin)

router.post("/client/register", clientRegister)

router.put("/client/change-password", clientChangePassword)

router.post("/client/validate-email", validateEmail)
router.post(
  "/client/validate-identification_number",
  validateIdentificationNumber,
)

router.get("/client/id=:id", getClientData)

router.put("/client/id=:id", editClientData)

router.get("/admin/id=:id", getAdminData)

router.put("/admin/id=:id", editAdminData)

export default router
