import pool from "../database/index"
import Client from "../interfaces/users/Client"
import { encrypt, compare } from "../helpers/handleBcrypt"

const clientRegister = async (req: any, res: any) => {
  try {
    const {
      name,
      lastName,
      userName,
      email,
      password,
      identificationType,
      identificationNumber,
      phoneAreaCode,
      phoneNumber,
      preferences,
      accountBlocked,
      subscription,
      dateCreated,
    }: Client = req.body
    const passwordHash = await encrypt(password)

    const registerClient = await pool.query(
      `INSERT INTO clients (name,
        lastName,
        userName,
        email,
        password,
        identificationType,
        identificationNumber,
        phoneAreaCode,
        phoneNumber,
        preferences,
        accountBlocked,
        subscription,dateCreated) VALUES ('${name}',
        '${lastName}',
        '${userName}',
        '${email}',
        '${passwordHash}',
        '${identificationType}',
        '${identificationNumber}',
        '${phoneAreaCode}',
        '${phoneNumber}',
        '${preferences}',
        '${accountBlocked}',
        '${subscription}',
        '${dateCreated}');`,
    )

    if (registerClient) {
      res.status(200).json({ message: "Client registered successfully" })
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "An error has occurred while registering the client, please try again.",
    })
  }

  return {}
}

const clientLogin = async (req: any, res: any) => {
  try {
    const { email, password } = req.body
    const [client]: any = await pool.query(
      `SELECT * FROM clients WHERE email = '${email}'`,
    )

    if (client.length) {
      const checkPassword = await compare(password, client[0].password)

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

const clientChangePassword = async (req: any, res: any) => {
  try {
    const { id, newPassword } = req.body
    const passwordHash = await encrypt(newPassword)

    const [client]: any = await pool.query(
      `UPDATE clients SET password = '${passwordHash}' WHERE id = ${id}`,
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

const validateDuplicatedUser = async (req: any, res: any) => {
  try {
    const { email, identificationNumber } = req.body
    const [client]: any = await pool.query(
      `SELECT * FROM clients WHERE email = '${email}' OR identificationNumber = '${identificationNumber}'`,
    )

    if (client.length) {
      res
        .status(200)
        .json({ message: "Cannot create users", status: "duplicated" })
    } else {
      res.status(200)
      res.send({ message: "Can create user", status: "available" })
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" })
  }

  return {}
}

export {
  clientLogin,
  clientRegister,
  clientChangePassword,
  validateDuplicatedUser,
}
