import config from './config';
import express from 'express';

const app = express();

import usersRouter from '../src/routes/auth.route';

app.use(express.json());
app.use('/users', usersRouter);


console.log(`NODE_ENV=${config.NODE_ENV}`);

app.get('/', (_req, res) => {
  res.send('Hello World !!');
});

app.listen(config.PORT, () => {
  console.log(`APP LISTENING ON http://${config.HOST}:${config.PORT}`);
});
