import express from 'express';
import { getAll } from '../services/auth.service';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('/', getAll);

const users: { user:string, password:string }[] = [];

router.post('/', async (req, res) => {
  const user = req.body.user_name;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  users.push({ user: user, password: hashedPassword });
  res.status(201).send(users);
  console.log(users);
});

export default router;