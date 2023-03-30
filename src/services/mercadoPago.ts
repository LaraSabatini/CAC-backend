/* eslint-disable @typescript-eslint/naming-convention */
import axios from "axios"
import mercadopago from "../helpers/mercadoPago"
import pool from "../database/index"
import statusCodes from "../config/statusCodes"
import config from "../config/index"
import returnPaymentResponse from "../helpers/returnPaymentResponse"
import { PreferenceInterface } from "../interfaces/payment/Payment"

const createPreference = async (req: any, res: any) => {
  try {
    const { type } = req.params

    const preference: PreferenceInterface = {
      binary_mode: true,
      items: req.body.item,
      payer: req.body.payer,
      back_urls: returnPaymentResponse(type),
      auto_return: "approved",
      notification_url:
        "https://camarafederal.com.ar/software/api/mercadoPago/notifications",
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

const getClientId = async (req: any, res: any) => {
  try {
    const { preferenceId } = req.params

    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.MP_ACCESS_TOKEN_TEST}`,
      },
    }

    const response: any = await axios.get(
      `https://api.mercadopago.com/checkout/preferences/${preferenceId}`,
      headers,
    )

    return res.status(statusCodes.OK).json({
      clientId: response.data.client_id,
      status: statusCodes.OK,
    })
  } catch {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An error has occurred, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }
}

const paymentNotification = async (req: any, res: any) => {
  try {
    // get https://api.mercadopago.com/v1/payments/paymentData.data.id
    // bearer: TEST-6602058583432591-010310-2f7ad3d408353f5b162ce3e24a7ddc17-1270310472

    const { id, action, data, date_created, type, user_id } = req.body

    const savePayment = await pool.query(
      `INSERT INTO notifications (id, action, payment_id, date_created, type, user_id) VALUES ('${id}', '${action}', '${data.id}', '${date_created}', '${type}', '${user_id}');`,
    )

    // actualizar datos de plan en el perfil del cliente => trayendo los datos la api payments
    /*
      additional_info.items
      */

    // registrar pago en payments
    // enviar mail de confirmacion

    if (savePayment) {
      res.status(200).send("OK")
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

export { createPreference, getClientId, paymentNotification }
