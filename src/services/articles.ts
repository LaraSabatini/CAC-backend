import { ResultSetHeader } from "mysql2"
import pool from "../database/index"
import config from "../config/index"
import statusCodes from "../config/statusCodes"
import ArticleInterface from "../interfaces/content/Article"
import { getOffset } from "../helpers/pagination"

const createArticle = async (req: any, res: any) => {
  try {
    const {
      title,
      description,
      createdBy,
      changesHistory,
      portrait,
      subtitle,
      regionFilters,
      themeFilters,
      article,
      attachments,
      author,
    }: ArticleInterface = req.body

    const registerArticle = await pool.query(
      `INSERT INTO articles (
        title,
        description,
        createdBy,
        changesHistory, 
        portrait,
        subtitle,
        regionFilters, 
        themeFilters, 
        article,
        attachments, 
        author) VALUES ('${title}', '${description}', '${createdBy}', '${changesHistory}', '${portrait}','${subtitle}', '${regionFilters}',
        '${themeFilters}', '${article}', '${attachments}','${author}');`,
    )

    if (registerArticle) {
      return res.status(statusCodes.CREATED).json({
        message: "Article created successfully",
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message:
        "An error has occurred while creating the article, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
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
      const rowData: ResultSetHeader = amountOfPages as ResultSetHeader

      const meta = {
        page,
        totalPages: parseInt(Object.keys(rowData)[0], 10),
      }

      return res.status(statusCodes.OK).json({
        data: articles,
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

const editArticle = async (req: any, res: any) => {
  try {
    const {
      title,
      description,
      createdBy,
      changesHistory,
      portrait,
      subtitle,
      regionFilters,
      themeFilters,
      article,
      attachments,
      author,
    }: ArticleInterface = req.body
    const { id } = req.params

    const [articleEntry]: any = await pool.query(
      `UPDATE articles SET title = '${title}', description = '${description}', createdBy = '${createdBy}', changesHistory = '${changesHistory}',
      portrait = '${portrait}', subtitle = '${subtitle}', regionFilters = '${regionFilters}', themeFilters = '${themeFilters}',
      article = '${article}', attachments = '${attachments}', author = '${author}' WHERE id = ${id}`,
    )

    if (articleEntry) {
      res.status(statusCodes.CREATED)
      res.send({
        message: "Article updated successfully",
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message:
        "An error has occurred while updating the article, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
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
      res.status(statusCodes.OK)
      res.send({
        message: "Article deleted successfully",
        status: statusCodes.OK,
      })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message:
        "An error has occurred while deleting the article, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const getArticleById = async (req: any, res: any) => {
  try {
    const { id } = req.params

    const [article] = await pool.query(
      `SELECT * FROM articles WHERE id = '${id}'`,
    )

    if (article) {
      return res.status(statusCodes.OK).json({
        data: article,
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

const getRelatedArticles = async (req: any, res: any) => {
  try {
    const { themeId, regionId } = req.params

    const [relatedArticles] = await pool.query(
      `SELECT * FROM articles WHERE regionFilters LIKE '%${regionId}%' OR themeFilters LIKE '%${themeId}%' LIMIT 2`,
    )

    if (relatedArticles) {
      return res.status(statusCodes.OK).json({
        data: relatedArticles,
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

const filterArticles = async (req: any, res: any) => {
  try {
    const { regionIds, themeIds } = req.body

    let articles: any[] = []

    for (let i = 0; i < regionIds.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const [results]: any[] = await pool.query(
        `SELECT * FROM articles WHERE regionFilters LIKE '%${regionIds[i]}%'`,
      )

      articles = [...articles, ...results]
    }

    for (let i = 0; i < themeIds.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const [results]: any[] = await pool.query(
        `SELECT * FROM articles WHERE themeFilters LIKE '%${themeIds[i]}%'`,
      )
      articles = [...articles, ...results]
    }

    if (articles) {
      return res.status(statusCodes.OK).json({
        data: articles,
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

export {
  createArticle,
  getArticles,
  editArticle,
  deleteArticle,
  getArticleById,
  getRelatedArticles,
  filterArticles,
}
