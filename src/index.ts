import express from "express"
import cors from "cors"
import config from "./config"

import productsRouter from "./routes/products"

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.use("/products", productsRouter)

app.get("/", (_req, res) => {
  res.json({ message: "ok" })
})

app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`APP LISTENING ON http://${config.HOST}:${config.PORT}`)
})
