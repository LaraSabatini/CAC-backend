import express from 'express';
import { getAll } from '../services/auth.service';

const router = express.Router();

router.get('/', getAll);


export default router;