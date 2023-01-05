import pool from "../database/index"
import Admin from "../interfaces/users/Admin"
import { encrypt, compare } from "../helpers/handleBcrypt"

const adminRegister = async (req: any, res: any) => {
  try {
    const { userName, password, email, accessPermits }: Admin = req.body
    const passwordHash = await encrypt(password)

    const registerAdmin = await pool.query(
      `INSERT INTO admin (userName, email, password, accessPermits) VALUES ('${userName}', '${email}', '${passwordHash}', '${accessPermits}');`,
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
      const checkPassword = await compare(password, admin[0].password)

      if (checkPassword) {
        res.status(201).json({ message: "Login successfully", status: 201 })
      } else {
        res.status(401)
        res.send({ message: "Wrong password or email", status: 401 })
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

    const [client]: any = await pool.query(
      `UPDATE admin SET password = '${passwordHash}' WHERE id = ${id}`,
    )

    if (client) {
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
