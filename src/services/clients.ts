import pool from "../database/index"
import statusCodes from "../config/statusCodes"

const updatePaymentData = async (
  id: number,
  subscription: 1 | 0,
  plan: number,
  paymentDate: string,
  paymentExpireDate: string,
) => {
  try {
    const [client]: any = await pool.query(
      `UPDATE clients SET subscription = '${subscription}', paymentDate = '${paymentDate}',
      paymentExpireDate = '${paymentExpireDate}', plan = '${plan}'
        WHERE id = ${id}`,
    )

    if (client) {
      return {
        message: "Profile updated successfully",
        status: statusCodes.CREATED,
      }
    }
    return {
      message: "Client not found",
      status: statusCodes.NOT_FOUND,
    }
  } catch (error) {
    return {
      message: "Something went wrong",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    }
  }
}

// eslint-disable-next-line import/prefer-default-export
export { updatePaymentData }
