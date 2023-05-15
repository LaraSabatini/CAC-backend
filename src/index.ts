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
      "https://camarafederal.com.ar/",
      "http://camarafederal.com.ar/",
    ],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  }),
)

app.use(fileUpload())
app.use(express.static("files"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/plataforma/api/users", usersRouter)
app.use("/plataforma/api/pricing", pricingRouter)
app.use("/plataforma/api/articles", articlesRouter)
app.use("/plataforma/api/payment", paymentsRouter)
app.use("/plataforma/api/reCaptcha", validateHumanRouter)
app.use("/plataforma/api/feedback", feedbackRouter)
app.use("/plataforma/api/fileManagement", fileManagementRouter)
app.use("/plataforma/api/filters", filtersRouter)
app.use("/plataforma/api/support", supportRouter)
app.use("/plataforma/api/mercadoPago", mercadoPagoRouter)
app.use("/plataforma/api/clients", clientsRouter)
app.use("/plataforma/api/trainings", trainingsRouter)
app.use("/plataforma/api/advisories", advisoriesRouter)
app.use("/plataforma/api/admins", adminsRouter)

app.get("/plataforma/api", (_req, res) => {
  res.json({ message: "ok" })
})

app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`APP LISTENING ON http://${config.HOST}:${config.PORT}`)
})
