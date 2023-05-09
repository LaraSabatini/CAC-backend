import hbs, {
  NodemailerExpressHandlebarsOptions,
} from "nodemailer-express-handlebars"
import nodemailer from "nodemailer"
import path from "path"
import config from "../config/index"
import statusCodes from "../config/statusCodes"

const handlebarOptions: NodemailerExpressHandlebarsOptions = {
  viewEngine: {
    partialsDir: path.resolve(__dirname, "..", "views"),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname, "..", "views"),
}

const transportInfo = {
  host: config.MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: config.EMAIL,
    pass: config.MAIL_PASS,
  },
}

const sendEmail = (
  to: string[],
  subject: string,
  template: string,
  context: any,
  res: any,
) => {
  const transporter = nodemailer.createTransport(transportInfo)

  transporter.use("compile", hbs(handlebarOptions))

  const mailOptions = {
    from: '"Camara federal" <info@vonceescalada.com>', // OR hola@camarafederal.com.ar>
    to,
    subject,
    template,
    context,
  }

  transporter.sendMail(mailOptions, (error: any) => {
    if (error) {
      return res.status(statusCodes.CREATED).json({
        message: "Something went wrong",
        status: statusCodes.INTERNAL_SERVER_ERROR,
      })
    }
    return res.status(statusCodes.CREATED).json({
      message: "Email sent successfully",
      status: statusCodes.CREATED,
    })
  })
}

export default sendEmail
