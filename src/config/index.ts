import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB,
  },
  listPerPage: 25,
};

export default config;
