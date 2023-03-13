import pool from "../database/index"
import statusCodes from "../config/statusCodes"

const getFilters = async (req: any, res: any) => {
  try {
    const { type } = req.params
    const [filters] = await pool.query(`SELECT * FROM ${type}`)

    if (filters) {
      return res
        .status(statusCodes.OK)
        .json({ data: filters, status: statusCodes.OK })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An error has occurred, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const createFilter = async (req: any, res: any) => {
  try {
    const { value, type } = req.body

    const insertFilter = await pool.query(
      `INSERT INTO ${type} (value) VALUES ('${value}');`,
    )

    if (insertFilter) {
      return res.status(statusCodes.CREATED).json({
        message: "Filter created successfully",
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message:
        "An error has occurred while creating the filter, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const deleteFilter = async (req: any, res: any) => {
  try {
    const { id, type } = req.params

    const [filter]: any = await pool.query(`DELETE FROM ${type} WHERE id=${id}`)

    if (filter) {
      res.status(statusCodes.CREATED)
      res.send({
        message: "Filter deleted successfully",
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message:
        "An error has occurred while deleting the filter, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

export { getFilters, createFilter, deleteFilter }
