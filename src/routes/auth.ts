import express from 'express';
import { register, login } from '../services/adminAuth';

const router = express.Router();

router.post('/admin/login', login);

router.post('/admin/register', register);


export default router;