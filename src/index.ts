import express from "express"
import cors from "cors"
import config from "./config"

import usersRouter from "./routes/auth"
import pricingRouter from "./routes/pricing"
import articlesRouter from "./routes/articles"
import paymentsRouter from "./routes/payment"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  }),
)

app.use("/users", usersRouter)
app.use("/pricing", pricingRouter)
app.use("/articles", articlesRouter)
app.use("/payment", paymentsRouter)

app.get("/", (_req, res) => {
  res.json({ message: "ok" })
})

app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`APP LISTENING ON http://${config.HOST}:${config.PORT}`)
})
