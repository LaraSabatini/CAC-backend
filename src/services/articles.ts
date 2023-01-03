import pool from "../database/index"
import config from "../config/index"
import { getOffset } from "../helpers/pagination"

const createArticle = async (req: any, res: any) => {
  try {
    const {
      title,
      description,
      categories,
      picture,
      attachment,
      createdBy,
      changesHistory,
    } = req.body

    const registerArticle = await pool.query(
      `INSERT INTO articles (
        title,
        description,
        categories,
        picture,
        attachment,
        createdBy,
        changesHistory) VALUES ('${title}', '${description}', '${categories}', '${picture}', '${attachment}', '${createdBy}', '${changesHistory}');`,
    )

    if (registerArticle) {
      return res
        .status(200)
        .json({ message: "Article created successfully", status: 200 })
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "An error has occurred while creating the article, please try again.",
      status: 500,
    })
  }

  return {}
}

const getArticles = async (req: any, res: any) => {
  try {
    const { page } = req.params
    const offset = getOffset(config.listPerPage, page)

    const [articles] = await pool.query(
      `SELECT * FROM articles LIMIT ${offset},${config.listPerPage}`,
    )
    const [amountOfPages] = await pool.query(`SELECT COUNT(*) FROM articles`)

    if (articles) {
      const meta = {
        page,
        totalPages: amountOfPages,
      }

      return res.status(200).json({
        data: articles,
        meta,
        status: 200,
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: "An error has occurred, please try again.",
      status: 500,
    })
  }

  return {}
}

const editArticle = async (req: any, res: any) => {
  try {
    const {
      title,
      description,
      categories,
      picture,
      attachment,
      createdBy,
      changesHistory,
    } = req.body
    const { id } = req.params

    const [article]: any = await pool.query(
      `UPDATE article SET title = '${title}', description = '${description}', categories = '${categories}', picture = '${picture}', attachment = '${attachment}', createdBy = '${createdBy}', changesHistory = '${changesHistory}' WHERE id = ${id}`,
    )

    if (article) {
      res.status(200)
      res.send({ message: "Article updated successfully", status: 200 })
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "An error has occurred while updating the article, please try again.",
      status: 500,
    })
  }

  return {}
}

const deleteArticle = async (req: any, res: any) => {
  try {
    const { id } = req.params

    const [article]: any = await pool.query(
      `DELETE FROM articles WHERE id=${id}`,
    )

    if (article) {
      res.status(200)
      res.send({ message: "Article deleted successfully", status: 200 })
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "An error has occurred while deleting the article, please try again.",
      status: 500,
    })
  }

  return {}
}

export { createArticle, getArticles, editArticle, deleteArticle }
