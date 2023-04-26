/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */
import axios from "axios"
import mercadopago from "../helpers/mercadoPago"
import pool from "../database/index"
import statusCodes from "../config/statusCodes"
import config from "../config/index"
import returnPaymentResponse from "../helpers/returnPaymentResponse"
import {
  PreferenceInterface,
  PlanInterface,
} from "../interfaces/payment/Payment"
import addMonths from "../helpers/addMonths"
import generatePassword from "../helpers/generatePassword"
import { encrypt } from "../helpers/handleBcrypt"
import { updatePaymentData } from "./clients"
import { dateFormated } from "../helpers/getToday"
import defaultPost from "../helpers/defaultPost"

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
        Authorization: `Bearer ${config.MP_ACCESS_TOKEN_AS_SELLER}`,
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
    return res.status(statusCodes.OK).json({
      message: "An error has occurred, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }
}

const getPaymentData = async (paymentId: string) => {
  const headers = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.MP_ACCESS_TOKEN_AS_SELLER}`,
    },
  }

  const response: any = await axios.get(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    headers,
  )

  return response
}

const sendRegisterEmail = async (body: {
  recipients: string[]
  name: string
  item: string
  password: string
  loginURL: string
}) => {
  const res = await defaultPost(
    `https://camarafederal.com.ar/software/api/users/client/register_success_email`,
    body,
  )
  return res
}

const processPayment = async (email: string, paymentId: string) => {
  let success = false

  const password = generatePassword()

  const [client]: any = await pool.query(
    `SELECT id, email, name, mpId FROM clients WHERE email LIKE '${email}'`,
  )

  const getPaymentDataCall = await getPaymentData(paymentId)

  const [pricing]: any = await pool.query(`SELECT * FROM pricing`)

  const filterPlans = pricing.filter(
    (plan: PlanInterface) =>
      plan.id ===
      parseInt(getPaymentDataCall.data.additional_info.items[0].id, 10),
  )[0].time

  const today = new Date()

  const updatePayment = await updatePaymentData(
    client[0].id,
    1,
    parseInt(getPaymentDataCall.data.additional_info.items[0].id, 10),
    dateFormated,
    addMonths(filterPlans, today),
  )

  // Checkear si enviar mail o no
  const [payment]: any = await pool.query(
    `SELECT id FROM payments WHERE clientId = ${client[0].id}`,
  )

  const registerPayment = await pool.query(
    `INSERT INTO payments (paymentId,
          clientId,
          mpId,
          itemId,
          pricePaid,
          date,
          paymentExpireDate) VALUES ('${paymentId}',
          '${client[0].id}',
          '${client[0].mpId}',
          '${getPaymentDataCall.data.additional_info.items[0].id}',
          '${parseInt(
            getPaymentDataCall.data.additional_info.items[0].unit_price,
            10,
          )}',
          '${dateFormated}',
          '${addMonths(filterPlans, today)}'
          );`,
  )

  success = registerPayment.length && updatePayment.status === 201

  if (!payment.length) {
    const passwordHash = await encrypt(password)

    const [changePassword]: any = await pool.query(
      `UPDATE clients SET password = '${passwordHash}' WHERE id = ${client[0].id}`,
    )

    if (changePassword) {
      const sendEmail = await sendRegisterEmail({
        recipients: [client[0].email],
        name: client[0].name,
        item: getPaymentDataCall.data.additional_info.items[0].title,
        password,
        loginURL: "http://localhost:3000/login?user=client",
      })

      success = sendEmail.status === 201
    }
  }

  return success
}

const paymentNotification = async (req: any, res: any) => {
  try {
    const { data } = req.body

    const mpUser = await getPaymentData(data.id)

    const processAdmission = await processPayment(
      mpUser.data.payer.email,
      data.id,
    )

    if (processAdmission) {
      res.status(200).send("OK")
    }
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
