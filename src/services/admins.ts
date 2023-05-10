import pool from "../database/index"
import statusCodes from "../config/statusCodes"
import path from "path"

const getAdmins = async (_req: any, res: any) => {
  try {
    const [admins]: any = await pool.query(
      `SELECT id, userName, email FROM admin`,
    )

    if (admins) {
      return res.status(statusCodes.OK).json({
        data: admins,
        status: statusCodes.OK,
      })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "An error has occurred, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const getAdminName = async (req: any, res: any) => {
  try {
    const { id } = req.params

    const [admin]: any = await pool.query(
      `SELECT userName FROM admin WHERE id = '${id}'`,
    )

    if (admin) {
      return res.status(statusCodes.OK).json({
        data: admin,
        status: statusCodes.OK,
      })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "An error has occurred, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const editAdminData = async (req: any, res: any) => {
  try {
    const { id, userName, email } = req.body

    const [admin]: any = await pool.query(
      `UPDATE admin SET email = '${email}', userName = '${userName}' WHERE id = ${id}`,
    )

    if (admin) {
      return res.status(statusCodes.OK).json({
        data: "success",
        status: statusCodes.OK,
      })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "An error has occurred, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
      error,
    })
  }

  return {}
}

const uploadProfilePic = async (req: any, res: any) => {
  const { file }: any = req.files
  const { id } = req.params

  const filepath = path.resolve(__dirname, "..", "files/profiles", file.name)

  // const profilePic = `https://camarafederal.com.ar/software/api/files/profiles/${file.name}`
  const profilePic = `http://localhost:3001/software/api/files/profiles/${file.name}`

  await pool.query(
    `UPDATE admin SET profilePic = '${profilePic}' WHERE id = ${id}`,
  )

  file.mv(filepath, (err: any) => {
    if (err) {
      res.status(500).send({
        message: "File upload failed",
        code: statusCodes.INTERNAL_SERVER_ERROR,
      })
    }
    res
      .status(200)
      .send({ message: "File Uploaded", code: statusCodes.CREATED })
  })
}

const getProfilePic = async (req: any, res: any) => {
  try {
    const { id } = req.params

    const [admin]: any = await pool.query(
      `SELECT profilePic FROM admin WHERE id = '${id}'`,
    )

    if (admin) {
      return res.status(statusCodes.OK).json({
        data: admin,
        status: statusCodes.OK,
      })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "An error has occurred, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const removeProfilePic = async (req: any, res: any) => {
  try {
    const { id } = req.params

    const [admin]: any = await pool.query(
      `UPDATE admin SET profilePic = '' WHERE id = ${id}`,
    )

    if (admin) {
      return res.status(statusCodes.OK).json({
        data: admin,
        status: statusCodes.OK,
      })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "An error has occurred, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

export {
  getAdmins,
  getAdminName,
  editAdminData,
  uploadProfilePic,
  getProfilePic,
  removeProfilePic,
}
