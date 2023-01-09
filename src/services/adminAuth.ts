import { ResultSetHeader } from "mysql2"
import pool from "../database/index"
import Admin from "../interfaces/users/Admin"
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
      return res
        .status(201)
        .json({ message: "Admin registered successfully", status: 201 })
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "An error has occurred while registering the user, please try again.",
      status: 500,
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

        res.status(201).json({ message: "Login successfully", status: 201 })
      } else if (admin.length && rowAdminData[0].accountBlocked === 0) {
        if (loginAttempts === 5) {
          const [blockAccount]: any = await pool.query(
            `UPDATE admin SET loginAttempts = '${loginAttempts}', accountBlocked='1' WHERE id = ${rowAdminData[0].id}`,
          )

          const rowBlockAccountData: ResultSetHeader =
            blockAccount as ResultSetHeader

          if (rowBlockAccountData.affectedRows === 1) {
            res.status(401)
            res.send({
              message: "Account blocked",
              status: 401,
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

          res.status(401)
          res.send({
            message: "Wrong password or email",
            status: 401,
            loginAttempts:
              rowAdminUpdatedData.affectedRows === 1 &&
              rowAdminData[0].loginAttempts + 1,
          })
        }
      } else {
        res.status(401)
        res.send({
          message: "Account blocked",
          status: 401,
        })
      }
    } else {
      res.status(404)
      res.send({ error: "User not found", status: 404 })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", status: 500 })
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
      res.status(201)
      res.send({ message: "Password updated successfully", status: 201 })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", status: 500 })
  }

  return {}
}

export { adminLogin, adminRegister, adminChangePassword }
