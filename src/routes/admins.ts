import express from "express"
import {
  getAdmins,
  getAdminName,
  editAdminData,
  uploadProfilePic,
  getProfilePic,
  removeProfilePic,
} from "../services/admins"

const router = express.Router()

router.get("/", getAdmins)

router.get("/id=:id", getAdminName)

router.put("/", editAdminData)

router.put("/profile-pic/id=:id", removeProfilePic)

router.post("/id=:id", uploadProfilePic)

router.get("/profile-pic/id=:id", getProfilePic)

export default router
