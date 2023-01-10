import axios from "axios"
import config from "../config"

const validateReCaptcha = async (req: any, res: any) => {
  const { token } = req.body

  await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${config.RECAPTCHA_PRIVATE_KEY}&response=${token}`,
  )

  if (res.status(200)) {
    res.status(201).json({ message: "Passed validation", status: 201 })
  } else {
    res.status(401).json({ message: "Not passed validation", status: 401 })
  }

  return {}
}

export default validateReCaptcha
