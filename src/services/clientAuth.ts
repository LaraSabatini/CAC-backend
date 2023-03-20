import { ResultSetHeader } from "mysql2"
import pool from "../database/index"
import Client from "../interfaces/users/Client"
import statusCodes from "../config/statusCodes"
import sendEmail from "../helpers/sendEmail"
import { getOffset } from "../helpers/pagination"
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
      firstLogin,
      plan,
      region,
      paymentDate,
      paymentExpireDate,
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
        loginAttempts,
        firstLogin,
        plan,
        region,
        paymentDate,
        paymentExpireDate
        ) VALUES ('${name}',
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
        '${loginAttempts}',
        '${firstLogin}',
        '${plan}',
        '${region}',
        '${paymentDate}',
        '${paymentExpireDate}'
        );`,
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

    if (client.length && client[0].accountBlocked === 0) {
      const checkPassword = await compare(password, client[0].password)
      const rowClientData: Client[] = client as Client[]
      const loginAttempts = rowClientData[0].loginAttempts + 1

      if (checkPassword) {
        await pool.query(
          `UPDATE clients SET loginAttempts = '0' WHERE id = ${rowClientData[0].id}`,
        )

        res.status(statusCodes.CREATED).json({
          message: "Login successfully",
          status: statusCodes.CREATED,
          userId: rowClientData[0].id,
          firstLogin: rowClientData[0].firstLogin,
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
      } else if (client[0].accountBlocked === 1) {
        res.status(statusCodes.UNAUTHORIZED)
        res.send({
          message: "Account blocked",
          status: statusCodes.UNAUTHORIZED,
        })
      } else {
        res.status(statusCodes.NOT_FOUND)
        res.send({ error: "User not found", status: statusCodes.NOT_FOUND })
      }
    }
  } catch (error) {
    res.status(statusCodes.NOT_FOUND)
    res.send({ error: "User not found", status: statusCodes.NOT_FOUND })
  }

  return {}
}

const clientChangePassword = async (req: any, res: any) => {
  try {
    const { encrypted } = req.params
    const { id, password, newPassword } = req.body

    const [client]: any = await pool.query(
      `SELECT * FROM clients WHERE id = '${id}'`,
    )

    let checkPassword: boolean = false

    if (encrypted === "true") {
      checkPassword = password === client[0].password
    } else {
      checkPassword = await compare(password, client[0].password)
    }

    const passwordHash = await encrypt(newPassword)

    if (checkPassword) {
      const [changePassword]: any = await pool.query(
        `UPDATE clients SET password = '${passwordHash}', firstLogin = '0' WHERE id = ${id}`,
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

const validateEmail = async (req: any, res: any) => {
  try {
    const { email } = req.body

    const [client]: any = await pool.query(
      `SELECT * FROM clients WHERE email LIKE '${email}'`,
    )

    if (client.length) {
      res.status(statusCodes.UNAUTHORIZED).json({
        message: "Cannot create user",
        info: "duplicated",
        status: statusCodes.UNAUTHORIZED,
      })
    } else {
      res.status(statusCodes.OK)
      res.send({
        message: "Can create user",
        info: "available",
        status: statusCodes.OK,
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

const validateIdentificationNumber = async (req: any, res: any) => {
  try {
    const { identificationNumber } = req.body

    const [client]: any = await pool.query(
      `SELECT * FROM clients WHERE identificationNumber LIKE '${identificationNumber}'`,
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

const getClientData = async (req: any, res: any) => {
  try {
    const { id } = req.params

    const [client]: any = await pool.query(
      `SELECT * FROM clients WHERE id = '${id}'`,
    )

    if (client) {
      return res.status(statusCodes.OK).json({
        data: client,
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

const editClientData = async (req: any, res: any) => {
  try {
    const { id } = req.params
    const {
      email,
      name,
      lastName,
      identificationType,
      identificationNumber,
      phoneAreaCode,
      phoneNumber,
      firstLogin,
      region,
    } = req.body

    const [client]: any = await pool.query(
      `UPDATE clients SET email = '${email}', name = '${name}', lastName = '${lastName}', identificationType = '${identificationType}', identificationNumber = '${identificationNumber}',
      phoneAreaCode = '${phoneAreaCode}',
      phoneNumber = '${phoneNumber}',
      firstLogin = '${firstLogin}',
      region = '${region}'
      WHERE id = ${id}`,
    )

    if (client) {
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

const blockAccount = async (req: any, res: any) => {
  try {
    const { id, action } = req.params

    const [client]: any = await pool.query(
      `UPDATE clients SET accountBlocked = ${
        action === "block" ? "1" : "0"
      }, subscription = ${action === "block" ? "0" : "1"} WHERE id = ${id}`,
    )

    if (client) {
      res.status(statusCodes.CREATED)
      res.send({
        message: `Account ${
          action === "block" ? "blocked" : "unblocked"
        } successfully`,
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
const registerSuccessEmail = async (req: any, res: any) => {
  return sendEmail(
    [req.body.recipients],
    "Registro existoso",
    "registerSuccess",
    {
      name: req.body.name,
      item: req.body.item,
      email: req.body.recipients[0],
      password: req.body.password,
      loginURL: req.body.loginURL,
    },
    res,
  )
}

const restoreClientPasswordEmail = async (req: any, res: any) => {
  try {
    const { recipients } = req.body

    const [client]: any = await pool.query(
      `SELECT * FROM clients WHERE email LIKE '${recipients[0]}'`,
    )

    if (client.length) {
      return sendEmail(
        recipients,
        "Recuperación de contraseña",
        "restorePassword",
        {
          name: req.body.name,
          restorePasswordURL: `${req.body.restorePasswordURL}&pass=${client[0].password}&id=${client[0].id}`,
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

const updateClientPaymentData = async (req: any, res: any) => {
  try {
    const { id } = req.params
    const { plan, region, paymentDate, paymentExpireDate } = req.body

    const [client]: any = await pool.query(
      `UPDATE clients SET plan = '${plan}',
      region = '${region}',
      paymentDate = '${paymentDate}',
      paymentExpireDate = '${paymentExpireDate}'
      WHERE id = ${id}`,
    )

    if (client) {
      res.status(statusCodes.CREATED)
      res.send({
        message: "Payment data updated successfully",
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

const getClientDataForTable = async (req: any, res: any) => {
  try {
    const { page } = req.params
    const offset = getOffset(10, page)

    const [client]: any = await pool.query(
      `SELECT name, lastName, id, plan, identificationNumber, region, dateCreated FROM clients LIMIT ${offset},10`,
    )

    const [amountOfPages] = await pool.query(`SELECT COUNT(*) FROM clients`)

    if (client) {
      const rowData: any = amountOfPages as ResultSetHeader

      const meta = {
        page,
        totalPages: Math.ceil(rowData[0]["COUNT(*)"] / 10),
      }

      return res.status(statusCodes.OK).json({
        data: client,
        meta,
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

const accountBlockedNotificationEmail = async (req: any, res: any) => {
  return sendEmail(
    [req.body.recipients],
    "Cuenta bloqueada",
    "accountBlockedNotification",
    {
      name: req.body.name,
      email: req.body.recipients[0],
      motive: req.body.motive,
      supportURL: req.body.supportURL,
    },
    res,
  )
}

const accountUnblockedNotificationEmail = async (req: any, res: any) => {
  return sendEmail(
    [req.body.recipients],
    "Cuenta desbloqueada",
    "accountUnblockedNotification",
    {
      name: req.body.name,
      email: req.body.recipients[0],
      loginURL: req.body.loginURL,
    },
    res,
  )
}

export {
  clientLogin,
  clientRegister,
  clientChangePassword,
  validateEmail,
  validateIdentificationNumber,
  getClientData,
  editClientData,
  blockAccount,
  registerSuccessEmail,
  restoreClientPasswordEmail,
  updateClientPaymentData,
  getClientDataForTable,
  accountBlockedNotificationEmail,
  accountUnblockedNotificationEmail,
}
