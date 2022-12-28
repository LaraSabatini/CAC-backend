import pool from "../database/index"

const getPricing = async (_req: any, res: any) => {
  try {
    const pricing = await pool.query(`SELECT * FROM pricing`)

    if (pricing) {
      return res.status(200).json({ data: pricing })
    }
  } catch (error) {
    return res.status(500).json({
      message: "An error has occurred, please try again.",
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
      return res.status(200).json({ message: "Pricing created successfully" })
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "An error has occurred while creating the pricing, please try again.",
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
      res.status(200)
      res.send({ message: "Pricing updated successfully" })
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "An error has occurred while updating the pricing, please try again.",
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
      res.status(200)
      res.send({ message: "Pricing deleted successfully" })
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "An error has occurred while deleting the pricing, please try again.",
    })
  }

  return {}
}

export { createPricing, editPricing, deletePricing, getPricing }
