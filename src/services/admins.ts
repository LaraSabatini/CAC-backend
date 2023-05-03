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
    return res.status(statusCodes.OK).json({
      message: "An error has occurred, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const getAdminName = async (req: any, res: any) => {
  try {
    const { id } = req.params

    const [admin]: any = await pool.query(
      `SELECT userName FROM admin WHERE id = '${id}'`,
    )

    if (admin) {
      return res.status(statusCodes.OK).json({
        data: admin,
        status: statusCodes.OK,
      })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "An error has occurred, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const editAdminData = async (req: any, res: any) => {
  try {
    const { id, userName, email } = req.body

    const [admin]: any = await pool.query(
      `UPDATE admin SET email = '${email}', userName = '${userName}' WHERE id = ${id}`,
    )

    if (admin) {
      return res.status(statusCodes.OK).json({
        data: "success",
        status: statusCodes.OK,
      })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "An error has occurred, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
      error,
    })
  }

  return {}
}

export { getAdmins, getAdminName, editAdminData }
