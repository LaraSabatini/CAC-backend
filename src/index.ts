import express from "express"
import fileUpload from "express-fileupload"
import bodyParser from "body-parser"
import cors from "cors"
import config from "./config"

import usersRouter from "./routes/auth"
import pricingRouter from "./routes/pricing"
import articlesRouter from "./routes/articles"
import paymentsRouter from "./routes/payment"
import validateHumanRouter from "./routes/validateReCaptcha"
import feedbackRouter from "./routes/feedback"
import fileManagementRouter from "./routes/fileManagement"
import filtersRouter from "./routes/filters"
import supportRouter from "./routes/support"
import mercadoPagoRouter from "./routes/mercadoPago"
import clientsRouter from "./routes/clients"
import trainingsRouter from "./routes/trainings"
import advisoriesRouter from "./routes/advisories"
import adminsRouter from "./routes/admins"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(
  cors({
    origin: [
      "https://cac-frontend-qa.vercel.app",
      "http://localhost:3000",
      "https://cac-frontend-git-feat-update-payment-larasabatini.vercel.app",
    ],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  }),
)

app.use(fileUpload())
app.use(express.static("files"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/software/api/users", usersRouter)
app.use("/software/api/pricing", pricingRouter)
app.use("/software/api/articles", articlesRouter)
app.use("/software/api/payment", paymentsRouter)
app.use("/software/api/reCaptcha", validateHumanRouter)
app.use("/software/api/feedback", feedbackRouter)
app.use("/software/api/fileManagement", fileManagementRouter)
app.use("/software/api/filters", filtersRouter)
app.use("/software/api/support", supportRouter)
app.use("/software/api/mercadoPago", mercadoPagoRouter)
app.use("/software/api/clients", clientsRouter)
app.use("/software/api/trainings", trainingsRouter)
app.use("/software/api/advisories", advisoriesRouter)
app.use("/software/api/admins", adminsRouter)

app.get("/software/api/", (_req, res) => {
  res.json({ message: "ok" })
})

app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`APP LISTENING ON http://${config.HOST}:${config.PORT}`)
})
