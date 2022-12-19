import express from "express"
import mercadopago from "mercadopago"
import cors from "cors"
import config from "./config"

// import usersRouter from "./routes/auth"
// import paymentsRouter from "./routes/payment"

mercadopago.configure({
  access_token: `${config.MP_ACCESS_TOKEN}`,
})

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

const preference = {
  items: [
    {
      title: "Mi producto",
      unit_price: 100,
      quantity: 1,
    },
  ],
}

mercadopago.preferences
  .create(preference)
  .then(response => {
    // En esta instancia deberás asignar el valor dentro de response.body.id por el ID de preferencia solicitado en el siguiente paso
    // eslint-disable-next-line no-console
    console.log("MP RES:", response)
  })
  .catch(error => {
    // eslint-disable-next-line no-console
    console.log("MP ERROR:", error)
  })

// app.post("/create_preference", (req, res) => {
//   const preference = {
//     items: [
//       {
//         title: req.body.description,
//         unit_price: Number(req.body.price),
//         quantity: Number(req.body.quantity),
//       },
//     ],
//     back_urls: {
//       success: "http://localhost:8080/feedback",
//       failure: "http://localhost:8080/feedback",
//       pending: "http://localhost:8080/feedback",
//     },
//     auto_return: "approved",
//   }

//   mercadopago.preferences
//     .create(preference)
//     .then(response => {
//       res.json({
//         id: response.body.id,
//       })
//     })
//     .catch(error => {
//       // eslint-disable-next-line no-console
//       console.log("MP ERROR:", error)
//     })
// })

// app.get("/feedback", (req, res) => {
//   res.json({
//     Payment: req.query.payment_id,
//     Status: req.query.status,
//     MerchantOrder: req.query.merchant_order_id,
//   })
// })

// app.use("/users", usersRouter)
// app.use("/payments", paymentsRouter)

// app.use(express.json())
// app.use(
//   express.urlencoded({
//     extended: true,
//   }),
// )

// app.use((_req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*")
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept",
//   )
//   res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS")
//   next()
// })

app.get("/", (_req, res) => {
  res.json({ message: "ok" })
})

app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`APP LISTENING ON http://${config.HOST}:${config.PORT}`)
})
