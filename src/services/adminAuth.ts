import { ResultSetHeader } from "mysql2"
import pool from "../database/index"
import Admin from "../interfaces/users/Admin"
import statusCodes from "../config/statusCodes"
import sendEmail from "../helpers/sendEmail"
import { encrypt, compare } from "../helpers/handleBcrypt"

const adminRegister = async (req: any, res: any) => {
  try {
    const {
      password,
      email,
      accessPermits,
      loginAttempts,
      accountBlocked,
      firstLogin,
    }: Admin = req.body
    const passwordHash = await encrypt(password)

    const registerAdmin = await pool.query(
      `INSERT INTO admin (email, password, accessPermits, loginAttempts, accountBlocked, firstLogin) VALUES ('${email}', '${passwordHash}', '${accessPermits}', '${loginAttempts}', '${accountBlocked}', '${firstLogin}');`,
    )

    if (registerAdmin) {
      return res.status(statusCodes.CREATED).json({
        message: "Admin registered successfully",
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message:
        "An error has occurred while registering the user, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const adminLogin = async (req: any, res: any) => {
  try {
    const { email, password } = req.body
    const [admin]: any = await pool.query(
      `SELECT * FROM admin WHERE email = '${email}'`,
    )

    if (admin.length) {
      const rowAdminData: Admin[] = admin as Admin[]
      const loginAttempts = rowAdminData[0].loginAttempts + 1

      const checkPassword = await compare(password, admin[0].password)

      if (checkPassword) {
        await pool.query(
          `UPDATE admin SET loginAttempts = '0', accountBlocked='0' WHERE id = ${rowAdminData[0].id}`,
        )

        res.status(statusCodes.CREATED).json({
          message: "Login successfully",
          status: statusCodes.CREATED,
          userId: rowAdminData[0].id,
          firstLogin: rowAdminData[0].firstLogin,
        })
      } else if (admin.length && rowAdminData[0].accountBlocked === 0) {
        if (loginAttempts === 5) {
          const [blockAccount]: any = await pool.query(
            `UPDATE admin SET loginAttempts = '${loginAttempts}', accountBlocked='1' WHERE id = ${rowAdminData[0].id}`,
          )

          const rowBlockAccountData: ResultSetHeader =
            blockAccount as ResultSetHeader

          if (rowBlockAccountData.affectedRows === 1) {
            res.status(statusCodes.UNAUTHORIZED)
            res.send({
              message: "Account blocked",
              status: statusCodes.UNAUTHORIZED,
            })
          }
        } else {
          const [updateLoginAttempts]: any = await pool.query(
            `UPDATE admin SET loginAttempts = '${
              rowAdminData[0].loginAttempts + 1
            }' WHERE id = ${rowAdminData[0].id}`,
          )

          const rowAdminUpdatedData: ResultSetHeader =
            updateLoginAttempts as ResultSetHeader

          res.status(statusCodes.UNAUTHORIZED)
          res.send({
            message: "Wrong password or email",
            status: statusCodes.UNAUTHORIZED,
            loginAttempts:
              rowAdminUpdatedData.affectedRows === 1 &&
              rowAdminData[0].loginAttempts + 1,
          })
        }
      } else {
        res.status(statusCodes.UNAUTHORIZED)
        res.send({
          message: "Account blocked",
          status: statusCodes.UNAUTHORIZED,
        })
      }
    } else {
      const [client]: any = await pool.query(
        `SELECT * FROM clients WHERE email = '${email}'`,
      )
      if (client.length) {
        res.status(statusCodes.NOT_FOUND)
        res.send({ error: "User is client", status: statusCodes.NOT_FOUND })
      } else {
        res.status(statusCodes.NOT_FOUND)
        res.send({ error: "User not found", status: statusCodes.NOT_FOUND })
      }
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const adminChangePassword = async (req: any, res: any) => {
  try {
    const { encrypted } = req.params

    const { id, password, newPassword } = req.body

    const [admin]: any = await pool.query(
      `SELECT * FROM admin WHERE id = '${id}'`,
    )
    let checkPassword: boolean = false

    const passwordHash = await encrypt(newPassword)

    if (encrypted === "true") {
      checkPassword = password === admin[0].password
    } else {
      checkPassword = await compare(password, admin[0].password)
    }

    if (checkPassword) {
      const [changePassword]: any = await pool.query(
        `UPDATE admin SET password = '${passwordHash}' WHERE id = ${id}`,
      )

      if (changePassword) {
        res.status(statusCodes.CREATED)
        res.send({
          message: "Password updated successfully",
          status: statusCodes.CREATED,
        })
      } else {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Something went wrong",
          status: statusCodes.INTERNAL_SERVER_ERROR,
        })
      }
    } else {
      return res.status(statusCodes.UNAUTHORIZED).json({
        message: "Wrong password",
        status: statusCodes.UNAUTHORIZED,
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

const getAdminData = async (req: any, res: any) => {
  try {
    const { id } = req.params

    const [admin]: any = await pool.query(
      `SELECT * FROM admin WHERE id = '${id}'`,
    )

    if (admin) {
      return res.status(statusCodes.OK).json({
        data: admin,
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

const editAdminData = async (req: any, res: any) => {
  try {
    const { id } = req.params
    const { email, accessPermits, firstLogin } = req.body

    const [admin]: any = await pool.query(
      `UPDATE admins SET email = '${email}', accessPermits = '${accessPermits}', firstLogin = '${firstLogin}'  WHERE id = ${id}`,
    )

    if (admin) {
      res.status(statusCodes.CREATED)
      res.send({
        message: "Profile updated successfully",
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

// Mailing
const restoreAdminPasswordEmail = async (req: any, res: any) => {
  try {
    const { recipients } = req.body

    const [admin]: any = await pool.query(
      `SELECT * FROM admins WHERE email = '${recipients[0]}'`,
    )

    if (admin.length) {
      return sendEmail(
        recipients,
        "Recuperacion de contraseña",
        "restorePassword",
        {
          name: req.body.name,
          restorePasswordURL: `${req.body.restorePasswordURL}&pass=${admin[0].password}&id=${admin[0].id}`,
        },
        res,
      )
    }
    res.status(statusCodes.NOT_FOUND)
    res.send({ message: "User does not exist", status: statusCodes.NOT_FOUND })
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

export {
  adminLogin,
  adminRegister,
  adminChangePassword,
  getAdminData,
  editAdminData,
  restoreAdminPasswordEmail,
}
