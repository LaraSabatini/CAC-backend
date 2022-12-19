import pool  from '../database/index';

const getAll = async (_req: any, res: any) => {
  try {
    const [rows] = await pool.query('SELECT * FROM admin');
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export { getAll };