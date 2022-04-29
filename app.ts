import createError, { HttpError } from 'http-errors';
import express, { json, NextFunction, Request, Response, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'module-alias/register';

import '@db/connection'

import indexRouter from '@routes/indexRouter';
import accountRouter from '@routes/accountRouter';
import ingredientRouter from '@routes/ingredientRouter';
import seedRouter from '@routes/seedRouter';

import { accessLogger, errorLogger, seedLogger } from '@utils/logUtil';

import createRestAPIError, { RestAPIError } from '@error/createRestAPIError';

const app = express();

//---------------------
//   CORS
//---------------------
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || process.env.ORIGIN?.split(' ').includes(origin)) {
        cb(null, true);
      } else {
        cb(createRestAPIError('CORS'));
      }                                     
    },
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
  })
);

//---------------------
//   MODULES
//---------------------
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

//---------------------
//   LOGGER
//---------------------
app.use(errorLogger);
app.use(seedLogger);
app.use(accessLogger);

//---------------------
//   ROUTES
//---------------------
app.use('/', indexRouter);
app.use('/accounts', accountRouter);
app.use('/ingredients', ingredientRouter);
app.use('/seed', seedRouter);

app.get('/health', (_req, res) => {
  res.send({ status: 'This service is healthy.' });
});

app.use(function (_req: Request, _res: Response, next: NextFunction) {
  next(createError(404));
});

//---------------------
//   ERROR HANDLER
//---------------------
app.use(function (err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError || err instanceof RestAPIError) {
    const status = err.status || 500;
    res.status(status).send({ status, name: err.name, message: err.message, method: req.method, path: req.path });
  } else if (err instanceof Error) {
    res.status(500).send({ status: 500, name: err.name, message: err.message, method: req.method, path: req.path });
  } else {
    res.status(500).send({
      status: 500,
      name: createError(500).name,
      message: 'Something went wrong',
      method: req.method,
      path: req.path,
    });
  }
});

//---------------------
//   LISTENER
//---------------------
const port = process.env.PORT;

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});

export default app;
