import mercadopago from "../helpers/mercadoPago"
import pool from "../database/index"
import { PaymentInterface } from "../interfaces/payment/Payment"

const registerPaymentInDB = async (req: any, res: any) => {
  try {
    const {
      paymentId,
      collectionId,
      collectionStatus,
      status,
      paymentType,
      merchantOrderId,
      preferenceId,
      pricePaid,
      clientId,
      paymentExpireDate,
      itemId,
    }: PaymentInterface = req.body

    const registerPayment = await pool.query(
      `INSERT INTO payments (paymentId,
        collectionId,
        collectionStatus,
        status,
        paymentType,
        merchantOrderId,
        preferenceId,
        pricePaid,
        clientId,
        paymentExpireDate,
        itemId) VALUES ('${paymentId}',
        '${collectionId}',
        '${collectionStatus}',
        '${status}',
        '${paymentType}',
        '${merchantOrderId}',
        '${preferenceId}',
        '${pricePaid}',
        '${clientId}',
        '${paymentExpireDate}',
        '${itemId}');`,
    )

    if (registerPayment) {
      res
        .status(200)
        .json({ message: "Payment registered successfully", status: 200 })
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "An error has occurred while registering the payment, please try again.",
      status: 500,
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
      res.status(200).json({ data: payment, status: 200 })
    } else {
      res.status(404)
      res.send({ error: "Payments not found", status: 400 })
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "An error has occurred while getting the payments, please try again.",
      status: 500,
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
      items: req.body.item,
      payer: req.body.payer,
      back_urls: {
        success: "http://localhost:3000/payment?payment_status=success",
        failure: "http://localhost:3000/payment?payment_status=failure",
        pending: "http://localhost:3000/payment?payment_status=pending",
      },
      auto_return: "approved",
    }

    mercadopago.preferences
      .create(preference)
      .then((response: any) => {
        res.json({
          id: response.body.id,
          status: 200,
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
