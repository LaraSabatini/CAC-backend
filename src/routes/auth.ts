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
  updateClientPaymentData,
  getClientDataForTable,
  accountBlockedNotificationEmail,
  accountUnblockedNotificationEmail,
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

router.put("/client/block_account=:action&id=:id", blockAccount)

router.put("/client/update_payment_data&id=:id", updateClientPaymentData)

router.get("/admin/id=:id", getAdminData)

router.put("/admin/id=:id", editAdminData)

router.post("/client/register_success_email", registerSuccessEmail)

router.post("/client/restore_password", restoreClientPasswordEmail)
router.post("/admin/restore_password", restoreAdminPasswordEmail)

router.get("/client/user_data&page=:page", getClientDataForTable)

router.post("/client/block_account_mail", accountBlockedNotificationEmail)
router.post("/client/unblock_account_mail", accountUnblockedNotificationEmail)

export default router
