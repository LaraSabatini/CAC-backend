import axios from "axios"
import config from "../config"
import statusCodes from "../config/statusCodes"

const validateReCaptcha = async (req: any, res: any) => {
  const { token } = req.body

  await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${config.RECAPTCHA_PRIVATE_KEY}&response=${token}`,
  )

  if (res.status(statusCodes.OK)) {
    res
      .status(statusCodes.CREATED)
      .json({ message: "Passed validation", status: statusCodes.CREATED })
  } else {
    res.status(statusCodes.UNAUTHORIZED).json({
      message: "Not passed validation",
      status: statusCodes.UNAUTHORIZED,
    })
  }

  return {}
}

export default validateReCaptcha
