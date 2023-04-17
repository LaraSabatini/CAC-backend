import express from "express"
import {
  requestAdvisory,
  changeAdvisoryStatus,
  createEvent,
  requestAdvisoryChange,
  getEvents,
  signUpToEvent,
  getAdvisoriesByMonth,
} from "../services/advisories"
import {
  createAvailavility,
  getAvailavility,
  editAvailavility,
} from "../services//advisoryAvailability"

const router = express.Router()

router.post("/", requestAdvisory)
router.put("/status?from=:from", changeAdvisoryStatus)
router.put("/change?from=:from", requestAdvisoryChange)
router.get("/month=:month&id=:id&type=:type", getAdvisoriesByMonth)

router.post("/events", createEvent)
router.get("/events/month=:month", getEvents)
router.put("/events", signUpToEvent)

router.post("/availability", createAvailavility)
router.get("/availability?id=:id", getAvailavility)
router.put("/availability", editAvailavility)

export default router
