import { createPool } from "mysql2/promise"
import config from "../config/index"

const pool = createPool({
  host: config.DB.host,
  user: config.DB.user,
  password: config.DB.password,
  database: config.DB.database,
})

export default pool
