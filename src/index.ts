import express from "express"
import config from "./config"

import usersRouter from "./routes/auth"
import pricingRouter from "./routes/pricing"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/users", usersRouter)
app.use("/pricing", pricingRouter)

app.get("/", (_req, res) => {
  res.json({ message: "ok" })
})

app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`APP LISTENING ON http://${config.HOST}:${config.PORT}`)
})
