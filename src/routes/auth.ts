import express from "express"
import {
  adminRegister,
  adminLogin,
  adminChangePassword,
  getAdminData,
  editAdminData,
  restoreAdminPasswordEmail,
} from "../services/adminAuth"
import {
  clientRegister,
  clientLogin,
  clientChangePassword,
  validateEmail,
  validateIdentificationNumber,
  getClientData,
  editClientData,
  blockAccount,
  registerSuccessEmail,
  restoreClientPasswordEmail,
} from "../services/clientAuth"

const router = express.Router()

router.post("/admin/login", adminLogin)

router.post("/admin/register", adminRegister)

router.put("/admin/change-password&encrypted=:encrypted", adminChangePassword)

router.post("/client/login", clientLogin)

router.post("/client/register", clientRegister)

router.put("/client/change-password&encrypted=:encrypted", clientChangePassword)

router.post("/client/validate-email", validateEmail)
router.post(
  "/client/validate-identification_number",
  validateIdentificationNumber,
)

router.get("/client/id=:id", getClientData)

router.put("/client/id=:id", editClientData)

router.put("/client/block_account=true&id=:id", blockAccount)

router.get("/admin/id=:id", getAdminData)

router.put("/admin/id=:id", editAdminData)

router.post("/client/register_success_email", registerSuccessEmail)

router.post("/client/restore_password", restoreClientPasswordEmail)
router.post("/admin/restore_password", restoreAdminPasswordEmail)

export default router
