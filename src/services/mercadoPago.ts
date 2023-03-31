/* eslint-disable @typescript-eslint/naming-convention */
import axios from "axios"
import mercadopago from "../helpers/mercadoPago"
import pool from "../database/index"
import statusCodes from "../config/statusCodes"
import config from "../config/index"
import returnPaymentResponse from "../helpers/returnPaymentResponse"
import {
  PreferenceInterface,
  // PlanInterface,
  // DBPaymentInterface,
} from "../interfaces/payment/Payment"
// import addMonths from "../helpers/addMonths"
// import { updatePaymentData } from "./clients"
// import { dateFormated } from "../helpers/getToday"
// import defaultPost from "../helpers/defaultPost"

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

// const getPaymentData = async (paymentId: string) => {
//   const headers = {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${config.MP_ACCESS_TOKEN_TEST}`,
//     },
//   }

//   const response: any = await axios.get(
//     `https://api.mercadopago.com/v1/payments/${paymentId}`,
//     headers,
//   )

//   return response
// }

// const registerPaymentInDB = async (payment: DBPaymentInterface) => {
//   const res = await defaultPost(
//     "http://localhost:3001/software/api/payment/register-in-db",
//     payment,
//   )
//   return res
// }

const paymentNotification = async (req: any, res: any) => {
  try {
    // get https://api.mercadopago.com/v1/payments/${data.id}
    // bearer: TEST-6602058583432591-010310-2f7ad3d408353f5b162ce3e24a7ddc17-1270310472

    const { action, data, date_created, type, user_id } = req.body

    const savePayment = await pool.query(
      `INSERT INTO notifications (action, payment_id, date_created, type, user_id) VALUES ('${action}', '${data.id}', '${date_created}', '${type}', '${user_id}');`,
    )

    // const [client]: any = await pool.query(
    //   `SELECT id FROM clients WHERE mpId = '${user_id}'`,
    // )

    // // 1. traer datos de la compra
    // const getPaymentDataCall = await getPaymentData(data.id)

    // // 2. traer datos de planes
    // const [pricing]: any = await pool.query(`SELECT * FROM pricing`)

    // // 3. encontrar el plan al que se anoto
    // const filterPlans = pricing.filter(
    //   (plan: PlanInterface) =>
    //     plan.id === getPaymentDataCall.additional_info.items[0].id,
    // )[0].time

    // // 4. Actualizar datos de subscripcion en el perfil con esos datos
    // const today = new Date()

    // const updatePayment = await updatePaymentData(
    //   user_id,
    //   1,
    //   getPaymentDataCall.additional_info.items[0].id,
    //   dateFormated,
    //   addMonths(filterPlans, today),
    // )

    // // eslint-disable-next-line no-console
    // console.log("updatePayment", updatePayment)

    // // 5. crear pago nuevo
    // const registerPaymentInDBCall = await registerPaymentInDB({
    //   paymentId: data.id,
    //   preferenceId: "",
    //   clientId: client[0].id,
    //   mpId: user_id,
    //   itemId: getPaymentDataCall.additional_info.items[0].id,
    //   pricePaid: getPaymentDataCall.additional_info.items[0].unit_price,
    //   date: dateFormated,
    //   paymentExpireDate: addMonths(filterPlans, today),
    // })
    // // eslint-disable-next-line no-console
    // console.log("registerPaymentInDBCall", registerPaymentInDBCall)

    // const [payment]: any = await pool.query(
    //   `SELECT id FROM payments WHERE mpId = ${user_id}`,
    // )

    // if (!payment.length) {
    //   // a.
    //   //   // enviar mail de registro
    //   // eslint-disable-next-line no-console
    //   console.log(client)
    //   // eslint-disable-next-line no-console
    //   console.log("ENVIAR MAIL")
    // } else {
    //   // b.
    //   // eslint-disable-next-line no-console
    //   console.log("NADA")
    // }

    if (savePayment) {
      res.status(200).send("OK")
    }
    //  else {
    //   res.status(200).send("OK")
    // }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message:
        "An error has occurred while registering the payment, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
      error,
    })
  }

  return {}
}

export { createPreference, getClientId, paymentNotification }
