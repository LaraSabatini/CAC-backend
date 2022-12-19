import mercadopago from "mercadopago"
import pool from "../database/index"
import { PaymentInterface } from "../interfaces/Payment"

const createPreference = (req: any, res: any) => {
  const preference: any = {
    items: [
      {
        title: req.body.description,
        unit_price: Number(req.body.price),
        quantity: Number(req.body.quantity),
      },
    ],
    back_urls: {
      success: "http://localhost:8080/feedback",
      failure: "http://localhost:8080/feedback",
      pending: "http://localhost:8080/feedback",
    },
    auto_return: "approved",
  }

  mercadopago.preferences
    .create(preference)
    .then(response => {
      res.json({
        id: response.body.id,
      })
    })
    .catch((error: any) => {
      // eslint-disable-next-line no-console
      console.log("MP ERROR:", error)
    })
}

const getFeedback = (req: any, res: any) => {
  res.json({
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id,
  })
}

const createPayment = async (req: any, res: any) => {
  try {
    const {
      clientId,
      mpUser,
      paymentExpireDate,
      itemId,
      pricePaid,
    }: PaymentInterface = req.body

    const registerPayment = await pool.query(
      `INSERT INTO payments (clientId, mpUser, paymentExpireDate, itemId, pricePaid) VALUES ('${clientId}', '${mpUser}', '${paymentExpireDate}', '${itemId}', '${pricePaid}');`,
    )

    if (registerPayment) {
      res.status(200).json({ message: "Payment registered successfully" })
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "An error has occurred while registering the payment, please try again.",
    })
  }

  return {}
}

const getPaymentsByClient = async (req: any, res: any) => {
  try {
    const { id } = req.params

    const [payment]: any = await pool.query(
      `SELECT * FROM payments WHERE clientId = ${id}`,
    )

    if (payment.length) {
      res.status(200).json({ data: payment })
    } else {
      res.status(404)
      res.send({ error: "Payments not found" })
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "An error has occurred while getting the payments, please try again.",
    })
  }

  return {}
}

export { createPayment, getPaymentsByClient, createPreference, getFeedback }
