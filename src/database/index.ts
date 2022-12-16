import { createPool } from 'mysql2/promise';
import config from '../config/index';

const pool = createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

export default pool;