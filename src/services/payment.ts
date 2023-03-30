import pool from "../database/index"
import statusCodes from "../config/statusCodes"
import { DBPaymentInterface } from "../interfaces/payment/Payment"

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
    }: DBPaymentInterface = req.body

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

export { registerPaymentInDB, getPaymentsByClient }
