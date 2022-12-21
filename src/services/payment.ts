import mercadopago from "../helpers/mercadoPago"
import pool from "../database/index"
import { PaymentInterface } from "../interfaces/Payment"

const registerPaymentInDB = async (req: any, res: any) => {
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

const createPreference = async (req: any, res: any) => {
  try {
    const preference: {
      items: any
      payer: any
      back_urls: {
        success: string
        failure: string
        pending: string
      }
      auto_return: "approved" | "all" | undefined
    } = {
      items: req.body.items,
      payer: req.body.payer,
      back_urls: {
        success: "http://localhost:3000/login",
        failure: "http://localhost:3000/failure",
        pending: "http://localhost:3000/pending",
      },
      auto_return: "approved",
    }

    mercadopago.preferences
      .create(preference)
      .then((response: any) => {
        res.json({
          res: response,
        })
      })
      .catch((error: any) => {
        res.status(404)
        res.send({ error, message: "Couldn't process payment" })
      })
  } catch (error) {
    return res.status(500).json({
      message:
        "An error has occurred while getting the preference, please try again.",
    })
  }

  return {}
}

export { registerPaymentInDB, getPaymentsByClient, createPreference }
