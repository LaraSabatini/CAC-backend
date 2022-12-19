import pool from "../database/index"
import { encrypt, compare } from "../helpers/handleBcrypt"

const adminRegister = async (req: any, res: any) => {
  try {
    const { userName, password, email, accessPermits } = req.body
    const passwordHash = await encrypt(password)

    const registerAdmin = await pool.query(
      `INSERT INTO admin (userName, email, password, accessPermits) VALUES ('${userName}', '${email}', '${passwordHash}', '${accessPermits}');`,
    )

    if (registerAdmin) {
      return res.status(200).json({ message: "Admin registered successfully" })
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "An error has occurred while registering the user, please try again.",
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
        res.status(200).json({ message: "Login successfully" })
      } else {
        res.status(500)
        res.send({ message: "Wrong password or email" })
      }
    } else {
      res.status(404)
      res.send({ error: "User not found" })
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" })
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
      res.status(200)
      res.send({ message: "Password updated successfully" })
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" })
  }

  return {}
}

export { adminLogin, adminRegister, adminChangePassword }
