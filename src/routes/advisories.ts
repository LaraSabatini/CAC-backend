import express from "express"
import {
  requestAdvisory,
  changeAdvisoryStatus,
  createEvent,
  requestAdvisoryChange,
  getEvents,
  signUpToEvent,
  getAdvisoriesByMonth,
  deletePublicEvent,
  editPublicEvent,
  getAdvisoriesByMonthAndAdmin,
  getAllAdvisoriesByMonth,
  getAdvisoryById,
} from "../services/advisories"
import {
  createAvailavility,
  getAvailavility,
  editAvailavility,
  getAllAvailavility,
} from "../services/advisoryAvailability"

const router = express.Router()

router.post("/", requestAdvisory)
router.put("/status/from=:from", changeAdvisoryStatus)
router.put("/change/from=:from", requestAdvisoryChange)
router.get("/month=:month&id=:id&type=:type", getAdvisoriesByMonth)
router.get(
  "/month-admin/month=:month&adminId=:adminId",
  getAdvisoriesByMonthAndAdmin,
)
router.get("/month/month=:month", getAllAdvisoriesByMonth)

router.get("/advisory-data/id=:id", getAdvisoryById)

router.post("/events", createEvent)
router.get("/events/month=:month", getEvents)
router.put("/events", signUpToEvent)
router.put("/events/edit", editPublicEvent)
router.delete("/events/id=:id", deletePublicEvent)

router.post("/availability", createAvailavility)
router.get("/availability/adminId=:adminId", getAvailavility)
router.put("/availability", editAvailavility)
router.get("/all-availability", getAllAvailavility)

export default router
