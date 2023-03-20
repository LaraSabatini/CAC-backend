import express from "express";
import { unblockRequest } from "../services/support";
const router = express.Router();
router.post("/unblock_account/id=:id", unblockRequest);
export default router;
