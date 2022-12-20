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

export { registerPaymentInDB, getPaymentsByClient }
