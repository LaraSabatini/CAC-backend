import pool from "../database/index"
import statusCodes from "../config/statusCodes"

const paymentNotification = async (req: any, res: any) => {
  try {
    const savePayment = await pool.query(
      `INSERT INTO notifications (nombre) VALUES ('${JSON.stringify(
        req.body,
      )}');`,
    )

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

export default paymentNotification
