import { ResultSetHeader } from "mysql2"
import pool from "../database/index"
import Client from "../interfaces/users/Client"
import { encrypt, compare } from "../helpers/handleBcrypt"

const clientRegister = async (req: any, res: any) => {
  try {
    const {
      name,
      lastName,
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
      loginAttempts,
    }: Client = req.body
    const passwordHash = await encrypt(password)

    const [registerClient] = await pool.query(
      `INSERT INTO clients (name,
        lastName,
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
        loginAttempts) VALUES ('${name}',
        '${lastName}',
        '${email}',
        '${passwordHash}',
        '${identificationType}',
        '${identificationNumber}',
        '${phoneAreaCode}',
        '${phoneNumber}',
        '${preferences}',
        '${accountBlocked}',
        '${subscription}',
        '${dateCreated}',
        '${loginAttempts}');`,
    )

    if (registerClient) {
      const rowData: ResultSetHeader = registerClient as ResultSetHeader

      res.status(201).json({
        message: "Client registered successfully",
        clientId: rowData.insertId,
        status: 201,
      })
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "An error has occurred while registering the client, please try again.",
      status: 500,
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
      const rowClientData: Client[] = client as Client[]
      const loginAttempts = rowClientData[0].loginAttempts + 1

      if (checkPassword) {
        await pool.query(
          `UPDATE clients SET loginAttempts = '0', accountBlocked='0' WHERE id = ${rowClientData[0].id}`,
        )

        res.status(201).json({ message: "Login successfully", status: 201 })
      } else if (client.length && rowClientData[0].accountBlocked === 0) {
        if (loginAttempts === 5) {
          const [blockAccount]: any = await pool.query(
            `UPDATE clients SET loginAttempts = '${loginAttempts}', accountBlocked='1' WHERE id = ${rowClientData[0].id}`,
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
            `UPDATE clients SET loginAttempts = '${
              rowClientData[0].loginAttempts + 1
            }' WHERE id = ${rowClientData[0].id}`,
          )

          const rowClientUpdatedData: ResultSetHeader =
            updateLoginAttempts as ResultSetHeader

          res.status(401)
          res.send({
            message: "Wrong password or email",
            status: 401,
            loginAttempts:
              rowClientUpdatedData.affectedRows === 1 &&
              rowClientData[0].loginAttempts + 1,
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

const clientChangePassword = async (req: any, res: any) => {
  try {
    const { id, newPassword } = req.body
    const passwordHash = await encrypt(newPassword)

    const [client]: any = await pool.query(
      `UPDATE clients SET password = '${passwordHash}' WHERE id = ${id}`,
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

const validateDuplicatedUser = async (req: any, res: any) => {
  try {
    const { email, identificationNumber } = req.body

    const [client]: any = await pool.query(
      `SELECT * FROM clients WHERE email LIKE '${email}' OR identificationNumber LIKE '${identificationNumber}'`,
    )

    if (client.length) {
      res.status(401).json({
        message: "Cannot create user",
        info: "duplicated",
        status: 401,
      })
    } else {
      res.status(200)
      res.send({ message: "Can create user", info: "available", status: 200 })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", status: 500 })
  }

  return {}
}

export {
  clientLogin,
  clientRegister,
  clientChangePassword,
  validateDuplicatedUser,
}
