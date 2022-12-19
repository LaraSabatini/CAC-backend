import pool  from '../database/index';
import { encrypt, compare } from '../helpers/handleBcrypt'; 

const register = async (req: any, res: any) => {
  try {
    const { userName, password, email, accessPermits } = req.body;
    const passwordHash = await encrypt(password);

    const registerAdmin = await pool.query(`INSERT INTO admin (userName, email, password, accessPermits) VALUES ('${userName}', '${email}', '${passwordHash}', '${accessPermits}');`);
    
    if (registerAdmin) {
      res.status(200).json({ message: 'Admin registered successfully' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'An error has occurred while registering the user, please try again.' });
  }
};

const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    const [admin]: any = await pool.query(`SELECT * FROM admin WHERE email = '${email}'`);

    if (admin.length) {
      const checkPassword = await compare(password, admin[0].password);

      if (checkPassword) {
        res.status(200).json({ message: 'Login successfully' });
      } else {
        res.status(500);
        res.send({ message: 'Wrong password or email' });
      }
    } else {
      res.status(404);
      res.send({ error: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export { login, register };