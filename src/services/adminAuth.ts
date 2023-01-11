import { ResultSetHeader } from "mysql2"
import pool from "../database/index"
import Admin from "../interfaces/users/Admin"
import statusCodes from "../config/statusCodes"
import { encrypt, compare } from "../helpers/handleBcrypt"

const adminRegister = async (req: any, res: any) => {
  try {
    const {
      userName,
      password,
      email,
      accessPermits,
      loginAttempts,
      accountBlocked,
    }: Admin = req.body
    const passwordHash = await encrypt(password)

    const registerAdmin = await pool.query(
      `INSERT INTO admin (userName, email, password, accessPermits, loginAttempts, accountBlocked) VALUES ('${userName}', '${email}', '${passwordHash}', '${accessPermits}', '${loginAttempts}', '${accountBlocked}');`,
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

        res
          .status(statusCodes.CREATED)
          .json({ message: "Login successfully", status: statusCodes.CREATED })
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
    const { id, newPassword } = req.body
    const passwordHash = await encrypt(newPassword)

    const [admin]: any = await pool.query(
      `UPDATE admin SET password = '${passwordHash}' WHERE id = ${id}`,
    )

    if (admin) {
      res.status(statusCodes.CREATED)
      res.send({
        message: "Password updated successfully",
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

export { adminLogin, adminRegister, adminChangePassword }
