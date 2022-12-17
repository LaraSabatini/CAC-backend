import pool  from '../database/index';

const getAll = async (_req: any, res: any) => {
  try {
    const [rows] = await pool.query('SELECT * FROM admin');
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// const createUser = async (req: any, res: any) => {
//   try {
//     const [rows] = await pool.query(`INSERT INTO admin(user_name, email, password)
//     VALUES ('${req.body.name}','${req.body.user_name}','${req.body.email}','${req.body.password}')`);
//     res.json(rows);
//   } catch (error) {
//     return res.status(500).json({ message: 'Something went wrong' });
//   }
// };


export { getAll };