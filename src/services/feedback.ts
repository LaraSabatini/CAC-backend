import { ResultSetHeader } from "mysql2"
import pool from "../database/index"
import config from "../config/index"
import statusCodes from "../config/statusCodes"
import { getOffset } from "../helpers/pagination"

const createFeedback = async (req: any, res: any) => {
  try {
    const { optionId, optionValue, clientId } = req.body

    const registerFeedback = await pool.query(
      `INSERT INTO feedback (optionId, optionValue, clientId) VALUES ('${optionId}', '${optionValue}', '${clientId}');`,
    )

    if (registerFeedback) {
      return res.status(statusCodes.CREATED).json({
        message: "Feedback registered successfully",
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message:
        "An error has occurred while saving the feedback, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const getFeedback = async (req: any, res: any) => {
  try {
    const { page } = req.params
    const offset = getOffset(config.listPerPage, page)

    const [feedback] = await pool.query(
      `SELECT * FROM feedback LIMIT ${offset},${config.listPerPage}`,
    )
    const [amountOfPages] = await pool.query(`SELECT COUNT(*) FROM feedback`)

    if (feedback) {
      const rowData: ResultSetHeader = amountOfPages as ResultSetHeader

      const meta = {
        page,
        totalPages: parseInt(Object.keys(rowData)[0], 10),
      }

      return res.status(statusCodes.OK).json({
        data: feedback,
        meta,
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

export { createFeedback, getFeedback }
