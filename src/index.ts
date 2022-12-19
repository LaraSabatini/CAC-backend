import config from './config';
import express from 'express';

import usersRouter from './routes/auth';

export const app = express();
app.use(express.json());
app.use('/users', usersRouter);


app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

// console.log(`NODE_ENV=${config.NODE_ENV}`);

app.get('/', (_req, res) => {
  res.json({ message: 'ok' });
});

app.listen(config.PORT, () => {
  console.log(`APP LISTENING ON http://${config.HOST}:${config.PORT}`);
});
