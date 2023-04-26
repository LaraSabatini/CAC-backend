import pool from "../database/index"
import statusCodes from "../config/statusCodes"

const getAdmins = async (_req: any, res: any) => {
  try {
    const [admins]: any = await pool.query(
      `SELECT id, userName, email FROM admin`,
    )

    if (admins) {
      return res.status(statusCodes.OK).json({
        data: admins,
        status: statusCodes.OK,
      })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An error has occurred, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

export { getAdmins }
