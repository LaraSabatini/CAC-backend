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
      paymentExpireDate = '${paymentExpireDate}', plan = '${plan}', accountBlocked = '0'
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

const editSavedArticles = async (req: any, res: any) => {
  try {
    const { id } = req.params
    const {
      savedArticles
    } = req.body

    const [client]: any = await pool.query(
      `UPDATE clients SET savedArticles = '${savedArticles}' WHERE id = ${id}`,
    )

    if (client) {
      res.status(statusCodes.CREATED)
      res.send({
        message: "Saved articles edited successfully",
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const getSavedArticles = async (req: any, res: any) => {
  try {
    const {id} = req.params

    const [articleList]: any = await pool.query(`SELECT savedArticles FROM clients WHERE id = ${id}`)

    console.log(articleList)

    if (articleList) {
      return res
        .status(statusCodes.OK)
        .json({ data: articleList[0].savedArticles === '' ? '[]' : articleList[0].savedArticles, status: statusCodes.OK })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An error has occurred, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

export { updatePaymentData, editSavedArticles, getSavedArticles }
