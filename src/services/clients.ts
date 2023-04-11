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

const createComment = async (req: any, res: any) => {
  try {
    const { clientId, comment, author, date, hour } = req.body

    const createComment = await pool.query(
      `INSERT INTO comments (clientId, comment, author, date, hour) VALUES ('${clientId}', '${comment}', '${author}', '${date}', '${hour}');`,
    )

    if (createComment) {
      return res.status(statusCodes.CREATED).json({
        message: "Comment created successfully",
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message:
        "An error has occurred while saving the comment, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const getCommentsByClient = async (req: any, res: any) => {
  try {
    const {id} = req.params

    const [comments]: any = await pool.query(`SELECT * FROM comments WHERE clientId = ${id} ORDER BY id DESC`)

    if (comments) {
      return res
        .status(statusCodes.OK)
        .json({ data: comments, status: statusCodes.OK })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An error has occurred, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const filterClients = async (req: any, res: any) => {
  try {
    const { regionIds, planIds } = req.body

    let clients: any[] = []

    for (let i = 0; i < regionIds.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const [results]: any[] = await pool.query(
        `SELECT * FROM clients WHERE region LIKE '%${regionIds[i]}%'`,
      )

      clients = [...clients, ...results]
    }

    for (let i = 0; i < planIds.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const [results]: any[] = await pool.query(
        `SELECT * FROM clients WHERE plan LIKE '%${planIds[i]}%'`,
      )
      clients = [...clients, ...results]
    }

    if (clients) {
      return res.status(statusCodes.OK).json({
        data: clients,
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

export { updatePaymentData, editSavedArticles, getSavedArticles, createComment, getCommentsByClient, filterClients }
