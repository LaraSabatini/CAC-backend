import * as dotenv from "dotenv"
import path from "path"

dotenv.config({
  path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`),
})

const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  HOST: process.env.HOST || "localhost",
  PORT: process.env.PORT || 3000,
  DB: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB,
  },
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PASS: process.env.MAIL_PASS,
  EMAIL: process.env.EMAIL,
  MP_PUBLIC_KEY_AS_SELLER: process.env.MP_PUBLIC_KEY_AS_SELLER,
  MP_ACCESS_TOKEN_AS_SELLER: process.env.MP_ACCESS_TOKEN_AS_SELLER,
  MP_PUBLIC_KEY_AS_BUYER: process.env.MP_PUBLIC_KEY_AS_BUYER,
  MP_ACCESS_TOKEN_AS_BUYER: process.env.MP_ACCESS_TOKEN_AS_BUYER,
  RECAPTCHA_PUBLIC_KEY: process.env.RECAPTCHA_PUBLIC_KEY,
  RECAPTCHA_PRIVATE_KEY: process.env.RECAPTCHA_PRIVATE_KEY,
  listPerPage: 25,
}

export default config
