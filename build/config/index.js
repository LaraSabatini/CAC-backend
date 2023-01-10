import * as dotenv from "dotenv";
import path from "path";
dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`),
});
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
    MP_PUBLIC_KEY_TEST: process.env.MP_PUBLIC_KEY_TEST,
    MP_ACCESS_TOKEN_TEST: process.env.MP_ACCESS_TOKEN_TEST,
    MP_PUBLIC_KEY_OWN: process.env.MP_PUBLIC_KEY_OWN,
    MP_ACCESS_TOKEN_OWN: process.env.MP_ACCESS_TOKEN_OWN,
    listPerPage: 25,
};
export default config;
