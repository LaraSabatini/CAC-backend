import { ResultSetHeader } from "mysql2"
import pool from "../database/index"
import Client from "../interfaces/users/Client"
import statusCodes from "../config/statusCodes"
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

      res.status(statusCodes.CREATED).json({
        message: "Client registered successfully",
        clientId: rowData.insertId,
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message:
        "An error has occurred while registering the client, please try again.",
      status: statusCodes.INTERNAL_SERVER_ERROR,
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

        res.status(statusCodes.CREATED).json({
          message: "Login successfully",
          status: statusCodes.CREATED,
          clientId: rowClientData[0].id,
        })
      } else if (rowClientData[0].accountBlocked === 0) {
        if (loginAttempts === 5) {
          const [blockAccount]: any = await pool.query(
            `UPDATE clients SET loginAttempts = '${loginAttempts}', accountBlocked='1' WHERE id = ${rowClientData[0].id}`,
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
            `UPDATE clients SET loginAttempts = '${
              rowClientData[0].loginAttempts + 1
            }' WHERE id = ${rowClientData[0].id}`,
          )

          const rowClientUpdatedData: ResultSetHeader =
            updateLoginAttempts as ResultSetHeader

          res.status(statusCodes.UNAUTHORIZED)
          res.send({
            message: "Wrong password or email",
            status: statusCodes.UNAUTHORIZED,
            loginAttempts:
              rowClientUpdatedData.affectedRows === 1 &&
              rowClientData[0].loginAttempts + 1,
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
      const [admin]: any = await pool.query(
        `SELECT * FROM admin WHERE email = '${email}'`,
      )
      if (admin.length) {
        res.status(statusCodes.NOT_FOUND)
        res.send({ error: "User is admin", status: statusCodes.NOT_FOUND })
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

const clientChangePassword = async (req: any, res: any) => {
  try {
    const { id, newPassword } = req.body
    const passwordHash = await encrypt(newPassword)

    const [client]: any = await pool.query(
      `UPDATE clients SET password = '${passwordHash}' WHERE id = ${id}`,
    )

    if (client) {
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

const validateDuplicatedUser = async (req: any, res: any) => {
  try {
    const { email, identificationNumber } = req.body

    const [client]: any = await pool.query(
      `SELECT * FROM clients WHERE email LIKE '${email}' OR identificationNumber LIKE '${identificationNumber}'`,
    )

    if (client.length) {
      res.status(statusCodes.UNAUTHORIZED).json({
        message: "Cannot create user",
        info: "duplicated",
        status: statusCodes.UNAUTHORIZED,
      })
    } else {
      res.status(200)
      res.send({ message: "Can create user", info: "available", status: 200 })
    }
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

export {
  clientLogin,
  clientRegister,
  clientChangePassword,
  validateDuplicatedUser,
}
