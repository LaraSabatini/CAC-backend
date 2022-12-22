import pool from "../database/index"

const getProducts = async (_req: any, res: any) => {
  try {
    const products = await pool.query(`SELECT * FROM items`)

    if (products) {
      return res.status(200).json({ data: products })
    }
  } catch (error) {
    return res.status(500).json({
      message: "An error has occurred, please try again.",
    })
  }

  return {}
}

const createProduct = async (req: any, res: any) => {
  try {
    const { name, price } = req.body

    const insertProduct = await pool.query(
      `INSERT INTO items (name, price) VALUES ('${name}', '${price}');`,
    )

    if (insertProduct) {
      return res.status(200).json({ message: "Product created successfully" })
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "An error has occurred while creating the product, please try again.",
    })
  }

  return {}
}

const editProduct = async (req: any, res: any) => {
  try {
    const { name, price, id } = req.body

    const [product]: any = await pool.query(
      `UPDATE items SET price = '${price}', name = '${name}' WHERE id = ${id}`,
    )

    if (product) {
      res.status(200)
      res.send({ message: "Product updated successfully" })
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "An error has occurred while updating the product, please try again.",
    })
  }

  return {}
}

const deleteProduct = async (req: any, res: any) => {
  try {
    const { id } = req.body

    const [product]: any = await pool.query(`DELETE FROM items WHERE id=${id}`)

    if (product) {
      res.status(200)
      res.send({ message: "Product deleted successfully" })
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "An error has occurred while deleting the product, please try again.",
    })
  }

  return {}
}

export { createProduct, editProduct, deleteProduct, getProducts }
