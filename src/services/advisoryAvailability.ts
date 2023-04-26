import pool from "../database/index"
import statusCodes from "../config/statusCodes"

const createAvailavility = async (req: any, res: any) => {
  try {
    const { adminId, availability } = req.body
    //
    const request = await pool.query(
      `INSERT INTO advisoryAvailability (adminId, availability) VALUES ('${adminId}', '${availability}');`,
    )

    if (request) {
      return res.status(statusCodes.CREATED).json({
        message: "success",
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "Internal error",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const getAvailavility = async (req: any, res: any) => {
  try {
    const { adminId } = req.params

    const [request] = await pool.query(
      `SELECT * FROM advisoryAvailability WHERE adminId LIKE '${adminId}';`,
    )
    if (request) {
      return res.status(statusCodes.OK).json({
        data: request,
        status: statusCodes.OK,
      })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "Internal error",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const editAvailavility = async (req: any, res: any) => {
  try {
    const { id, adminId, availability } = req.body

    const [availabilityChange]: any = await pool.query(
      `UPDATE advisoryAvailability SET adminId = '${adminId}', availability = '${availability}' WHERE id = ${id}`,
    )

    if (availabilityChange) {
      return res.status(statusCodes.CREATED).json({
        message: "success",
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "Internal error",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const getAllAvailavility = async (_req: any, res: any) => {
  try {
    const [request] = await pool.query(`SELECT * FROM advisoryAvailability;`)
    if (request) {
      return res.status(statusCodes.OK).json({
        data: request,
        status: statusCodes.OK,
      })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "Internal error",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

export {
  createAvailavility,
  getAvailavility,
  editAvailavility,
  getAllAvailavility,
}
