import express from "express";
import validateReCaptcha from "../services/validateReCaptcha";
const router = express.Router();
router.post("/", validateReCaptcha);
export default router;
