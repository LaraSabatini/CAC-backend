import pool from "../database/index"
import { getOffset } from "../helpers/pagination"
import config from "../config/index"
import statusCodes from "../config/statusCodes"

const getTrainings = async (req: any, res: any) => {
  try {
    const { page } = req.params
    const offset = getOffset(config.listPerPage, page)

    const [trainings] = await pool.query(
      `SELECT * FROM trainings ORDER BY id DESC LIMIT ${offset},${config.listPerPage}`,
    )

    if (trainings) {
      return res
        .status(statusCodes.OK)
        .json({ data: trainings, status: statusCodes.OK })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "An error has occurred, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const createTraining = async (req: any, res: any) => {
  try {
    const { youtubeURL, title, author, description, theme, region } = req.body

    const registerTraining = await pool.query(
      `INSERT INTO trainings (
            youtubeURL,
            title,
            author,
            description,
            theme,
            region) VALUES ('${youtubeURL}', '${title}', '${author}', '${description}', '${theme}','${region}');`,
    )

    if (registerTraining) {
      return res.status(statusCodes.CREATED).json({
        message: "Training created successfully",
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.CREATED).json({
      message:
        "An error has occurred while creating the training, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const deleteTraining = async (req: any, res: any) => {
  try {
    const { id } = req.params

    const [training]: any = await pool.query(
      `DELETE FROM trainings WHERE id=${id}`,
    )

    if (training) {
      res.status(statusCodes.OK)
      res.send({
        message: "Training deleted successfully",
        status: statusCodes.OK,
      })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message:
        "An error has occurred while deleting the training, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const editTraining = async (req: any, res: any) => {
  try {
    const { id } = req.params
    const { youtubeURL, title, author, description, theme, region } = req.body

    const editTraining = await pool.query(
      `UPDATE trainings SET youtubeURL = '${youtubeURL}', title = '${title}', author = '${author}', description = '${description}', theme = '${theme}', region = '${region}' WHERE id = ${id}`,
    )

    if (editTraining) {
      return res.status(statusCodes.CREATED).json({
        message: "Training edited successfully",
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.CREATED).json({
      message:
        "An error has occurred while creating the training, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

export { getTrainings, createTraining, deleteTraining, editTraining }
