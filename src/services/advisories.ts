import pool from "../database/index"
import { ResultSetHeader } from "mysql2"
import config from "../config/index"
import statusCodes from "../config/statusCodes"
import sendEmail from "../helpers/sendEmail"

const getAdminInfo = async (id: number) => {
  const [admin]: any = await pool.query(
    `SELECT email, userName FROM admin WHERE id = '${id}'`,
  )

  return admin[0]
}

const getClientInfo = async (id: number) => {
  const [client]: any = await pool.query(
    `SELECT name, lastName, email FROM clients WHERE id = '${id}'`,
  )

  return client[0]
}

const requestAdvisory = async (req: any, res: any) => {
  try {
    const { adminId, clientId, date, hour, month, brief, eventURL, status } =
      req.body

    const client = await getClientInfo(clientId)

    const [request] = await pool.query(
      `INSERT INTO advisories (adminId, clientId, clientName, date, hour, month, brief, eventURL, status) VALUES ('${adminId}', '${clientId}', '${client.name} ${client.lastName}', '${date}', '${hour}', '${month}', '${brief}', '${eventURL}', '${status}');`,
    )

    if (request) {
      const admin = await getAdminInfo(adminId)
      const rowData: ResultSetHeader = request as ResultSetHeader

      return sendEmail(
        [admin.email],
        "Solicitud de asesoria",
        "requestAdvisory",
        {
          clientName: `${client.name} ${client.lastName}`,
          adminName: `${admin.userName}`,
          dateData: {
            day: date,
            hour,
            brief,
          },
          confirmURL: `${config.FONT_URL}/advisories?id=${rowData.insertId}`,
        },
        res,
      )
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "Internal error",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const getAdvisoriesByMonth = async (req: any, res: any) => {
  try {
    const { month, id, type } = req.params

    const [request] =
      type === "client"
        ? await pool.query(
            `SELECT * FROM advisories WHERE month = '${month}' AND clientId = '${id}';`,
          )
        : await pool.query(
            `SELECT * FROM advisories WHERE month = '${month}' AND adminId = '${id}';`,
          )

    if (request) {
      return res.status(statusCodes.CREATED).json({
        data: request,
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "Internal error",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const requestAdvisoryChange = async (req: any, res: any) => {
  try {
    const { from } = req.params
    const { id, adminId, clientId, date, hour, month, eventURL, status } =
      req.body

    const [advisory]: any = await pool.query(
      `UPDATE advisories SET date = '${date}', hour = '${hour}', month = '${month}', eventURL = '${eventURL}', status = '${status}' WHERE id = ${id}`,
    )

    if (advisory) {
      const admin = await getAdminInfo(adminId)
      const client = await getClientInfo(clientId)

      return sendEmail(
        from === "client" ? [admin.email] : [client.email],
        "Solicitud de modificacion de asesoria",
        "requestAdvisoryChange",
        {
          clientName:
            from === "client"
              ? `${client.name} ${client.lastName}`
              : `${admin.userName}`,
          adminName:
            from === "client"
              ? `${admin.userName}`
              : `${client.name} ${client.lastName}`,
          dateData: {
            day: date,
            hour,
          },
          confirmURL: from === "client" ? "para admin" : "para cliente",
        },
        res,
      )
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "Internal error",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const changeAdvisoryStatus = async (req: any, res: any) => {
  try {
    const { from } = req.params
    const { id, status, adminId, clientId, googleCalendarEvent } = req.body

    const [advisory]: any = await pool.query(
      `UPDATE advisories SET status = '${status}', eventURL = '${googleCalendarEvent}' WHERE id = ${id}`,
    )

    if (advisory) {
      const admin = await getAdminInfo(adminId)
      const client = await getClientInfo(clientId)

      return sendEmail(
        from === "client" ? [admin.email] : [client.email],
        status === "confirmed"
          ? "La solicitud de asesoria ha sido confirmada"
          : "La asesoria ha sido cancelada",
        "changeAdvisoryStatus",
        {
          clientName:
            from === "client"
              ? `${client.name} ${client.lastName}`
              : `${admin.userName}`,
          adminName:
            from === "client"
              ? `${admin.userName}`
              : `${client.name} ${client.lastName}`,
          message: {
            title:
              status === "confirmed"
                ? "La asesoria ha sido confirmada"
                : "La asesoria ha sido cancelada",
            description:
              status === "confirmed"
                ? "tu cita de asesoria ha sido confirmada."
                : "tu cita de asesoria ha sido cancelada.",
          },
          butttonURL:
            status === "confirmed"
              ? {
                  text: "Ver evento en Google Calendar",
                  url: googleCalendarEvent,
                }
              : {
                  text: "ir al soft",
                  url: `${config.FONT_URL}/advisories`,
                },
        },
        res,
      )
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "Internal error",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const createEvent = async (req: any, res: any) => {
  try {
    const {
      title,
      description,
      date,
      hour,
      month,
      eventURL,
      attendant,
      createdBy,
    } = req.body

    const request = await pool.query(
      `INSERT INTO publicEvents (title, description, date, hour, month, eventURL, attendant, createdBy) VALUES ('${title}', '${description}', '${date}', '${hour}', '${month}', '${eventURL}', '${attendant}', '${createdBy}');`,
    )

    if (request) {
      return res.status(statusCodes.CREATED).json({
        message: "success",
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "Internal error",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const getEvents = async (req: any, res: any) => {
  try {
    const { month } = req.params

    const [events]: any = await pool.query(
      `SELECT * FROM publicEvents WHERE month LIKE '${month}'`,
    )

    if (events) {
      return res.status(statusCodes.OK).json({
        data: events,
        status: statusCodes.OK,
      })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "Internal error",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const signUpToEvent = async (req: any, res: any) => {
  try {
    const { id, clientIds } = req.body

    const [event]: any = await pool.query(
      `UPDATE publicEvents SET attendant = '${clientIds}' WHERE id = ${id}`,
    )

    if (event) {
      return res.status(statusCodes.CREATED).json({
        data: "success",
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "Internal error",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const deletePublicEvent = async (req: any, res: any) => {
  try {
    const { id } = req.params

    const [event]: any = await pool.query(
      `DELETE FROM publicEvents WHERE id= '${id}'`,
    )

    if (event) {
      res.status(statusCodes.OK)
      res.send({
        message: "Event deleted successfully",
        status: statusCodes.OK,
      })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "Internal error",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const editPublicEvent = async (req: any, res: any) => {
  try {
    const { id, description, title, date, hour, month } = req.body

    const [event]: any = await pool.query(
      `UPDATE publicEvents SET title = '${title}', description = '${description}', date = '${date}', hour = '${hour}', month = '${month}' WHERE id= '${id}'`,
    )

    if (event) {
      res.status(statusCodes.CREATED)
      res.send({
        message: "Event edited successfully",
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "Internal error",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const getAdvisoriesByMonthAndAdmin = async (req: any, res: any) => {
  try {
    const { month, adminId } = req.params

    const [request] = await pool.query(
      `SELECT * FROM advisories WHERE month = '${month}' AND adminId = '${adminId}';`,
    )

    if (request) {
      return res.status(statusCodes.OK).json({
        data: request,
        status: statusCodes.OK,
      })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "Internal error",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const getAllAdvisoriesByMonth = async (req: any, res: any) => {
  try {
    const { month } = req.params

    const [request] = await pool.query(
      `SELECT * FROM advisories WHERE month = '${month}';`,
    )

    if (request) {
      return res.status(statusCodes.CREATED).json({
        data: request,
        status: statusCodes.CREATED,
      })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "Internal error",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

const getAdvisoryById = async (req: any, res: any) => {
  try {
    const { id } = req.params

    const [request] = await pool.query(
      `SELECT * FROM advisories WHERE id = '${id}';`,
    )

    if (request) {
      return res.status(statusCodes.OK).json({
        data: request,
        status: statusCodes.OK,
      })
    }
  } catch (error) {
    return res.status(statusCodes.OK).json({
      message: "Internal error",
      status: statusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  return {}
}

export {
  requestAdvisory,
  changeAdvisoryStatus,
  createEvent,
  requestAdvisoryChange,
  getEvents,
  signUpToEvent,
  getAdvisoriesByMonth,
  deletePublicEvent,
  editPublicEvent,
  getAdvisoriesByMonthAndAdmin,
  getAllAdvisoriesByMonth,
  getAdvisoryById,
}
