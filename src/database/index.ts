import mysql from 'mysql2';
import config from '../config/index';

const db = mysql.createConnection(config.db);

export default db;