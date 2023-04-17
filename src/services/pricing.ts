import pool from "../database/index"
import statusCodes from "../config/statusCodes"

const getPricing = async (_req: any, res: any) => {
  try {
    const [pricing] = await pool.query(`SELECT * FROM pricing`)

    if (pricing) {
      return res
        .status(statusCodes.OK)
        .json({ data: pricing, status: statusCodes.OK })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An error has occurred, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const createPricing = async (req: any, res: any) => {
  try {
    const { name, price, description, time } = req.body

    const insertPricing = await pool.query(
      `INSERT INTO pricing (name, price, description, time) VALUES ('${name}', '${price}', '${description}', '${time}');`,
    )

    if (insertPricing) {
      return res.status(statusCodes.CREATED).json({
        message: "Pricing created successfully",
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message:
        "An error has occurred while creating the pricing, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const editPricing = async (req: any, res: any) => {
  try {
    const { name, price, description, time } = req.body
    const { id } = req.params

    const [pricing]: any = await pool.query(
      `UPDATE pricing SET price = '${price}', name = '${name}', description = '${description}', time = '${time}' WHERE id = ${id}`,
    )

    if (pricing) {
      res.status(statusCodes.CREATED)
      res.send({
        message: "Pricing updated successfully",
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message:
        "An error has occurred while updating the pricing, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const deletePricing = async (req: any, res: any) => {
  try {
    const { id } = req.params

    const [pricing]: any = await pool.query(
      `DELETE FROM pricing WHERE id=${id}`,
    )

    if (pricing) {
      res.status(statusCodes.CREATED)
      res.send({
        message: "Pricing deleted successfully",
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message:
        "An error has occurred while deleting the pricing, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const getPricingAsFilter = async (_req: any, res: any) => {
  try {
    const [pricing] = await pool.query(`SELECT id, name FROM pricing`)

    if (pricing) {
      return res
        .status(statusCodes.OK)
        .json({ data: pricing, status: statusCodes.OK })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An error has occurred, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

export {
  createPricing,
  editPricing,
  deletePricing,
  getPricing,
  getPricingAsFilter,
}
