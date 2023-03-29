import mercadopago from "../helpers/mercadoPago"
import pool from "../database/index"
import statusCodes from "../config/statusCodes"
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
      res.status(statusCodes.CREATED).json({
        message: "Payment registered successfully",
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message:
        "An error has occurred while registering the payment, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
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
      res.status(statusCodes.OK).json({ data: payment, status: statusCodes.OK })
    } else {
      res.status(statusCodes.NOT_FOUND)
      res.send({ error: "Payments not found", status: statusCodes.NOT_FOUND })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message:
        "An error has occurred while getting the payments, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const createPreference = async (req: any, res: any) => {
  try {
    const { type } = req.params

    const successURL =
      type === "subscription"
        ? "http://localhost:3000/payment?payment_status=success"
        : "http://localhost:3000/profile?payment_done=success"

    const failureURL =
      type === "subscription"
        ? "http://localhost:3000/payment?payment_status=failure"
        : "http://localhost:3000/profile?payment_done=failure"

    const pendingURL =
      type === "subscription"
        ? "http://localhost:3000/payment?payment_status=pending"
        : "http://localhost:3000/profile?payment_done=pending"

    const preference: {
      binary_mode: boolean
      items: any
      payer: any
      back_urls: {
        success: string
        failure: string
        pending: string
      }
      auto_return: "approved" | "all" | undefined
      notification_url: string
    } = {
      binary_mode: true,
      items: req.body.item,
      payer: req.body.payer,
      back_urls: {
        success: successURL,
        failure: failureURL,
        pending: pendingURL,
      },
      auto_return: "approved",
      notification_url:
        "https://camarafederal.com.ar/software/api/notifications",
    }

    mercadopago.preferences
      .create(preference)
      .then((response: any) => {
        res.json({
          id: response.body.id,
          status: statusCodes.CREATED,
        })
      })
      .catch((error: any) => {
        res.status(statusCodes.NOT_FOUND)
        res.send({
          error,
          message: "Couldn't process payment",
          status: statusCodes.NOT_FOUND,
        })
      })
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message:
        "An error has occurred while getting the preference, please try again.",
    })
  }

  return {}
}

export { registerPaymentInDB, getPaymentsByClient, createPreference }
